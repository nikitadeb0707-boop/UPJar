from database import Base
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship,func
from sqlalchemy import column,Integer, String, Boolean, text, TIMESTAMP, ForeignKey,  Numeric
from datetime import datetime
from decimal import Decimal

class User(Base):
    __tablename__ = "users"
    user_id: Mapped[int] = mapped_column(primary_key=True)
    phonenumber: Mapped[str] = mapped_column(String, nullable=False)
    upi_id: Mapped[str] = mapped_column(String, nullable=False)
    investment_ledger_id: Mapped[int | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    original_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    rounded_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    round_up_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    invested: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    timestamp: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())


class InvestmentSettings(Base):
    __tablename__ = "investment_settings"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    goal_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    period_days: Mapped[int] = mapped_column(Integer, nullable=False)
    daily_tx_limit: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
