import cv2
from PIL import Image, ImageTk
import pytesseract
import os
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
from pdf2image import convert_from_path
from deep_translator import GoogleTranslator
from PyDictionary import PyDictionary
import google.generativeai as genai


#api key:  AIzaSyBrUIeHo1EW-8MyDeOQG8oVr3ZMobzb0qw


# Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Gemini setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-pro')



def detect_blank_fields(image_path, save_path="detected_fields.jpg"):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    kernel_horizontal = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 1))
    horizontal_lines = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel_horizontal)

    kernel_box = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 10))
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
        for i, page in enumerate(images):
            text = pytesseract.image_to_string(page)
            all_text += f"\n📝 Page {i + 1}:\n{text}\n"
    elif file_ext in [".png", ".jpg", ".jpeg"]:
        img = Image.open(path)
        text = pytesseract.image_to_string(img)
        all_text += f"\n📝 Extracted Text:\n{text}\n"
        detect_blank_fields(path)
    else:
        all_text = "❌ Unsupported file type."

    # Save text
    with open("extracted_text.txt", "w", encoding="utf-8") as f:
        f.write(all_text)

    return all_text

def analyze_with_gemini(text):
    try:
        prompt = (
            "You're a document analysis assistant. Based on the text of the form below, "
            "explain what type of form it is, what it's asking for, and what legal or personal documents someone "
            "would need to provide to complete it (e.g., passport, green card, social security number, birth certificate).\n\n"
            f"Form Content:\n{text}"
        )
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"⚠️ Gemini API error: {e}"



def upload_file():
    path = filedialog.askopenfilename(
        title="Select Form Image or PDF",
        filetypes=[("Image/PDF Files", "*.png *.jpg *.jpeg *.pdf")]
    )

    if not path:
        return

    extracted_text = extract_text(path)
    text_output.delete(1.0, tk.END)
    text_output.insert(tk.END, extracted_text)

    # Analyze form contents with Gemini
    gemini_output = analyze_with_gemini(extracted_text)
    text_output.insert(tk.END, "\n🤖 Gemini's Analysis:\n" + gemini_output)

    # Display image with blanks detected
    image_path = "detected_fields.jpg"
    if os.path.exists(image_path):
        img = Image.open(image_path)
        img.thumbnail((400, 400))
        img_tk = ImageTk.PhotoImage(img)
        image_label.config(image=img_tk)
        image_label.image = img_tk


def translate_term():
    term = term_entry.get().strip()
    target_lang = lang_var.get()
    dictionary = PyDictionary()

    if not term:
        messagebox.showwarning("Input Needed", "Please enter a word or phrase.")
        return

    try:
        if target_lang == "en":
            # Get English definition
            definition = dictionary.meaning(term)
            if definition:
                meaning_text = f"📘 Definition of '{term}':\n"
                for part_of_speech, defs in definition.items():
                    meaning_text += f"\n{part_of_speech}:\n"
                    for d in defs:
                        meaning_text += f" - {d}\n"
            else:
                meaning_text = "❌ No definition found for this word."

        else:
            # Translate from English to selected language
            translated = GoogleTranslator(source='en', target=target_lang).translate(term)
            meaning_text = f"🔤 Translation ({target_lang}):\n{translated}"

        term_output.config(state="normal")
        term_output.delete(1.0, tk.END)
        term_output.insert(tk.END, meaning_text)
        term_output.config(state="disabled")

    except Exception as e:
        messagebox.showerror("Error", f"Could not process term: {e}")



# GUI setup
root = tk.Tk()
root.title("📝 FormFriend OCR")
root.geometry("900x700")

# Create scrollable canvas
main_canvas = tk.Canvas(root)
scrollbar = tk.Scrollbar(root, orient="vertical", command=main_canvas.yview)
scrollable_frame = tk.Frame(main_canvas)

scrollable_frame.bind(
    "<Configure>",
    lambda e: main_canvas.configure(
        scrollregion=main_canvas.bbox("all")
    )
)

main_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
main_canvas.configure(yscrollcommand=scrollbar.set)

main_canvas.pack(side="left", fill="both", expand=True)
scrollbar.pack(side="right", fill="y")

# ---------- Now add all widgets inside `scrollable_frame` instead of `root` ----------

title_label = tk.Label(scrollable_frame, text="📄 FormFriend: Upload a Form for OCR + Blank Detection", font=("Arial", 14))
title_label.pack(pady=10)

upload_button = tk.Button(scrollable_frame, text="Upload Form", font=("Arial", 12), command=upload_file)
upload_button.pack(pady=10)

text_output = scrolledtext.ScrolledText(scrollable_frame, wrap=tk.WORD, width=90, height=15, font=("Courier", 10))
text_output.pack(padx=10, pady=10)

image_label = tk.Label(scrollable_frame)
image_label.pack(pady=10)

term_frame = tk.Frame(scrollable_frame)
term_frame.pack(pady=10)

term_label = tk.Label(term_frame, text="❓ Enter a word or phrase you don’t understand:")
term_label.grid(row=0, column=0, padx=5)

term_entry = tk.Entry(term_frame, width=40)
term_entry.grid(row=0, column=1, padx=5)


# Language dropdown
lang_var = tk.StringVar()
lang_var.set("es")  # default: Spanish

languages = {
    "English": "en",
    "Spanish": "es",
    "Hindi": "hi",
    "Chinese (Simplified)": "zh-CN",
    "French": "fr",
    "Arabic": "ar",
    "Korean": "ko",
    "Russian": "ru",
    "German": "de"
}

lang_menu = tk.OptionMenu(term_frame, lang_var, *languages.values())
lang_menu.grid(row=0, column=3, padx=5)


translate_btn = tk.Button(term_frame, text="Define / Translate", command=translate_term)
translate_btn.grid(row=0, column=2, padx=5)

term_output = tk.Text(scrollable_frame, height=4, width=80, wrap="word", font=("Courier", 10))
term_output.pack(pady=5)
term_output.config(state="disabled")

# Run the app
root.mainloop()

