from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Indicator(Base):
    __tablename__ = "indicators"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    tipo = Column(Enum("entrada", "saida", name="indicator_type"), nullable=False)
    classificacao = Column(String, nullable=False)
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="indicators") 