from pydantic import BaseModel
from typing import Optional

class IndicatorBase(BaseModel):
    nome: str
    tipo: str  # 'entrada' ou 'saida'
    classificacao: str

class IndicatorCreate(IndicatorBase):
    pass

class IndicatorUpdate(IndicatorBase):
    pass

class IndicatorInDBBase(IndicatorBase):
    id: int
    usuario_id: int

    class Config:
        orm_mode = True

class Indicator(IndicatorInDBBase):
    pass 