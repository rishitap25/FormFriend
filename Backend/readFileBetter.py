import cv2
import pytesseract
from tkinter import Tk
from tkinter.filedialog import askopenfilename

# Set the Tesseract executable path if it's not in your PATH
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def process_document(image_path):
    # Load image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Unable to load image from {image_path}.")
        return None

    # Resize for better OCR accuracy (optional)
    scale_percent = 150
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    image = cv2.resize(image, (width, height), interpolation=cv2.INTER_LINEAR)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Adaptive thresholding
    processed = cv2.adaptiveThreshold(
        blurred,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,  # or ADAPTIVE_THRESH_MEAN_C
        cv2.THRESH_BINARY,
        11,
        2
    )

    # Morphological cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    morphed = cv2.morphologyEx(processed, cv2.MORPH_CLOSE, kernel)

    # Show the processed image before OCR (optional)
    cv2.imshow("Processed Image", morphed)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # OCR with custom config
    custom_config = r'--oem 3 --psm 6'
    extracted_text = pytesseract.image_to_string(morphed, config=custom_config)

    return extracted_text

if __name__ == '__main__':
    # File picker dialog
    Tk().withdraw()
    file_path = askopenfilename(
        title="Select an image file",
        filetypes=[("Image Files", "*.png;*.jpg;*.jpeg;*.bmp;*.tiff")]
    )

    if file_path:
        text = process_document(file_path)
        if text is not None:
            print("Extracted Text:")
            print(text)

            # Save to file
            with open("extracted_text.txt", "w", encoding="utf-8") as f:
                f.write(text)
            print("✅ Text has been saved to extracted_text.txt")
    else:
        print("No file selected.")
