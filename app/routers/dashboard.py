from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.models.goal import Goal
from app.schemas.dashboard import (
    FinancialOverview,
    MonthlyEvolution,
    ExpensesByCategory,
    DashboardData
)

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def dashboard(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get current date and first day of current month
    today = datetime.now()
    first_day_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Get first day of previous month
    first_day_of_prev_month = (first_day_of_month - timedelta(days=1)).replace(day=1)
    
    # Get transactions for current month
    current_month_transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date >= first_day_of_month,
        Transaction.date <= today
    ).all()
    
    # Get transactions for previous month
    prev_month_transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date >= first_day_of_prev_month,
        Transaction.date < first_day_of_month
    ).all()
    
    # Calculate financial overview
    current_income = sum(t.amount for t in current_month_transactions if t.type == "income")
    current_expenses = sum(t.amount for t in current_month_transactions if t.type == "expense")
    prev_income = sum(t.amount for t in prev_month_transactions if t.type == "income")
    prev_expenses = sum(t.amount for t in prev_month_transactions if t.type == "expense")
    
    # Calculate variations
    income_variation = ((current_income - prev_income) / prev_income * 100) if prev_income else 0
    expenses_variation = ((current_expenses - prev_expenses) / prev_expenses * 100) if prev_expenses else 0
    
    # Calculate savings rate
    current_savings_rate = ((current_income - current_expenses) / current_income * 100) if current_income else 0
    prev_savings_rate = ((prev_income - prev_expenses) / prev_income * 100) if prev_income else 0
    savings_rate_variation = current_savings_rate - prev_savings_rate
    
    # Get current balance
    current_balance = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date <= today
    ).with_entities(
        func.sum(case((Transaction.type == "income", Transaction.amount), else_=-Transaction.amount))
    ).scalar() or 0
    
    # Get previous month's balance
    prev_balance = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date < first_day_of_month
    ).with_entities(
        func.sum(case((Transaction.type == "income", Transaction.amount), else_=-Transaction.amount))
    ).scalar() or 0
    
    # Calculate balance variation
    balance_variation = ((current_balance - prev_balance) / abs(prev_balance) * 100) if prev_balance else 0
    
    # Create financial overview
    overview = FinancialOverview(
        current_balance=current_balance,
        balance_variation=balance_variation,
        monthly_income=current_income,
        income_variation=income_variation,
        monthly_expenses=current_expenses,
        expenses_variation=expenses_variation,
        savings_rate=current_savings_rate,
        savings_rate_variation=savings_rate_variation
    )
    
    # Get monthly evolution data
    monthly_evolution = get_monthly_evolution(db, current_user.id)
    
    # Get expenses by category
    expenses_by_category = get_expenses_by_category(db, current_user.id, first_day_of_month, today)
    
    # Get recent transactions
    recent_transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.date.desc()).limit(5).all()
    
    # Get active goals
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id,
        Goal.is_active == True
    ).all()
    
    # Calculate goal progress
    for goal in goals:
        goal.progress = (goal.current_amount / goal.target_amount * 100) if goal.target_amount else 0
    
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "user": current_user,
            "overview": overview,
            "monthly_evolution": monthly_evolution,
            "expenses_by_category": expenses_by_category,
            "recent_transactions": recent_transactions,
            "goals": goals
        }
    )

def get_monthly_evolution(db: Session, user_id: int) -> MonthlyEvolution:
    """Get monthly evolution data for the last 6 months."""
    today = datetime.now()
    first_day_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Get data for the last 6 months
    months = []
    income_data = []
    expenses_data = []
    
    for i in range(5, -1, -1):
        month_start = (first_day_of_month - timedelta(days=i*30)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        # Get transactions for this month
        transactions = db.query(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.date >= month_start,
            Transaction.date <= month_end
        ).all()
        
        # Calculate totals
        income = sum(t.amount for t in transactions if t.type == "income")
        expenses = sum(t.amount for t in transactions if t.type == "expense")
        
        months.append(month_start.strftime("%b/%Y"))
        income_data.append(income)
        expenses_data.append(expenses)
    
    return MonthlyEvolution(
        labels=months,
        income=income_data,
        expenses=expenses_data
    )

def get_expenses_by_category(
    db: Session,
    user_id: int,
    start_date: datetime,
    end_date: datetime
) -> ExpensesByCategory:
    """Get expenses grouped by category for the given period."""
    # Get all transactions in the period
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.type == "expense",
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).all()
    
    # Group by category
    category_totals = {}
    for transaction in transactions:
        if transaction.category not in category_totals:
            category_totals[transaction.category] = 0
        category_totals[transaction.category] += transaction.amount
    
    # Sort categories by total amount
    sorted_categories = sorted(
        category_totals.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    return ExpensesByCategory(
        labels=[cat for cat, _ in sorted_categories],
        values=[amount for _, amount in sorted_categories]
    ) 