# 🚀 SmartCV Quick Start Guide

## Prerequisites
- Node.js 14+ installed
- Python 3.8+ installed
- MongoDB Atlas account (or local MongoDB)

## 🎬 Run the Complete Application

### Step 1: Start Backend (Terminal 1)
```powershell
cd backend
pip install --upgrade motor pymongo
python -m uvicorn main:app --reload
```
✅ Backend running at: http://localhost:8000

### Step 2: Start Frontend (Terminal 2)
```powershell
cd frontend
npm install
npm start
```
✅ Frontend running at: http://localhost:3000

## 🎯 Experience the Hero Animation

1. **Open Browser**: Navigate to http://localhost:3000
2. **Watch Animation**: 
   - Cinematic background with bokeh effects
   - Laptop unfolds with animated resume
   - Typed headline: "Your next job starts here"
   - CTA button morphs in
3. **Click "Open Dashboard"**: Smooth zoom transition to login
4. **Sign Up**: Create account → Auto-login → Dashboard

## 📊 Dashboard Features

### Overview Page
- Resume score: 85%
- Skills tracked: 12
- Job matches: 8
- Profile views: 156

### Resume Analysis
1. Click "Resume Analysis" in sidebar
2. Upload PDF/DOC/DOCX file
3. View AI analysis with:
   - Score visualization
   - Found vs missing keywords
   - Grammar check
   - Improvement suggestions

### AI Resume Builder
1. Click "AI Resume Builder"
2. Fill 4-step wizard:
   - Personal Info
   - Work Experience
   - Education & Skills
   - Projects
3. Click "Generate Resume"

### Skill Tracker
1. Click "Skill Tracker"
2. Click "+ Add Skill Goal"
3. Enter skill name and learning goal
4. Drag progress slider
5. Track multiple skills

### Job Match Analyzer
1. Click "Job Match"
2. Paste job description
3. Click "Analyze Job Match"
4. View:
   - Match score
   - Matched skills
   - Missing skills
   - Recommendations

### Portfolio Builder
1. Click "Portfolio"
2. Set custom username
3. Add bio, location, website
4. Add projects and certificates
5. Copy public link: smartcv.me/username

## 🎨 Customization

### Change Hero Animation Colors
Edit `frontend/src/components/HeroAnimation.css`:
```css
.hero-background {
  background: linear-gradient(135deg, #yourColor1 0%, #yourColor2 100%);
}
```

### Modify Typed Text
Edit `frontend/src/components/HeroAnimation.js`:
```javascript
const fullText = 'Your custom headline';
```

### Update Landing Page
Edit `frontend/src/App.js` - `LandingPage` component

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_key_here
```

## 📱 Test on Mobile

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update CORS in `backend/main.py`:
```python
allow_origins=["http://localhost:3000", "http://YOUR_IP:3000"]
```
3. Access from phone: `http://YOUR_IP:3000`

## 🐛 Common Issues

### Backend won't start
```powershell
# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

### Frontend errors
```powershell
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MongoDB connection failed
- Check MONGO_URI in `.env`
- Verify MongoDB Atlas IP whitelist
- Test connection string

### Hero animation not smooth
- Close other browser tabs
- Disable browser extensions
- Reduce particle count in `HeroAnimation.js`

## 🎯 Next Steps

1. ✅ Test all dashboard features
2. ✅ Upload a real resume
3. ✅ Add your actual skills
4. ✅ Create your portfolio
5. ✅ Share your smartcv.me link

## 📚 Documentation

- **Hero Animation**: See `HERO_ANIMATION_README.md`
- **API Endpoints**: Check `backend/main.py`
- **Components**: Browse `frontend/src/components/`
- **Pages**: Explore `frontend/src/pages/Dashboard/`

## 🎉 You're Ready!

Your SmartCV application is now running with:
- ✅ Cinematic hero animation
- ✅ Complete dashboard with 6 features
- ✅ Backend API with authentication
- ✅ MongoDB database integration
- ✅ Responsive design

**Enjoy building your smart resume! 🚀**
