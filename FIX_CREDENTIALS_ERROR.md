# Fix "Could not validate credentials" Error

## Quick Fix (Do This First):

### Option 1: Log Out and Log In Again
1. Click the **Logout** button in the sidebar
2. You'll be redirected to the login page
3. Enter your credentials again
4. Log back in
5. Try the feature again

### Option 2: Clear Browser Data
1. Press **F12** to open Developer Tools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. Find `token` and delete it
5. Refresh the page
6. Log in again

### Option 3: Use Incognito/Private Window
1. Open a new Incognito/Private window
2. Go to `http://localhost:3000`
3. Log in with your credentials
4. Try the feature

## Why This Happens:

1. **Token Expired**: JWT tokens expire after a certain time for security
2. **Backend Restarted**: When backend restarts, old tokens become invalid
3. **Browser Cache**: Old token stored in browser
4. **Session Timeout**: Inactive for too long

## Permanent Solution:

I'll add auto-refresh token logic, but for now, just log out and log in again.

## Step-by-Step Fix:

```
1. Look for "Logout" button in sidebar (bottom)
   ↓
2. Click it
   ↓
3. You'll see login page
   ↓
4. Enter your email and password
   ↓
5. Click "Login"
   ↓
6. You're back in! ✅
```

## If Logout Button Doesn't Work:

1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Press Enter
4. Refresh page
5. Log in again

## Test After Login:

1. Go to any page (Dashboard, Profile, etc.)
2. If you see your data → ✅ Fixed!
3. If still error → Backend might not be running

## Check Backend is Running:

1. Open terminal
2. Go to backend folder: `cd backend`
3. Run: `python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000`
4. Should see: "Uvicorn running on http://0.0.0.0:8000"

Your credentials error will be fixed after logging in again! 🎉
