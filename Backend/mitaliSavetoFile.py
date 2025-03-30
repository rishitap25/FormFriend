import cv2
from PIL import Image
import pytesseract
import os
from pdf2image import convert_from_path

# 👉 Explicitly set the Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def save_text_to_file(text, filename="extracted_text.txt"):
    with open(filename, "a", encoding="utf-8") as f:
        f.write(text + "\n\n")
    print(f"✅ Extracted text saved to {filename}")

def detect_blank_fields(image_path, save_path="detected_fields.jpg"):
    if not os.path.exists(image_path):
        print("❌ File not found.")
        return

    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    # Detect horizontal lines and boxes
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
    print(f"✅ Blank fields highlighted and saved as {save_path}")

def extract_text_from_file(path):
    file_ext = os.path.splitext(path)[1].lower()

    if not os.path.exists(path):
        print("❌ File not found at path:", path)
        return

    try:
        all_text = ""
        if file_ext == ".pdf":
            print("📄 Processing PDF...")
            images = convert_from_path(path)
            for i, page in enumerate(images):
                text = pytesseract.image_to_string(page)
                all_text += f"\n📝 Page {i + 1} Text:\n{text}\n"

        elif file_ext in [".png", ".jpg", ".jpeg"]:
            print("🖼️ Processing image...")
            img = Image.open(path)
            text = pytesseract.image_to_string(img)
            all_text += f"\n📝 Extracted Text:\n{text}\n"

            # Also detect blank fields and save image
            detect_blank_fields(path)

        else:
            print("❌ Unsupported file type:", file_ext)
            return

        save_text_to_file(all_text)

    except Exception as e:
        print("⚠️ Error processing file:", e)

def capture_image_from_camera(filename="captured_form.jpg"):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Cannot open webcam.")
        return None

    print("📷 Press 'c' to capture or 'q' to quit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            print("⚠️ Failed to grab frame.")
            break

        cv2.imshow("Camera - Press 'c' to capture", frame)
        key = cv2.waitKey(1)
        if key == ord('c'):
            cv2.imwrite(filename, frame)
            print(f"✅ Image saved as {filename}")
            break
        elif key == ord('q'):
            print("❌ Capture cancelled.")
            filename = None
            break

    cap.release()
    cv2.destroyAllWindows()
    return filename

def main():
    print("👋 Welcome to FormFriend OCR!")
    while True:
        method = input("📂 Type 'u' to upload a file or 'c' to capture from camera: ").lower().strip()

        if method == 'u':
            path = input("📁 Enter the full path to your PNG, JPG, or PDF file: ").strip()
            extract_text_from_file(path)

        elif method == 'c':
            captured = capture_image_from_camera()
            if captured:
                extract_text_from_file(captured)

        else:
            print("❌ Invalid input. Please type 'u' or 'c'.")

        again = input("\n🔁 Do you want to process another file or image? (y/n): ").lower().strip()
        if again != 'y':
            print("👋 Done! Thanks for using FormFriend.")
            break

if __name__ == "__main__":
    main()
