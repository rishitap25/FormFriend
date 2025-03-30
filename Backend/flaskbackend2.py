# from PIL import Image, ImageDraw, ImageFont
# from flask import Flask, render_template, request
# import os
# import pytesseract
# import re
# import shutil
# import cv2
# import numpy as np
# import base64
# from io import BytesIO
# from werkzeug.utils import secure_filename
# import os
# import json
# import requests
# from dotenv import load_dotenv
# load_dotenv()

# API_KEY = os.getenv("GEMINI_API_KEY")


# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template("upload2.html")

# @app.route('/process', methods=['POST'])
# def process():
#     image_preview = ""
#     extracted_text = "[No text extracted]"
#     field_analysis = ""

#     method = request.form.get("method")
#     os.makedirs("uploads", exist_ok=True)

#     if method == "upload":
#         form_file = request.files['form_file']
#         form_filename = secure_filename(form_file.filename)
#         form_path = os.path.join("uploads", form_filename)
#         form_file.save(form_path)
#     elif method == "capture":
#         img_data = request.form['captured_image'].split(',')[1]
#         img_bytes = base64.b64decode(img_data)
#         image = Image.open(BytesIO(img_bytes))
#         form_path = os.path.join("uploads", "captured_form.png")
#         image.save(form_path)
#     else:
#         return "❌ Invalid submission method."

#     # Determine file extension
#     ext = os.path.splitext(form_path)[1].lower()

#     # OCR the uploaded form (with preprocessing)
#     if ext in ['.png', '.jpg', '.jpeg']:
#         print("📂 OCR running on image file:", form_path)
#         img = cv2.imread(form_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         blur = cv2.GaussianBlur(gray, (5, 5), 0)
#         thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#                                        cv2.THRESH_BINARY, 11, 2)
#         debug_path = os.path.join("uploads", "debug_cleaned.png")
#         cv2.imwrite(debug_path, thresh)
#         extracted_text = pytesseract.image_to_string(Image.open(debug_path))
#     elif ext == '.pdf':
#         from xtract_text_file import extract_text_from_file
#         extracted_text = extract_text_from_file(form_path)
#     else:
#         extracted_text = "❌ Unsupported file type. Please upload PNG, JPG, JPEG, or PDF."

#     # 🧠 Send OCR text to API to detect fields to fill
#     if "[No text extracted]" not in extracted_text:
#         api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
#         headers = {
#             "Authorization": f"Bearer {API_KEY}",
#             "Content-Type": "application/json"
#         }
#         prompt = f"""
# Given this OCR-extracted form text:

# \"\"\"
# {extracted_text}
# \"\"\"

# Extract the fields the user needs to fill, and label what each field is asking for (e.g. name, email, date of birth).
# Return it as a JSON list of {{field, type}}.
# """

# headers = {
#     "Content-Type": "application/json"
# }

# payload = {
#     "contents": [
#         {
#             "parts": [{"text": prompt}]
#         }
#     ]
# }

# try:
#     response = requests.post(GEMINI_URL, headers=headers, json=payload)
#     if response.status_code == 200:
#         gemini_reply = response.json()['candidates'][0]['content']['parts'][0]['text']
#         field_analysis = f"<br><br>🧩 Detected Fields to Fill:<br><pre>{gemini_reply}</pre>"
#     else:
#         field_analysis = f"<br><br>⚠️ Gemini API Error: {response.status_code} - {response.text}"
# except Exception as e:
#     field_analysis = f"<br><br>⚠️ Gemini API request failed: {e}"

#     return f"""
#     ✅ File processed: {os.path.basename(form_path)}<br><br>
#     🧠 Extracted Text:<br>
#     <pre>{extracted_text}</pre><br>
#     {field_analysis}
#     """

# if __name__ == "__main__":
#     app.run(debug=True)


from PIL import Image, ImageDraw, ImageFont
from flask import Flask, render_template, request
import os
import pytesseract
import re
import shutil
import cv2
import numpy as np
import base64
from io import BytesIO
import requests
import json
from dotenv import load_dotenv
load_dotenv()
from werkzeug.utils import secure_filename
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(model_name="gemini-2.0-flash-lite")
# response = model.generate_content(prompt)

# GEMINI_URL = f"https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateContent?key={API_KEY}"

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("upload2.html")

@app.route('/process', methods=['POST'])
def process():
    image_preview = ""
    extracted_text = "[No text extracted]"
    field_analysis = ""

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
        return "❌ Invalid submission method."

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
        extracted_text = "❌ Unsupported file type. Please upload PNG, JPG, JPEG, or PDF."

    # 🧠 Use Gemini API to detect form fields
    if "[No text extracted]" not in extracted_text:
        prompt = f"""
        Given this OCR-extracted form text:

        \"\"\"
        {extracted_text}
        \"\"\"

        Extract the fields the user needs to fill, and label what each field is asking for (e.g. name, email, date of birth).
        Return it as a JSON list of {{field, type}}.
        """

        try:
            response = model.generate_content(prompt)
            gemini_reply = response.text
            field_analysis = f"<br><br>🧩 Detected Fields to Fill:<br><pre>{gemini_reply}</pre>"
        except Exception as e:
            field_analysis = f"<br><br>⚠️ Gemini SDK Error: {e}"


    return f"""
    ✅ File processed: {os.path.basename(form_path)}<br><br>
    🧠 Extracted Text:<br>
    <pre>{extracted_text}</pre><br>
    {field_analysis}
    """

if __name__ == "__main__":
    app.run(debug=True, port=5001)