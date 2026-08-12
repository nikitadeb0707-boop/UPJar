from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    upi_id: int
    amount: float

class Token(BaseModel):
     accesstoken:str
     tokentype:str

class TokenData(BaseModel):
     id:Optional[int]=None  