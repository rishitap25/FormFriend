import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load the .env file
load_dotenv()

# Get API key from environment
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("❌ API key not found. Make sure it's in your .env file as GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel("gemini-pro")  # Or "gemini-1.5-pro" if you have access

# ✨ Text generation function
def generate_text(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error during text generation: {e}")
        return None

# 💬 Chat conversation function
def generate_chat_response(messages: list) -> str:
    try:
        chat = model.start_chat(history=messages)
        response = chat.send_message(messages[-1]["parts"])
        return response.text
    except Exception as e:
        print(f"❌ Error during chat: {e}")
        return None

# ===========================
# ✅ Run Some Tests
# ===========================
if __name__ == '__main__':
    # Test 1: Prompt
    prompt = "Write a short poem about a cat in the moonlight."
    print("📝 Generating text...\n")
    output = generate_text(prompt)
    if output:
        print("✅ Generated Text:\n", output)

    # Test 2: Chat style
    chat_history = [
        {"role": "user", "parts": "Hello, how are you?"},
        {"role": "model", "parts": "I'm doing great! How can I assist you today?"},
        {"role": "user", "parts": "What is the capital of France?"}
    ]
    print("\n💬 Chatting with Gemini...\n")
    chat_response = generate_chat_response(chat_history)
    if chat_response:
        print("✅ Chat Response:\n", chat_response)
