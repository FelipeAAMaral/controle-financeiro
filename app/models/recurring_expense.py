from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey
from app.core.database import Base

class RecurringExpense(Base):
    __tablename__ = "recurring_expenses"
    id = Column(Integer, primary_key=True, index=True)
    valor = Column(Float, nullable=False)
    tipo = Column(Enum("dinheiro", "beneficio", name="expense_type"), nullable=False)
    classificacao = Column(String, nullable=False)
    dia_mes = Column(Integer, nullable=False)
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False) 