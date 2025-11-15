# SmartCV Backend

This is the FastAPI backend for the SmartCV project, providing user authentication, database storage, and AI integration.

## Features

- User registration and login with JWT authentication
- MongoDB database integration
- AI response generation using OpenAI API
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with your environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Run the server:
   ```
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`.

## API Endpoints

- `POST /register`: Register a new user
- `POST /token`: Login and get access token
- `GET /users/me`: Get current user info (requires authentication)
- `POST /ai/generate`: Generate AI response (requires authentication)

## Hosting

Deploy to Render or Railway:

1. Push this backend to a GitHub repo.
2. Connect to Render/Railway and deploy from GitHub.
3. Set environment variables in the hosting platform.
4. Update frontend to use the deployed backend URL.
