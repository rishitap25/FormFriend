from PIL import Image, ImageDraw, ImageFont
from flask import Flask, render_template, request
import os
import pytesseract
from PIL import Image
import re
import shutil
from xtract_text_file import extract_text_from_file


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

    # Save uploaded files
    os.makedirs("uploads", exist_ok=True)
    form_path = os.path.join("uploads", form_file.filename)
    doc_path = os.path.join("uploads", supporting_doc.filename)

    form_file.save(form_path)
    supporting_doc.save(doc_path)

    # ✅ OCR both files (with preprocessing from your ocr_utils.py)
    form_text = extract_text_from_file(form_path)
    doc_text = extract_text_from_file(doc_path)

    # ✅ Try to extract name from MRZ
    mrz_match = re.search(r"P<([A-Z<]+)<<([A-Z<]+)", doc_text.replace(" ", "").upper())

    if mrz_match:
        surname_raw = mrz_match.group(1).replace("<", " ").title().strip()
        given_raw = mrz_match.group(2).replace("<", " ").title().strip()
        extracted_name = f"{given_raw} {surname_raw}"

    # If we got a name, place it on the form
    if extracted_name != "[Name Not Found]":
        output_image_path = "outputs/filled_form.png"
        os.makedirs("outputs", exist_ok=True)

        place_text_on_image(
            form_path,
            output_image_path,
            extracted_name,
            position=(230, 105)
        )

        shutil.copy(output_image_path, "static/filled_form.png")

        image_preview = """
        <br><br>
        Filled form preview:<br>
        <img src="/static/filled_form.png" width="500">
        """

    # ✅ Find fields in the form text that mention 'name'
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


# now we have to put the text on the image

def place_text_on_image(image_path, output_path, text, position):
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)

    try:
        font = ImageFont.truetype("arial.ttf", size=20)  # You can tweak font size
    except:
        font = ImageFont.load_default()

    draw.text(position, text, fill="black", font=font)
    image.save(output_path)




if __name__ == "__main__":
    app.run(debug=True)
