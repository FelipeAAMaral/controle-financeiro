from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse, JSONResponse, HTMLResponse
from app.core.config import settings
from app.core.auth import get_current_user, redirect_if_not_authenticated
from app.routers import dashboard, auth, transactions
from sqlalchemy import text
import os

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Templates
templates = Jinja2Templates(directory="app/templates")

# Include routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(transactions.router)

# Root endpoint - redirects to dashboard if authenticated, login if not
@app.get("/")
async def root(request: Request, current_user: dict = Depends(redirect_if_not_authenticated(get_current_user))):
    if isinstance(current_user, RedirectResponse):
        return current_user
    return RedirectResponse(url="/dashboard")

@app.get("/health", response_class=HTMLResponse)
def health(request: Request):
    from app.core.database import SessionLocal
    from app.core.supabase import supabase
    import redis
    import os
    status = {}

    # Testa banco de dados
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        status["database"] = "ok"
    except Exception as e:
        status["database"] = f"error: {str(e)}"

    # Testa Supabase
    try:
        resp = supabase.table("users").select("id").limit(1).execute()
        if resp.data is not None:
            status["supabase"] = "ok"
        else:
            status["supabase"] = "error: no data"
    except Exception as e:
        status["supabase"] = f"error: {str(e)}"

    # Testa cache (Redis)
    try:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        r = redis.from_url(redis_url)
        r.ping()
        status["cache"] = "ok"
    except Exception as e:
        status["cache"] = f"error: {str(e)}"

    # Decide resposta baseada no Accept
    accept = request.headers.get("accept", "")
    if "application/json" in accept:
        return JSONResponse(content=status)
    return templates.TemplateResponse(
        "health.html",
        {"request": request, "status": status}
    ) 