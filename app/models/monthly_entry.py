from sqlalchemy import Column, Integer, String, Float, Enum, Date, ForeignKey
from app.core.database import Base

class MonthlyEntry(Base):
    __tablename__ = "monthly_entries"
    id = Column(Integer, primary_key=True, index=True)
    valor = Column(Float, nullable=False)
    tipo = Column(Enum("entrada", "saida", name="entry_type"), nullable=False)
    classificacao = Column(String, nullable=False)
    data = Column(Date, nullable=False)
    origem = Column(Enum("dinheiro", "beneficio", name="entry_origin"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mes = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False) 