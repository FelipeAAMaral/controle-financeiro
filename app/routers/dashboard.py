from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.core.database import get_db
from app.core.auth import get_current_user, redirect_if_not_authenticated
from app.models.user import User
from app.models.transaction import Transaction
from app.models.goal import Goal
from app.schemas.dashboard import (
    FinancialOverview,
    MonthlyEvolution,
    ExpensesByCategory,
    DashboardData
)
from app.core.supabase import supabase

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/dashboard")
async def dashboard(
    request: Request,
    current_user: dict = Depends(redirect_if_not_authenticated(get_current_user))
):
    if isinstance(current_user, HTMLResponse) or hasattr(current_user, "status_code"):
        return current_user

    try:
        # Get user's transactions
        transactions_response = supabase.table("transactions").select("*").eq("user_id", current_user["id"]).execute()
        transactions = transactions_response.data if transactions_response.data else []

        # Get user's goals
        goals_response = supabase.table("goals").select("*").eq("user_id", current_user["id"]).execute()
        goals = goals_response.data if goals_response.data else []

        # Calculate financial overview
        current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        prev_month = (current_month - timedelta(days=1)).replace(day=1)

        current_month_transactions = [t for t in transactions if datetime.fromisoformat(t["date"]) >= current_month]
        prev_month_transactions = [t for t in transactions if prev_month <= datetime.fromisoformat(t["date"]) < current_month]

        current_income = sum(t["amount"] for t in current_month_transactions if t["type"] == "income")
        current_expenses = sum(t["amount"] for t in current_month_transactions if t["type"] == "expense")
        prev_income = sum(t["amount"] for t in prev_month_transactions if t["type"] == "income")
        prev_expenses = sum(t["amount"] for t in prev_month_transactions if t["type"] == "expense")

        # Calculate variations
        income_variation = ((current_income - prev_income) / prev_income * 100) if prev_income else 0
        expenses_variation = ((current_expenses - prev_expenses) / prev_expenses * 100) if prev_expenses else 0

        # Calculate savings rate
        current_savings_rate = ((current_income - current_expenses) / current_income * 100) if current_income else 0
        prev_savings_rate = ((prev_income - prev_expenses) / prev_income * 100) if prev_income else 0
        savings_rate_variation = current_savings_rate - prev_savings_rate

        # Calculate current balance
        current_balance = sum(t["amount"] if t["type"] == "income" else -t["amount"] for t in transactions)
        prev_balance = sum(t["amount"] if t["type"] == "income" else -t["amount"] for t in transactions if datetime.fromisoformat(t["date"]) < current_month)
        balance_variation = ((current_balance - prev_balance) / abs(prev_balance) * 100) if prev_balance else 0

        # Create overview object
        overview = {
            "current_balance": current_balance,
            "balance_variation": balance_variation,
            "monthly_income": current_income,
            "income_variation": income_variation,
            "monthly_expenses": current_expenses,
            "expenses_variation": expenses_variation,
            "savings_rate": current_savings_rate,
            "savings_rate_variation": savings_rate_variation
        }

        # Get monthly evolution data
        monthly_evolution = get_monthly_evolution(transactions)

        # Get expenses by category
        expenses_by_category = get_expenses_by_category(current_month_transactions)

        # Get recent transactions
        recent_transactions = sorted(transactions, key=lambda x: datetime.fromisoformat(x["date"]), reverse=True)[:5]

        # Calculate goal progress
        for goal in goals:
            goal["progress"] = (goal["current_amount"] / goal["target_amount"] * 100) if goal["target_amount"] else 0

        response = templates.TemplateResponse(
            "dashboard.html",
            {
                "request": request,
                "user": current_user,
                "overview": overview,
                "monthly_evolution": monthly_evolution,
                "expenses_by_category": expenses_by_category,
                "recent_transactions": recent_transactions,
                "goals": goals,
                "now": datetime.now()
            }
        )

        # Add headers to prevent caching
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"

        return response

    except Exception as e:
        print(f"Dashboard error: {str(e)}")  # For debugging
        return RedirectResponse(url="/auth/login", status_code=302)

def get_monthly_evolution(transactions: List[Dict]) -> Dict:
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
        month_transactions = [
            t for t in transactions 
            if month_start <= datetime.fromisoformat(t["date"]) <= month_end
        ]
        
        # Calculate totals
        income = sum(t["amount"] for t in month_transactions if t["type"] == "income")
        expenses = sum(t["amount"] for t in month_transactions if t["type"] == "expense")
        
        months.append(month_start.strftime("%b/%Y"))
        income_data.append(income)
        expenses_data.append(expenses)
    
    return {
        "labels": months,
        "income": income_data,
        "expenses": expenses_data
    }

def get_expenses_by_category(transactions: List[Dict]) -> Dict:
    """Get expenses grouped by category for the given period."""
    # Group by category
    category_totals = {}
    for transaction in transactions:
        if transaction["type"] == "expense":
            category = transaction.get("category", "Outros")
            if category not in category_totals:
                category_totals[category] = 0
            category_totals[category] += transaction["amount"]
    
    # Sort categories by total amount
    sorted_categories = sorted(
        category_totals.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    return {
        "labels": [cat for cat, _ in sorted_categories],
        "values": [amount for _, amount in sorted_categories]
    } 