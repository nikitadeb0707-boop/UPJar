from fastapi import FastAPI, Body,Response,status,HTTPException, Depends,APIRouter
from sqlalchemy.orm import Session
import schemas,oauth2,models,database
import uuid

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

    # Round up to nearest ₹10
    rounded_amount = ((amount+9 // 10) + 1) * 10

    # Calculate roundup amount
    round_up_amount = rounded_amount - amount

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