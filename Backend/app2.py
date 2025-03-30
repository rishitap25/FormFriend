from flask import Flask, render_template, request
from PIL import Image, ImageDraw, ImageFont
import os
import pytesseract
import re
import shutil
from xtract_text_file import extract_text_from_file  # <- make sure this file exists
from deep_translator import GoogleTranslator
from PyDictionary import PyDictionary

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("upload.html")

@app.route('/process', methods=['POST'])
def process():
    image_preview = ""
    extracted_name = "[Name Not Found]"
    form_file = request.files['form_file']
    supporting_doc = request.files['supporting_doc']

    os.makedirs("uploads", exist_ok=True)
    form_path = os.path.join("uploads", form_file.filename)
    doc_path = os.path.join("uploads", supporting_doc.filename)

    form_file.save(form_path)
    supporting_doc.save(doc_path)

    form_text = extract_text_from_file(form_path)
    doc_text = extract_text_from_file(doc_path)

    mrz_match = re.search(r"P<([A-Z<]+)<<([A-Z<]+)", doc_text.replace(" ", "").upper())
    if mrz_match:
        surname_raw = mrz_match.group(1).replace("<", " ").title().strip()
        given_raw = mrz_match.group(2).replace("<", " ").title().strip()
        extracted_name = f"{given_raw} {surname_raw}"

    if extracted_name != "[Name Not Found]":
        output_image_path = "outputs/filled_form.png"
        os.makedirs("outputs", exist_ok=True)
        place_text_on_image(form_path, output_image_path, extracted_name, position=(230, 105))
        shutil.copy(output_image_path, "static/filled_form.png")
        image_preview = """
        <br><br>
        Filled form preview:<br>
        <img src="/static/filled_form.png" width="500">
        """

    suggested_fields = []
    for line in form_text.splitlines():
        if "name" in line.lower():
            suggested_fields.append(line)

    return f"""
    ✅ Form uploaded: {form_file.filename}<br>
    ✅ Supporting doc uploaded: {supporting_doc.filename}<br><br>
    🧠 Extracted Name from Document: <b>{extracted_name}</b><br><br>
    📝 Lines in form that might be blanks for name:<br>
    <pre>{'<br>'.join(suggested_fields)}</pre>
    <br><br>
    🧾 Supporting Doc OCR Text:<br>
    <pre>{doc_text}</pre>
    {image_preview}
    <br>
    """

@app.route('/translate', methods=['POST'])
def translate():
    term = request.form.get('term')
    lang = request.form.get('lang')

    if not term or not lang:
        return "❌ Missing term or language", 400

    try:
        if lang == "en":
            dictionary = PyDictionary()
            definition = dictionary.meaning(term)
            if definition:
                result = f"📘 Definition of '{term}':\n"
                for part, defs in definition.items():
                    result += f"{part}:\n" + "\n".join(f" - {d}" for d in defs) + "\n"
            else:
                result = "❌ No definition found."
        else:
            translated = GoogleTranslator(source='en', target=lang).translate(term)
            result = f"🔤 Translation ({lang}): {translated}"
        return result
    except Exception as e:
        return f"⚠️ Translation Error: {e}", 500

def place_text_on_image(image_path, output_path, text, position):
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", size=20)
    except:
        font = ImageFont.load_default()
    draw.text(position, text, fill="black", font=font)
    image.save(output_path)

if __name__ == "__main__":
    app.run(debug=True)
