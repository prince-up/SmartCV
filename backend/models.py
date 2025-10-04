from beanie import Document
from pydantic import BaseModel, EmailStr
from typing import Optional

class User(Document):
    email: EmailStr
    hashed_password: str
    is_active: bool = True

    class Settings:
        name = "users"

class UserIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: EmailStr
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
