import cv2
from PIL import Image
import pytesseract
import os
from pdf2image import convert_from_path

# 👉 Explicitly set the Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def extract_text_from_file(path):
    file_ext = os.path.splitext(path)[1].lower()

    if not os.path.exists(path):
        print("❌ File not found at path:", path)
        return

    try:
        if file_ext == ".pdf":
            print("📄 Processing PDF...")
            images = convert_from_path(path)
            for i, page in enumerate(images):
                print(f"\n📝 Page {i + 1} Text:\n")
                text = pytesseract.image_to_string(page)
                print(text)

        elif file_ext in [".png", ".jpg", ".jpeg"]:
            print("🖼️ Processing image...")
            img = Image.open(path)
            text = pytesseract.image_to_string(img)
            print("\n📝 Extracted Text:\n")
            print(text)

        else:
            print("❌ Unsupported file type:", file_ext)

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
