import cv2
import pytesseract

# Set the Tesseract executable path if it's not in your system PATH
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def capture_document():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Could not open camera.")
        return None
    print("Press 'c' to capture the document, or 'q' to quit.")
    captured_img = None
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break
        cv2.imshow("Camera Feed - Press 'c' to capture", frame)
        key = cv2.waitKey(1)
        if key == ord('c'):
            captured_img = frame.copy()
            break
        elif key == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
    return captured_img

def process_document(img):
    # Convert image to grayscale for better OCR accuracy.
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Apply thresholding to create a binary image.
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    # Extract text from the thresholded image.
    extracted_text = pytesseract.image_to_string(thresh)
    return extracted_text

def check_document_accuracy(text):
    # Define some expected keywords from the document.
    expected_keywords = ["Name", "Address", "Signature"]
    missing_keywords = [keyword for keyword in expected_keywords if keyword not in text]
    if missing_keywords:
        print("The document might be missing these required fields:", missing_keywords)
    else:
        print("Document appears to contain all required fields.")
    print("\nOCR Extracted Text:\n", text)

if __name__ == '__main__':
    document_img = capture_document()
    if document_img is not None:
        ocr_text = process_document(document_img)
        check_document_accuracy(ocr_text)
    else:
        print("No image captured.")
