import cv2
import os
import pytesseract
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
from PIL import Image, ImageTk
from pdf2image import convert_from_path
from deep_translator import GoogleTranslator
from PyDictionary import PyDictionary
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()  # ✅ THIS LINE IS CRUCIAL

# 🧠 Configure Gemini API (from env variable)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

#new code
if not os.getenv("GEMINI_API_KEY"):
    raise ValueError("❌ GEMINI_API_KEY is missing. Make sure it's set in your .env file.")

model = genai.GenerativeModel(model_name="gemini-2.0-flash-lite")



# 🧠 Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


# 🔍 Detect blank fields
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


# 🔠 OCR extraction
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
    with open("extracted_text.txt", "w", encoding="utf-8") as f:
        f.write(all_text)
    return all_text


# 🤖 Gemini document analysis
# def analyze_with_gemini(text):
#     try:
#         prompt = (
#             "You are an assistant that helps people understand official forms. Given the OCR-extracted text below, "
#             "please identify the purpose of the form, what kind of information it’s asking for, and list what documents someone "
#             "will likely need to complete it. Respond with a bullet-point checklist.\n\n"
#             f"Form text:\n{text}"
#         )
#         response = model.generate_content(prompt)
#         return response.text
#     except Exception as e:
#         return f"⚠️ Gemini API Error: {e}"
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
        return f"⚠️ Gemini API Error: {e}", ""



# 📁 File Upload
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

    # Gemini AI Analysis
    blanks_text, docs_text = analyze_with_gemini(extracted_text)

    blanks_box.config(state="normal")
    blanks_box.delete(1.0, tk.END)
    blanks_box.insert(tk.END, blanks_text)
    blanks_box.config(state="disabled")

    gemini_box.config(state="normal")
    gemini_box.delete(1.0, tk.END)
    gemini_box.insert(tk.END, docs_text)
    gemini_box.config(state="disabled")


    # Gemini AI Analysis
    # gemini_output = analyze_with_gemini(extracted_text)
    # gemini_box.config(state="normal")
    # gemini_box.delete(1.0, tk.END)
    # gemini_box.insert(tk.END, gemini_output)
    # gemini_box.config(state="disabled")
    
    # Gemini AI Analysis


    # Show image with blanks
    if os.path.exists("detected_fields.jpg"):
        img = Image.open("detected_fields.jpg")
        img.thumbnail((400, 400))
        img_tk = ImageTk.PhotoImage(img)
        image_label.config(image=img_tk)
        image_label.image = img_tk

# 📸 Take Photo From Camera
def capture_from_camera():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        messagebox.showerror("Camera Error", "❌ Cannot access the camera.")
        return

    messagebox.showinfo("Camera", "Press 'c' in the camera window to capture, or 'q' to quit.")
    captured = False
    while True:
        ret, frame = cap.read()
        if not ret:
            messagebox.showerror("Error", "Failed to grab frame.")
            break

        cv2.imshow("Camera - Press 'c' to capture", frame)
        key = cv2.waitKey(1)

        if key == ord('c'):
            img_path = "captured_image.jpg"
            cv2.imwrite(img_path, frame)
            captured = True
            break
        elif key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    if captured:
        extracted_text = extract_text(img_path)
        text_output.delete(1.0, tk.END)
        text_output.insert(tk.END, extracted_text)

        # Analyze with Gemini
        # gemini_output = analyze_with_gemini(extracted_text)
        # gemini_box.config(state="normal")
        # gemini_box.delete(1.0, tk.END)
        # gemini_box.insert(tk.END, gemini_output)
        # gemini_box.config(state="disabled")

        blanks_text, docs_text = analyze_with_gemini(extracted_text)

        blanks_box.config(state="normal")
        blanks_box.delete(1.0, tk.END)
        blanks_box.insert(tk.END, blanks_text)
        blanks_box.config(state="disabled")

        gemini_box.config(state="normal")
        gemini_box.delete(1.0, tk.END)
        gemini_box.insert(tk.END, docs_text)
        gemini_box.config(state="disabled")



        # Show image with blanks
        if os.path.exists("detected_fields.jpg"):
            img = Image.open("detected_fields.jpg")
            img.thumbnail((400, 400))
            img_tk = ImageTk.PhotoImage(img)
            image_label.config(image=img_tk)
            image_label.image = img_tk


