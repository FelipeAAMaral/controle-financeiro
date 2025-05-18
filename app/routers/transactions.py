from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, redirect_if_not_authenticated
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/transactions", response_class=HTMLResponse)
async def list_transactions(
    request: Request,
    current_user: dict = Depends(redirect_if_not_authenticated(get_current_user)),
    db: Session = Depends(get_db)
):
    if isinstance(current_user, HTMLResponse) or hasattr(current_user, "status_code"):
        return current_user

    # Busca as transações mais recentes
    recent_transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.date.desc()).limit(10).all()

    return templates.TemplateResponse(
        "transactions/form.html",
        {
            "request": request,
            "user": current_user,
            "recent_transactions": recent_transactions,
            "now": datetime.now()
        }
    )

@router.post("/transactions", response_class=HTMLResponse)
async def create_transaction(
    request: Request,
    type: str = Form(...),
    description: str = Form(...),
    amount: float = Form(...),
    category: str = Form(...),
    date: str = Form(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Cria a transação
        transaction = Transaction(
            user_id=current_user.id,
            type=type,
            description=description,
            amount=amount,
            category=category,
            date=datetime.strptime(date, "%Y-%m-%d")
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)

        # Retorna apenas a nova linha da tabela
        return templates.TemplateResponse(
            "transactions/_transaction_row.html",
            {
                "request": request,
                "transaction": transaction
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 