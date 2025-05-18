from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class TransactionBase(BaseModel):
    description: str = Field(..., min_length=3, max_length=100)
    amount: float = Field(..., gt=0)
    type: str = Field(..., pattern="^(income|expense)$")
    category: str = Field(..., min_length=2, max_length=50)
    date: datetime = Field(default_factory=datetime.utcnow)

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 