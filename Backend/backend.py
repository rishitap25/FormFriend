from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pytesseract
import re
import cv2
import numpy as np
from PIL import Image
import base64
from io import BytesIO
import google.generativeai as genai
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(model_name="gemini-2.0-flash-lite")

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enables CORS for frontend-backend communication

@app.route('/api/process', methods=['POST'])
def process_form():
    extracted_text = "[No text extracted]"
    detected_fields = ""

    method = request.form.get("method")
    os.makedirs("uploads", exist_ok=True)

    if method == "upload":
        form_file = request.files['form_file']
        form_filename = secure_filename(form_file.filename)
        form_path = os.path.join("uploads", form_filename)
        form_file.save(form_path)

    elif method == "capture":
        img_data = request.form['captured_image'].split(',')[1]
        img_bytes = base64.b64decode(img_data)
        image = Image.open(BytesIO(img_bytes))
        form_path = os.path.join("uploads", "captured_form.png")
        image.save(form_path)
    else:
        return jsonify({"error": "Invalid method"}), 400

    # Preprocess and OCR
    ext = os.path.splitext(form_path)[1].lower()
    if ext in ['.png', '.jpg', '.jpeg']:
        img = cv2.imread(form_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                       cv2.THRESH_BINARY, 11, 2)
        debug_path = os.path.join("uploads", "debug_cleaned.png")
        cv2.imwrite(debug_path, thresh)
        extracted_text = pytesseract.image_to_string(Image.open(debug_path))
    elif ext == '.pdf':
        from xtract_text_file import extract_text_from_file
        extracted_text = extract_text_from_file(form_path)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    # Gemini API prompt
    gemini_reply = ""
    if extracted_text and extracted_text != "[No text extracted]":
        prompt = f"""
        Given this OCR-extracted form text:

        """
        {extracted_text}
        """

        Extract the fields the user needs to fill, and label what each field is asking for (e.g. name, email, date of birth).
        Return it as a JSON list of {{field, type}}.
        """
        try:
            response = model.generate_content(prompt)
            gemini_reply = response.text
        except Exception as e:
            gemini_reply = f"Gemini Error: {str(e)}"

    return jsonify({
        "filename": os.path.basename(form_path),
        "extracted_text": extracted_text,
        "detected_fields": gemini_reply
    })

if __name__ == "__main__":
    app.run(debug=True)