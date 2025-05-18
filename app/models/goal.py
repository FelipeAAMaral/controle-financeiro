from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    valor_alvo = Column(Float, nullable=False)
    valor_atual = Column(Float, nullable=False, default=0)
    prazo = Column(Date, nullable=True)
    tipo = Column(String, nullable=False)  # investimento, viagem, etc.
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String)
    deadline = Column(DateTime)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="goals") 