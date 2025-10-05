import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"Testing Gemini API Key: {GEMINI_API_KEY[:10]}...")

genai.configure(api_key=GEMINI_API_KEY)

model_names = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'models/gemini-pro']
working_model = None

for model_name in model_names:
    try:
        print(f"\nTrying {model_name}...")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say hello in one word")
        print(f"✅ {model_name} WORKS!")
        print(f"Response: {response.text}")
        working_model = model_name
        break
    except Exception as e:
        print(f"❌ {model_name} failed: {str(e)}")

if not working_model:
    print("\n❌ NO WORKING MODEL FOUND!")
    print("The Gemini API key is not working. Please provide a new one.")
else:
    print(f"\n✅ SUCCESS! Use model: {working_model}")
