from pydantic import BaseModel
from typing import Optional
from datetime import date

class MonthlyEntryBase(BaseModel):
    valor: float
    tipo: str  # 'entrada' ou 'saida'
    classificacao: str
    data: date
    origem: str  # 'dinheiro' ou 'beneficio'
    mes: int
    ano: int

class MonthlyEntryCreate(MonthlyEntryBase):
    pass

class MonthlyEntryUpdate(MonthlyEntryBase):
    pass

class MonthlyEntryInDBBase(MonthlyEntryBase):
    id: int
    usuario_id: int

    class Config:
        orm_mode = True

class MonthlyEntry(MonthlyEntryInDBBase):
    pass 