# 🌍 Term Translation or Definition
def translate_term():
    term = term_entry.get().strip()
    target_lang = lang_var.get()
    dictionary = PyDictionary()

    if not term:
        messagebox.showwarning("Input Needed", "Please enter a word or phrase.")
        return

    try:
        if target_lang == "en":
            definition = dictionary.meaning(term)
            if definition:
                result = f"📘 Definition of '{term}':\n"
                for part, defs in definition.items():
                    result += f"{part}:\n" + "\n".join(f" - {d}" for d in defs) + "\n"
            else:
                result = "❌ No definition found."
        else:
            translated = GoogleTranslator(source='en', target=target_lang).translate(term)
            result = f"🔤 Translation ({target_lang}):\n{translated}"

        term_output.config(state="normal")
        term_output.delete(1.0, tk.END)
        term_output.insert(tk.END, result)
        term_output.config(state="disabled")

    except Exception as e:
        messagebox.showerror("Error", f"Translation failed: {e}")

# ========================= CLEANUP BEFORE GUI START =========================
# 🧹 Clear previous image artifacts on startup
for file in ["detected_fields.jpg", "captured_image.jpg"]:
    if os.path.exists(file):
        os.remove(file)


# ========================= GUI SETUP =========================

root = tk.Tk()
root.title("📄 FormFriend OCR Assistant")
root.geometry("1000x800")

# Scrollable area
main_canvas = tk.Canvas(root)
scrollbar = tk.Scrollbar(root, orient="vertical", command=main_canvas.yview)
scrollable_frame = tk.Frame(main_canvas)
scrollable_frame.bind("<Configure>", lambda e: main_canvas.configure(scrollregion=main_canvas.bbox("all")))
main_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
main_canvas.configure(yscrollcommand=scrollbar.set)
main_canvas.pack(side="left", fill="both", expand=True)
scrollbar.pack(side="right", fill="y")

# GUI Components
title_label = tk.Label(scrollable_frame, text="📄 FormFriend: Upload Your Form for Analysis", font=("Arial", 16, "bold"))
title_label.pack(pady=10)

upload_button = tk.Button(scrollable_frame, text="📤 Upload Form", font=("Arial", 12), command=upload_file)
upload_button.pack(pady=10)

camera_button = tk.Button(scrollable_frame, text="📸 Take Photo", font=("Arial", 12), command=capture_from_camera)
camera_button.pack(pady=5)

text_output = scrolledtext.ScrolledText(scrollable_frame, wrap=tk.WORD, width=100, height=15, font=("Courier", 10))
text_output.pack(padx=10, pady=10)

image_label = tk.Label(scrollable_frame)
image_label.pack(pady=10)


# Blank Field Output
blank_label = tk.Label(scrollable_frame, text="🟩 Gemini AI: Likely Blank Fields to Fill", font=("Arial", 12, "bold"))
blank_label.pack(pady=10)

blanks_box = scrolledtext.ScrolledText(scrollable_frame, wrap=tk.WORD, width=100, height=6, font=("Courier", 10))
blanks_box.pack(padx=10, pady=5)
blanks_box.config(state="disabled")



# Translate section
term_frame = tk.Frame(scrollable_frame)
term_frame.pack(pady=10)

term_label = tk.Label(term_frame, text="❓ Need help with a word or phrase?")
term_label.grid(row=0, column=0, padx=5)

term_entry = tk.Entry(term_frame, width=40)
term_entry.grid(row=0, column=1, padx=5)

# Language dropdown
lang_var = tk.StringVar()
lang_var.set("es")  # default language
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
lang_menu.grid(row=0, column=2, padx=5)

translate_btn = tk.Button(term_frame, text="Define / Translate", command=translate_term)
translate_btn.grid(row=0, column=3, padx=5)

term_output = tk.Text(scrollable_frame, height=4, width=100, wrap="word", font=("Courier", 10))
term_output.pack(pady=5)
term_output.config(state="disabled")

# Gemini AI Output
gemini_label = tk.Label(scrollable_frame, text="🤖 Gemini AI Analysis: What Documents Are Required", font=("Arial", 12, "bold"))
gemini_label.pack(pady=10)

gemini_box = scrolledtext.ScrolledText(scrollable_frame, wrap=tk.WORD, width=100, height=10, font=("Courier", 10))
gemini_box.pack(padx=10, pady=10)
gemini_box.config(state="disabled")

# Start the GUI
root.mainloop()
