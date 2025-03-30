import cv2
import pytesseract
from tkinter import Tk
from tkinter.filedialog import askopenfilename

# Set the Tesseract executable path if it's not in your system PATH.
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def process_document(image_path):
    # Load the image from the given file path.
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Unable to load image from {image_path}.")
        return None

    # Convert image to grayscale.
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian Blur to reduce noise.
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Use adaptive thresholding for better binarization.
    adaptive_thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Optionally, use morphological operations to clean up the image.
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    processed = cv2.morphologyEx(adaptive_thresh, cv2.MORPH_OPEN, kernel)
    
    # Use custom configuration for Tesseract.
    custom_config = r'--oem 3 --psm 6'
    extracted_text = pytesseract.image_to_string(processed, config=custom_config)
    return extracted_text

if __name__ == '__main__':
    # Hide the main Tkinter window.
    Tk().withdraw()
    
    # Open a file dialog for the user to select an image file.
    file_path = askopenfilename(
        title="Select an image file",
        filetypes=[("Image Files", "*.png;*.jpg;*.jpeg;*.bmp;*.tiff")]
    )
    
    if file_path:
        text = process_document(file_path)
        if text is not None:
            print("Extracted Text:")
            print(text)

        # 💾 Save to file
        with open("extracted_text.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("✅ Text has been saved to extracted_text.txt")
        
    else:
        print("No file selected.")
