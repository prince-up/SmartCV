# 🔑 How to Get FREE Gemini AI API Key

## Step 1: Install Gemini Library
Run this command in your terminal:
```bash
cd backend
pip install google-generativeai
```

Or double-click: `setup_gemini.bat`

## Step 2: Get FREE API Key

1. **Visit**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. Click **"Create API Key"**
4. Copy the API key

## Step 3: Update .env File

Open `backend\.env` and replace the API key:

```env
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

## Step 4: Restart Backend

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

## ✅ Test It!

Upload a resume and click "Analyze Resume with AI"

You should see in the terminal:
```
==================================================
Analyzing resume for: Software Developer
Resume length: 1234 characters
Gemini AI Available: True
==================================================

🤖 Using Gemini AI for real-time analysis...
✅ Gemini AI analysis completed successfully!
```

## 🎯 What You'll Get:

- **Real AI analysis** of actual resume content
- **Specific errors** found in YOUR resume
- **Specific strengths** from YOUR resume
- **Specific improvements** for YOUR resume
- **Actual keywords** found in YOUR resume
- **Role-specific feedback** based on target job

## 📝 Example Real Analysis:

Instead of generic:
```
❌ "Use stronger action verbs"
```

You'll get specific:
```
❌ "Line 5: Change 'Worked on React projects' to 'Developed 5 React applications serving 10K+ users'"
❌ "Missing quantifiable metrics in Experience section"
❌ "Typo on line 12: 'experiance' should be 'experience'"
```

## 🆓 Free Tier Limits:

- **60 requests per minute**
- **1500 requests per day**
- More than enough for personal use!

## 🔧 Troubleshooting:

**If you see "Gemini AI not available":**
```bash
pip install google-generativeai
```

**If you see "API key error":**
- Get new key from: https://makersuite.google.com/app/apikey
- Update `backend\.env`
- Restart backend server

**If analysis is slow:**
- Using `gemini-1.5-flash` (fastest model)
- Should take 2-5 seconds
- Check your internet connection
