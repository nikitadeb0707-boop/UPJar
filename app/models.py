from sqlalchemy import Column, Integer, String, Numeric, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True)
    phonenumber = Column(Integer, nullable=False)
    upi_id = Column(String, nullable=False)
    investment_ledger_id = Column(Integer, nullable=True)  # FK added once that table exists
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class Transaction(Base):
    __tablename__ = "transactions"
    transaction_id = Column(String, primary_key=True)  # idempotency key, PK not auto-increment int
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    original_amount = Column(Numeric(10, 2), nullable=False)
    rounded_amount = Column(Numeric(10, 2), nullable=False)
    round_up_amount = Column(Numeric(10, 2), nullable=False)
    timestamp = Column(TIMESTAMP(timezone=True), server_default=func.now())


