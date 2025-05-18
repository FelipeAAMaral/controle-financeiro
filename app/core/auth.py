from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.supabase import supabase
from app.schemas.auth import TokenData
from starlette.exceptions import HTTPException as StarletteHTTPException
from datetime import datetime, timedelta
from typing import Optional

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

def redirect_if_not_authenticated(dep):
    async def wrapper(*args, **kwargs):
        try:
            return await dep(*args, **kwargs)
        except (HTTPException, StarletteHTTPException):
            return RedirectResponse(url="/auth/login", status_code=302)
    return wrapper

async def get_current_user(request: Request) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Get access token from cookie
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise credentials_exception

    try:
        # First verify the JWT token
        payload = verify_token(access_token)
        if not payload:
            raise credentials_exception

        # Then verify with Supabase
        user = supabase.auth.get_user(access_token)
        if not user or not user.user:
            raise credentials_exception

        # Get user profile from database
        response = supabase.table("users").select("*").eq("email", user.user.email).execute()
        user_profile = response.data[0] if response.data else None
        
        if not user_profile:
            # Create user profile if it doesn't exist
            user_profile = {
                "email": user.user.email,
                "is_active": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            response = supabase.table("users").insert(user_profile).execute()
            user_profile = response.data[0] if response.data else None

        if not user_profile:
            raise credentials_exception

        return user_profile
    except Exception as e:
        print(f"Auth error: {str(e)}")  # For debugging
        raise credentials_exception 