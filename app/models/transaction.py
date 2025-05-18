from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(Enum("income", "expense", name="transaction_type"), nullable=False)
    category = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    user = relationship("User", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction {self.id}: {self.description} - R$ {self.amount}>" 