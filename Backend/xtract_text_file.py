import os
import cv2
import numpy as np
from PIL import Image
from pdf2image import convert_from_path
import pytesseract


def extract_text_from_file(path):
   print(f"📂 OCR running on file: {path}")  # ✅ Confirm it's running


   file_ext = os.path.splitext(path)[1].lower()
   text = ""


   if not os.path.exists(path):
       print("❌ File not found at path:", path)
       return ""


   try:
       if file_ext == ".pdf":
           print("📄 Processing PDF...")
           images = convert_from_path(path)
           for i, page in enumerate(images):
               page_text = pytesseract.image_to_string(page)
               print(f"\n📝 Page {i + 1} Text:\n{page_text}")
               text += page_text + "\n"


       elif file_ext in [".png", ".jpg", ".jpeg"]:
           print("🖼️ Preprocessing image...")
           img = cv2.imread(path)
           gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
           gray = cv2.bilateralFilter(gray, 11, 17, 17)
           thresh = cv2.adaptiveThreshold(
               gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
               cv2.THRESH_BINARY, 11, 2
           )


           # ✅ Save cleaned image for debugging
           cleaned_path = os.path.join("uploads", "debug_cleaned.png")
           cv2.imwrite(cleaned_path, thresh)
           print(f"✅ Cleaned image saved as {cleaned_path}")


           # OCR on cleaned image
           text = pytesseract.image_to_string(cleaned_path, config="--psm 6")


       else:
           print("⚠️ Unsupported file type:", file_ext)


   except Exception as e:
       print("❌ Error processing file:", e)


   return text


def main():
   test_path = "/C:/Users/ssrak/Downloads/AkshayaHeadShot3.png"
   text = extract_text_from_file(test_path)
   print("\n📝 Extracted Text:\n", text)


if __name__ == "__main__":
   main()

