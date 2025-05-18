from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from jose import jwt
from app.core.config import settings
from app.core.supabase import supabase
from app.core.auth import get_current_user
from app.schemas.auth import Token, UserCreate, UserResponse
from starlette.responses import Response
from passlib.context import CryptContext
import json

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

GOOGLE_REDIRECT_URL = "http://localhost:8000/auth/callback/google"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.get("/")
async def root(request: Request):
    # Check if there's an access token in the URL
    access_token = request.query_params.get("access_token")
    if access_token:
        # Redirect to the set-token endpoint
        return RedirectResponse(url=f"/auth/set-token?access_token={access_token}")
    return RedirectResponse(url="/auth/login")

@router.get("/auth/set-token")
async def set_token(request: Request, access_token: str):
    try:
        # Verify the token with Supabase
        user = supabase.auth.get_user(access_token)
        
        if user:
            # Update user profile to active
            supabase.table("users").update({
                "is_active": True,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("email", user.user.email).execute()
            
            # Set the access token in a cookie
            response = RedirectResponse(url="/dashboard")
            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                secure=settings.ENVIRONMENT == "production",
                samesite="lax",
                max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            )
            return response
    except Exception as e:
        return templates.TemplateResponse(
            "auth/confirm_error.html",
            {
                "request": request,
                "title": "Erro na Confirmação",
                "error": "Link de confirmação inválido ou expirado"
            }
        )

@router.post("/auth/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        })
        user = response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/api/auth/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    try:
        # Create user in Supabase Auth with email confirmation
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                },
                "email_redirect_to": f"{settings.SITE_URL}/auth/set-token"
            }
        })
        
        # Create user profile in users table
        profile_response = supabase.table("users").insert({
            "email": user.email,
            "full_name": user.full_name,
            "is_active": False,  # User needs to confirm email first
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }).execute()
        
        return profile_response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

@router.get("/auth/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse(
        "auth/login.html",
        {"request": request, "title": "Login"}
    )

@router.post("/auth/login", response_class=HTMLResponse)
async def login_post(request: Request, email: str = Form(...), password: str = Form(...)):
    try:
        # Validar email
        if not email or "@" not in email:
            return templates.TemplateResponse(
                "auth/login.html",
                {
                    "request": request,
                    "title": "Login",
                    "error": "Email inválido",
                    "email": email
                }
            )

        # Tentar login no Supabase
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not response.user:
            raise Exception("Usuário não encontrado")

        # Verificar se o usuário está ativo
        user_response = supabase.table("users").select("*").eq("email", email).execute()
        if not user_response.data:
            # Criar perfil do usuário se não existir
            supabase.table("users").insert({
                "email": email,
                "is_active": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }).execute()
        elif not user_response.data[0].get("is_active", False):
            return templates.TemplateResponse(
                "auth/login.html",
                {
                    "request": request,
                    "title": "Login",
                    "error": "Por favor, confirme seu email antes de fazer login",
                    "email": email
                }
            )

        # Criar JWT token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email},
            expires_delta=access_token_expires
        )

        # Configurar cookie de autenticação
        resp = RedirectResponse(url="/dashboard", status_code=302)
        resp.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=settings.ENVIRONMENT == "production",
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

        return resp

    except Exception as e:
        print(f"Login error: {str(e)}")  # For debugging
        error_message = "Usuário ou senha inválidos"
        if "Invalid login credentials" in str(e):
            error_message = "Email ou senha incorretos"
        elif "Email not confirmed" in str(e):
            error_message = "Por favor, confirme seu email antes de fazer login"
        
        return templates.TemplateResponse(
            "auth/login.html",
            {
                "request": request,
                "title": "Login",
                "error": error_message,
                "email": email
            }
        )

@router.get("/auth/login/google")
async def login_google():
    url = f"{settings.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to={GOOGLE_REDIRECT_URL}"
    return RedirectResponse(url)

