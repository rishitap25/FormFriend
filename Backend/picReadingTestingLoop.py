import cv2
import pytesseract
from tkinter import Tk
from tkinter.filedialog import askopenfilename

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Unable to load image from {image_path}.")
        return None

    # Resize (helpful for small text)
    scale_percent = 150
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    image = cv2.resize(image, (width, height), interpolation=cv2.INTER_LINEAR)

    # Grayscale + blur + threshold
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(
        blurred, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )

    # Morphological Cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    return cleaned

def process_with_best_config(image):
    # Use only the best config: --oem 3 --psm 6
    config = '--oem 3 --psm 6'
    text = pytesseract.image_to_string(image, config=config)

    print(f"--- OCR Result with --oem 3 --psm 6 ---")
    print(text[:300])  # Preview first 300 characters

    return text

def save_to_file(text, filename="extracted_text.txt"):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"✅ Text saved to {filename}")

if __name__ == '__main__':
    Tk().withdraw()
    file_path = askopenfilename(
        title="Select an image file",
        filetypes=[("Image Files", "*.png;*.jpg;*.jpeg;*.bmp;*.tiff")]
    )

    if file_path:
        processed_img = preprocess_image(file_path)
        if processed_img is not None:
            final_text = process_with_best_config(processed_img)
            save_to_file(final_text)
    else:
        print("No file selected.")
