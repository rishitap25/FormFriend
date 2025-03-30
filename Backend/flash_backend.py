from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import cv2
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
from deep_translator import GoogleTranslator
from PyDictionary import PyDictionary
from dotenv import load_dotenv
import google.generativeai as genai

#C:\poppler\poppler-24.08.0\Library\bin

# Load env and configure Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="gemini-2.0-flash-lite")

# Add this line at the top or where you load env vars
POPPLER_PATH = r"C:\poppler\poppler-24.08.0\Library\bin"  # ← Replace with your actual Poppler bin path

# Setup Flask
app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Tesseract path (if needed on Windows)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# --- BLANK FIELD DETECTION (uses OpenCV)
def detect_blank_fields(image_path, save_path="uploads/detected_fields.jpg"):
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

# --- OCR
def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    all_text = ""
    if ext == ".pdf":
        images = convert_from_path(file_path, poppler_path=POPPLER_PATH)
        for i, img in enumerate(images):
            all_text += pytesseract.image_to_string(img) + "\n"
    elif ext in [".jpg", ".jpeg", ".png"]:
        img = Image.open(file_path)
        all_text = pytesseract.image_to_string(img)
        detect_blank_fields(file_path)
    else:
        all_text = "❌ Unsupported file type."
    return all_text.strip()

# --- Gemini Analysis
def analyze_with_gemini(text):
    try:
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
            blanks_text = parts[0].replace("**Likely Blank Fields:**", "").strip()
            docs_text = parts[1].strip()
            return blanks_text, docs_text
        else:
            return "Could not parse blank fields.", response.text
    except Exception as e:
        return f"Gemini API Error: {e}", ""

# --- Translation/Definition
def translate_or_define(term, target_lang):
    dictionary = PyDictionary()
    try:
        if target_lang == "en":
            definition = dictionary.meaning(term)
            if definition:
                result = ""
                for part, defs in definition.items():
                    result += f"{part}:\n" + "\n".join(f" - {d}" for d in defs)
                return result
            else:
                return "❌ No definition found."
        else:
            return GoogleTranslator(source="en", target=target_lang).translate(term)
    except Exception as e:
        return f"Translation error: {e}"

# ====================== ROUTES ======================

@app.route("/")
def index():
    return "✅ FormFriend Flask backend is running!"

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    extracted_text = extract_text(file_path)
    blanks_text, docs_text = analyze_with_gemini(extracted_text)

    return jsonify({
        "extracted_text": extracted_text,
        "blank_fields": blanks_text,
        "required_documents": docs_text
    })

@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    term = data.get("term", "")
    lang = data.get("lang", "en")
    if not term:
        return jsonify({"error": "Missing term"}), 400
    result = translate_or_define(term, lang)
    return jsonify({"result": result})

# =====================================================

if __name__ == "__main__":
    app.run(debug=True, port=5000)
