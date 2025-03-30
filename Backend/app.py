from flask import Flask, render_template, request
from dotenv import load_dotenv
from xtract_text_file import extract_text_from_file
import google.generativeai as genai
import os
import cv2
import pytesseract
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
from PIL import Image, ImageTk
from pdf2image import convert_from_path
from deep_translator import GoogleTranslator
from PyDictionary import PyDictionary

load_dotenv()
app = Flask(__name__)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("❌ GEMINI_API_KEY missing in .env")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.0-flash-lite")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['file']
    if not file:
        return "❌ No file uploaded", 400

    # Save uploaded file
    os.makedirs("uploads", exist_ok=True)
    path = os.path.join("uploads", file.filename)
    file.save(path)

    # Extract text from file
    text = extract_text_from_file(path)

    # Call Gemini
    prompt = (
        "You're an AI that reviews uploaded forms. Based on the following OCR text, "
        "list the type of form and what supporting documents are needed to complete it "
        "(e.g., passport, ID, green card, SSN, birth certificate).\n\n"
        f"Form Text:\n{text}"
    )

    try:
        response = model.generate_content(prompt)
        gemini_response = response.text
    except Exception as e:
        gemini_response = f"⚠️ Gemini API Error: {e}"

    return render_template("index.html", ocr=text, gemini=gemini_response)

if __name__ == "__main__":
    app.run(debug=True)
