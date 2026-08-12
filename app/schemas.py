from pydantic import BaseModel, Field  
from typing import Optional

class TransactionCreate(BaseModel):
    upi_id: int
    amount: float

class Token(BaseModel):
     accesstoken:str
     tokentype:str

class TokenData(BaseModel):
     id:Optional[int]=None  
# for user 
# Schema for incoming request body
class UserInvestmentCreate(BaseModel):
    investment_frequency: str = Field(..., example="Monthly")  # e.g., Daily, Weekly, Monthly
    total_amount_to_invest: float = Field(..., gt=0, example=500.0)
    taxable_frequency: Optional[str] = Field(None, example="Quarterly")  # e.g., Quarterly, Annually
# Schema for response payload
class UserInvestmentResponse(BaseModel):
    user_id: int
    investment_frequency: str
    total_amount_to_invest: float
    total_profit_loss: float

    class Config:
        from_attributes = True