from beanie import Document
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class User(Document):
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    full_name: Optional[str] = "User"
    profile_picture: Optional[str] = None
    bio: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    job_title: Optional[str] = ""
    company: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    website: Optional[str] = ""
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"

class UserIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: EmailStr
    is_active: bool
    full_name: Optional[str] = "User"
    profile_picture: Optional[str] = None
    bio: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    job_title: Optional[str] = ""
    company: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    website: Optional[str] = ""

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Resume Models
class Resume(Document):
    user_email: EmailStr
    file_name: str
    file_path: str
    analysis_score: Optional[int] = None
    keywords: List[str] = []
    missing_keywords: List[str] = []
    suggestions: List[str] = []
    uploaded_at: datetime = datetime.utcnow()

    class Settings:
        name = "resumes"

# Skill Tracker Models
class Skill(Document):
    user_email: EmailStr
    name: str
    progress: int = 0
    goal: str
    status: str = "Started"
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        name = "skills"

class SkillIn(BaseModel):
    name: str
    goal: str
    progress: int = 0

# Job Match Models
class JobAnalysis(Document):
    user_email: EmailStr
    job_description: str
    match_score: int
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    recommendations: List[str] = []
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "job_analyses"

class JobAnalysisIn(BaseModel):
    job_description: str

# Portfolio Models
class Portfolio(Document):
    user_email: EmailStr
    username: str
    bio: str = ""
    location: str = ""
    website: str = ""
    projects: List[dict] = []
    certificates: List[dict] = []
    updated_at: datetime = datetime.utcnow()

    class Settings:
        name = "portfolios"

class PortfolioIn(BaseModel):
    username: str
    bio: Optional[str] = ""
    location: Optional[str] = ""
    website: Optional[str] = ""
    projects: Optional[List[dict]] = []
    certificates: Optional[List[dict]] = []

# Notification Models
class Notification(Document):
    user_email: EmailStr
    title: str
    message: str
    type: str = "info"  # info, success, warning, error
    is_read: bool = False
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "notifications"

class NotificationIn(BaseModel):
    title: str
    message: str
    type: Optional[str] = "info"
