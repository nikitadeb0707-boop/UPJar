from fastapi import FastAPI, Body,Response,status,HTTPException, Depends,APIRouter
from sqlalchemy.orm import Session
import schemas,oauth2,models,database
import uuid
from datetime import datetime, timedelta
from sqlalchemy import func as sqlfunc

router= APIRouter(
     prefix="/transactions",
     tags=['transactions']
)  

@router.post("/ingest")
def ingest_transaction(post: schemas.TransactionCreate,current_user: models.User = Depends(oauth2.getcurrentuser),db: Session = Depends(database.getdb)):
    # User is already identified by JWT
    user_id = current_user.user_id

    # Generate transaction ID internally
    transaction_id = str(uuid.uuid4())

    # Incoming transaction amount
    amount = post.amount

   
    settings = db.query(models.InvestmentSettings).filter(models.InvestmentSettings.user_id == user_id).first()

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    todays_count = db.query(sqlfunc.count(models.Transaction.transaction_id)).filter(models.Transaction.user_id == user_id,models.Transaction.created_at >= today_start).scalar()

    apply_roundup = settings is None or todays_count < settings.daily_tx_limit

    if apply_roundup:
        rounded_amount = ((amount + 9) // 10) * 10
        round_up_amount = rounded_amount - amount
    else:
        rounded_amount = amount
        round_up_amount = 0

    new_transaction = models.Transaction(
        transaction_id=transaction_id,
        user_id=user_id,
        original_amount=amount,
        rounded_amount=rounded_amount,
        round_up_amount=round_up_amount
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.get("/")
def get_transactions(current_user: models.User = Depends(oauth2.getcurrentuser),db: Session = Depends(database.getdb)):
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == current_user.user_id).all()

    return transactions