@router.get("/auth/callback/google")
async def google_callback(request: Request):
    try:
        access_token = request.query_params.get("access_token")
        if not access_token:
            return RedirectResponse(url="/auth/login")

        # Obter dados do usuário do Google
        user = supabase.auth.get_user(access_token)
        email = user.user.email

        # Verificar se o usuário existe na tabela users
        user_response = supabase.table("users").select("*").eq("email", email).execute()
        if not user_response.data:
            # Criar perfil do usuário se não existir
            supabase.table("users").insert({
                "email": email,
                "is_active": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }).execute()

        resp = RedirectResponse(url="/dashboard", status_code=302)
        resp.set_cookie(
            "access_token",
            access_token,
            httponly=True,
            secure=settings.ENVIRONMENT == "production",
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        return resp

    except Exception:
        return RedirectResponse(url="/auth/login")

@router.get("/auth/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse(
        "auth/register.html",
        {"request": request, "title": "Register"}
    )

@router.post("/auth/register", response_class=HTMLResponse)
async def register_post(
    request: Request,
    email: str = Form(...),
    full_name: str = Form(...),
    password: str = Form(...)
):
    try:
        # Validar email
        if not email or "@" not in email:
            return templates.TemplateResponse(
                "auth/register.html",
                {
                    "request": request,
                    "title": "Register",
                    "error": "Email inválido",
                    "email": email,
                    "full_name": full_name
                }
            )

        # Validar senha
        if len(password) < 6:
            return templates.TemplateResponse(
                "auth/register.html",
                {
                    "request": request,
                    "title": "Register",
                    "error": "A senha deve ter pelo menos 6 caracteres",
                    "email": email,
                    "full_name": full_name
                }
            )

        # Criar usuário no Supabase Auth com confirmação de email
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "full_name": full_name
                },
                "email_redirect_to": f"{settings.SITE_URL}/auth/set-token"
            }
        })

        # Criar perfil do usuário
        now = datetime.utcnow()
        try:
            supabase.table("users").insert({
                "email": email,
                "full_name": full_name,
                "is_active": False,  # Usuário precisa confirmar email primeiro
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            }).execute()
        except Exception as e:
            # Se for erro de duplicidade, ignore
            if "duplicate key" not in str(e) and "already exists" not in str(e):
                raise

        return templates.TemplateResponse(
            "auth/register_success.html",
            {
                "request": request,
                "title": "Registro Concluído",
                "email": email,
                "message": "Por favor, verifique seu email para confirmar o cadastro."
            }
        )

    except Exception as e:
        error_message = "Erro ao registrar. Tente novamente."
        if "User already registered" in str(e) or "already registered" in str(e) or "duplicate key" in str(e):
            error_message = "Este email já está cadastrado"
        return templates.TemplateResponse(
            "auth/register.html",
            {
                "request": request,
                "title": "Register",
                "error": error_message,
                "email": email,
                "full_name": full_name
            }
        )

@router.post("/auth/logout")
async def logout():
    try:
        # Fazer logout no Supabase
        supabase.auth.sign_out()
    except Exception:
        pass

    resp = RedirectResponse(url="/auth/login", status_code=302)
    resp.delete_cookie("access_token")
    return resp

@router.get("/reset-password", response_class=HTMLResponse)
async def reset_password_page(request: Request):
    return templates.TemplateResponse("auth/reset_password.html", {"request": request})

@router.post("/reset-password", response_class=HTMLResponse)
async def reset_password_post(
    request: Request,
    access_token: str = Form(...),
    new_password: str = Form(...)
):
    try:
        supabase.auth.update_user(access_token, {"password": new_password})
        return templates.TemplateResponse(
            "auth/reset_password_success.html",
            {"request": request}
        )
    except Exception as e:
        return templates.TemplateResponse(
            "auth/reset_password.html",
            {"request": request, "error": "Erro ao redefinir senha. Tente novamente."}
        )

@router.post("/auth/set-token")
async def set_token(request: Request):
    data = await request.json()
    access_token = data.get("access_token")
    if not access_token:
        return JSONResponse({"detail": "No token provided"}, status_code=400)
    resp = RedirectResponse(url="/dashboard", status_code=302)
    resp.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=60*60*24*7
    )
    return resp

@router.post("/auth/refresh")
async def refresh_token(request: Request):
    try:
        # Get current token
        current_token = request.cookies.get("access_token")
        if not current_token:
            raise HTTPException(status_code=401, detail="No token provided")

        # Verify current token
        payload = verify_token(current_token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Create new token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        new_token = create_access_token(
            data={"sub": payload["sub"]},
            expires_delta=access_token_expires
        )

        # Set new token in cookie
        resp = RedirectResponse(url=request.url.path, status_code=302)
        resp.set_cookie(
            key="access_token",
            value=new_token,
            httponly=True,
            secure=settings.ENVIRONMENT == "production",
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

        return resp
    except Exception as e:
        print(f"Token refresh error: {str(e)}")
        return RedirectResponse(url="/auth/login", status_code=302) 