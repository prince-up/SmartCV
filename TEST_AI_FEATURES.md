# 🧪 Test AI Features - Quick Guide

## ✅ What's Now Working

### 1. **Resume Analysis with Gemini AI** ✅
- Real AI-powered analysis
- Comprehensive feedback
- Job description matching

### 2. **AI Chatbot with Gemini** ✅
- Real-time AI responses
- Career advice
- Resume tips
- Fallback for errors

## 🚀 How to Test

### Step 1: Start Backend
```powershell
cd backend
pip install google-generativeai
python -m uvicorn main:app --reload
```

### Step 2: Start Frontend
```powershell
cd frontend
npm start
```

### Step 3: Test Resume Analysis

1. **Login** to dashboard
2. Go to **Resume Analysis** page
3. **Paste your resume text** (or upload .txt file)
4. **Optional**: Paste job description
5. Click **"✨ Analyze Resume with AI"**

**Expected Result:**
- Score out of 10 (with visual circle)
- Strengths (green boxes)
- Improvements (orange boxes)
- Keywords found/missing
- Skill gaps (if job description provided)
- Action verb suggestions
- Formatting tips
- Achievement suggestions

### Step 4: Test AI Chatbot

1. Click **💬 button** (bottom right)
2. Try these questions:
   - "How do I improve my resume?"
   - "What skills should I add?"
   - "How to write a good summary?"
   - "Tips for job interviews"
   - "How to quantify achievements?"

**Expected Result:**
- AI responds with helpful advice
- 2-3 sentence answers
- Professional and friendly tone

## 📝 Sample Resume Text for Testing

```
John Doe
Full Stack Developer

EXPERIENCE:
- Worked on web applications using React and Node.js
- Helped team with database optimization
- Did code reviews and testing

SKILLS:
Python, JavaScript, React, Node.js, MongoDB

EDUCATION:
Bachelor of Computer Science, 2020
```

## 🎯 Sample Job Description for Testing

```
We are looking for a Full Stack Developer with:
- 3+ years experience with React and TypeScript
- Strong knowledge of Node.js and Express
- Experience with Docker and AWS
- CI/CD pipeline setup
- Team leadership skills
```

## ✅ Expected AI Analysis

**Score**: 6.5-7.5/10

**Strengths**:
- Good technical skills (React, Node.js)
- Clear structure
- Relevant experience

**Improvements**:
- Add TypeScript to skills
- Include measurable achievements
- Add cloud technologies (AWS, Docker)
- Use stronger action verbs
- Add professional summary

**Keywords Found**: React, Node.js, JavaScript, Python, MongoDB

**Missing Keywords**: TypeScript, Docker, AWS, CI/CD, Express

**Skill Gaps**:
- TypeScript (mentioned in job description)
- Docker containerization
- AWS cloud services
- CI/CD pipeline experience

**Action Verbs**:
- Replace "Worked on" with "Developed" or "Built"
- Replace "Helped" with "Facilitated" or "Led"
- Replace "Did" with "Conducted" or "Performed"

**Formatting Tips**:
- Add quantifiable metrics (e.g., "Improved performance by 40%")
- Use bullet points consistently
- Add a professional summary section
- Keep to 1-2 pages

**Achievements**:
- Add team size if you led projects
- Include performance improvements with percentages
- Mention any awards or recognition

## 🔧 Troubleshooting

### Resume Analysis Not Working

**Check:**
1. Backend is running on port 8000
2. You're logged in (token in localStorage)
3. Resume text is not empty
4. Check browser console for errors

**Common Issues:**
- **401 Unauthorized**: Login again
- **500 Error**: Check backend logs
- **No response**: Gemini API might be rate-limited (fallback will activate)

### Chatbot Not Responding

**Check:**
1. Backend `/ai/chat` endpoint is working
2. You're logged in
3. Internet connection is stable

**Fallback:**
- If Gemini fails, chatbot uses predefined responses
- Still provides helpful guidance

### Gemini API Rate Limits

**Free Tier Limits:**
- 60 requests per minute
- 1,500 requests per day

**If you hit limits:**
- Fallback system activates automatically
- Still provides analysis (keyword-based)
- Wait a few minutes and try again

**Upgrade to Pro:**
- Higher rate limits
- Better performance
- More features

## 📊 API Endpoints

### Resume Analysis
```
POST http://localhost:8000/ai/analyze-resume
Headers: Authorization: Bearer <token>
Body: {
  "resume_text": "...",
  "job_description": "..." (optional)
}
```

### Chatbot
```
POST http://localhost:8000/ai/chat
Headers: Authorization: Bearer <token>
Body: {
  "message": "How do I improve my resume?"
}
```

## ✨ Success Indicators

### Resume Analysis Working:
- ✅ Score appears (X/10)
- ✅ Circular progress bar shows
- ✅ Multiple sections display
- ✅ Keywords are listed
- ✅ Suggestions are specific

### Chatbot Working:
- ✅ Responses are contextual
- ✅ Answers are helpful
- ✅ Response time < 3 seconds
- ✅ Typing indicator shows

## 🎯 Next Steps

1. **Test with your real resume**
2. **Try different job descriptions**
3. **Ask chatbot various questions**
4. **Check all suggestion categories**
5. **Verify fallback works** (disconnect internet briefly)

Your AI features are now **fully functional**! 🚀
