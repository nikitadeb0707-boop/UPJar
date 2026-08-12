from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ---------- POST: set investment preferences ----------
@router.post(
    "/{user_id}/investments",
    response_model=schemas.UserInvestmentResponse,
    status_code=status.HTTP_201_CREATED
)
def set_user_investment_data(
    user_id: int,
    investment_data: schemas.UserInvestmentCreate,
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )

    # Save all three fields
    user.investment_frequency = investment_data.investment_frequency
    user.total_amount_to_invest = investment_data.total_amount_to_invest
    user.taxable_frequency = investment_data.taxable_frequency

    db.commit()
    db.refresh(user)

    return user


# ---------- GET: get investment data + profit/loss ----------
@router.get(
    "/{user_id}/investments",
    response_model=schemas.UserInvestmentResponse
)
def get_user_investment_data(
    user_id: int,
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )

    # Returns: frequency, amount, taxable_frequency, total_profit_loss
    return user