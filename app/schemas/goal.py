from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class GoalBase(BaseModel):
    nome: str
    valor_alvo: float
    valor_atual: float = 0
    prazo: Optional[date] = None
    tipo: str  # investimento, viagem, etc.
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    is_active: Optional[bool] = True

class GoalCreate(GoalBase):
    pass

class GoalUpdate(GoalBase):
    pass

class GoalInDBBase(GoalBase):
    id: int
    usuario_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Goal(GoalInDBBase):
    pass 