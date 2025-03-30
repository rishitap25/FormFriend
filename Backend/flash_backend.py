import os
import cv2
import pytesseract
from flask import Flask, request, jsonify
from PIL import Image
from pdf2image import convert_from_path
from deep_translator import GoogleTranslator
from PyDictionary import PyDictionary
from dotenv import load_dotenv
import google.generativeai as genai
from werkzeug.utils import secure_filename


# Load .env and Gemini API
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash-lite")

# Tesseract path (adjust for Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ======== CORE LOGIC FUNCTIONS ========

def detect_blank_fields(image_path, save_path="detected_fields.jpg"):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    kernel_horizontal = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 1))
    kernel_box = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 10))
    horizontal_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel_horizontal)
    boxes = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel_box)
    combined = cv2.bitwise_or(horizontal_lines, boxes)
    contours, _ = cv2.findContours(combined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if 30 < w < 800 and 10 < h < 100:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.imwrite(save_path, img)
    return save_path

def extract_text(path):
    file_ext = os.path.splitext(path)[1].lower()
    all_text = ""
    if file_ext == ".pdf":
        images = convert_from_path(path)
        for page in images:
            all_text += pytesseract.image_to_string(page) + "\n"
    elif file_ext in [".png", ".jpg", ".jpeg"]:
        img = Image.open(path)
        all_text += pytesseract.image_to_string(img) + "\n"
    else:
        return "❌ Unsupported file type."
    
    detect_blank_fields(path)
    return all_text

def analyze_with_gemini(text):
    prompt = (
        "You're an AI assistant analyzing scanned forms. Based on the OCR text below:\n"
        "1. Identify the likely blank fields (e.g., 'Name: ______', 'Date of Birth: ______').\n"
        "2. List the documents someone would likely need to complete this form (e.g., passport, ID).\n"
        "Format your response like this:\n\n"
        "**Likely Blank Fields:**\n"
        "- Full Name\n"
        "- Date of Birth\n"
        "- Address\n\n"
        "**Required Documents:**\n"
        "- Passport\n"
        "- Proof of Residency\n\n"
        f"Form Text:\n{text}"
    )
    response = model.generate_content(prompt)
    if "**Required Documents:**" in response.text:
        parts = response.text.split("**Required Documents:**")
        blanks = parts[0].replace("**Likely Blank Fields:**", "").strip()
        docs = parts[1].strip()
        return blanks, docs
    return "Could not parse blank fields.", response.text

def translate_or_define(term, target_lang):
    if target_lang == "en":
        dictionary = PyDictionary()
        meaning = dictionary.meaning(term)
        if not meaning:
            return "❌ No definition found."
        result = ""
        for part, defs in meaning.items():
            result += f"{part}:\n" + "\n".join(f"- {d}" for d in defs) + "\n"
        return result
    else:
        return GoogleTranslator(source="en", target=target_lang).translate(term)

# ======== API ROUTES ========

@app.route("/ocr", methods=["POST"])
def ocr_endpoint():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        filename = secure_filename(file.filename)
        upload_path = os.path.join("uploads", filename)
        os.makedirs("uploads", exist_ok=True)
        file.save(upload_path)

        print(f"✅ File saved at: {upload_path}")

        # Perform OCR
        text = extract_text(upload_path)
        print(f"📝 Extracted text:\n{text[:500]}")  # Show only first 500 chars

        return jsonify({"extracted_text": text})

    except Exception as e:
        import traceback
        traceback.print_exc()  # ✅ Prints full error to your terminal
        return jsonify({"error": f"An error occurred while processing the file: {str(e)}"}), 500



@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text")
    blanks, docs = analyze_with_gemini(text)
    return jsonify({
        "blanks": blanks,
        "documents": docs
    })

@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    term = data.get("term")
    lang = data.get("language", "es")
    try:
        result = translate_or_define(term, lang)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== Run ==========
if __name__ == "__main__":
    app.run(debug=True)

