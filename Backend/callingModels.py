import google.generativeai as genai

# Use your Makersuite key directly for this test
genai.configure(api_key="AIzaSyCQTFtVpA0myGLr3jqnL0YdH0-1BTCgmEc")

# List all available models
models = genai.list_models()

print("✅ Available Gemini Models:")
for model in models:
    print("•", model.name)



# from dotenv import load_dotenv
# import os

# load_dotenv()

# api_key = os.getenv("GEMINI_API_KEY")

# if api_key:
#     print("✅ Key loaded! First few chars:", api_key[:10] + "...")
# else:
#     print("❌ No key found. Check your .env file and its location.")
