from pydantic import BaseModel
from typing import Optional

class RecurringExpenseBase(BaseModel):
    valor: float
    tipo: str  # 'dinheiro' ou 'beneficio'
    classificacao: str
    dia_mes: int

class RecurringExpenseCreate(RecurringExpenseBase):
    pass

class RecurringExpenseUpdate(RecurringExpenseBase):
    pass

class RecurringExpenseInDBBase(RecurringExpenseBase):
    id: int
    usuario_id: int

    class Config:
        orm_mode = True

class RecurringExpense(RecurringExpenseInDBBase):
    pass 