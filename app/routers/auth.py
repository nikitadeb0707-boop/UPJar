from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from .. import models
from .. import oauth2,utils
from ..database import get_db
from ..supabase_client import supabase


router = APIRouter(tags=["auth"])


class SignupRequest(BaseModel):
    email: str
    password: str
    phonenumber: str
    upi_id: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int | None = None


# ---------- SIGNUP ----------
@router.post("/signup", response_model=TokenResponse)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    try:
        # 1. Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Signup failed: {str(e)}"
        )

    if not auth_response.user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create user in Supabase Auth"
        )

    # 2. Also create row in your own users table
    existing = db.query(models.User).filter(
        models.User.phonenumber == data.phonenumber
    ).first()

    if existing:
        user = existing
    else:
        user = models.User(
            email=data.email,
            phonenumber=data.phonenumber,
            upi_id=data.upi_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # If email confirmation is enabled, session may be None
    # access_token = (
    #     auth_response.session.access_token
    #     if auth_response.session
    #     else None
    # )
    access_token = oauth2.creataccesstoken(data={"sub": str(user.user_id)})
    if not access_token:
        return {
            "access_token": "",
            "token_type": "bearer",
            "user_id": user.user_id
        }

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id
    }


# ---------- LOGIN ----------
@router.post("/login", response_model=TokenResponse)
def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    try:
        # 1. Authenticate against Supabase auth.users table
        supabase.auth.sign_in_with_password({
            "email": user_credentials.username, 
            "password": user_credentials.password
        })
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Invalid Credentials"
        )

    # 2. Get local profile from public.users table
    user = db.query(models.User).filter(
        models.User.email == user_credentials.username
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User profile not found in database")

    # 3. Mint fast local OAuth2 JWT token
    access_token = oauth2.creataccesstoken(data={"sub": str(user.user_id)})

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": user.user_id
    }