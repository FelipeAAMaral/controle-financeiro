from pydantic import BaseModel
from typing import List

class FinancialOverview(BaseModel):
    current_balance: float
    balance_variation: float
    monthly_income: float
    income_variation: float
    monthly_expenses: float
    expenses_variation: float
    savings_rate: float
    savings_rate_variation: float

class MonthlyEvolution(BaseModel):
    labels: List[str]
    income: List[float]
    expenses: List[float]

class ExpensesByCategory(BaseModel):
    labels: List[str]
    values: List[float]

class DashboardData(BaseModel):
    overview: FinancialOverview
    monthly_evolution: MonthlyEvolution
    expenses_by_category: ExpensesByCategory 