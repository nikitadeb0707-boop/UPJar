from pydantic import BaseModel, Field  
from typing import Optional
from decimal import Decimal

class TransactionCreate(BaseModel):
    upi_id: int
    amount: float

class Token(BaseModel):
     accesstoken:str
     tokentype:str

class TokenData(BaseModel):
     id:Optional[str]=None  
# for user 
# Schema for incoming request body
class UserInvestmentCreate(BaseModel):
    investment_frequency: str   # e.g., Daily, Weekly, Monthly
    total_amount_to_invest: Decimal 
    taxable_frequency: int
# Schema for response payload
class UserInvestmentResponse(BaseModel):
    user_id: int
    investment_frequency: str
    total_amount_to_invest: float
    total_profit_loss: Optional [float] = None

    class Config:
        from_attributes = True