from fastapi import APIRouter,Depends,HTTPException,status, Response
import database,models,schemas,oauth2,utilts
from sqlalchemy.orm import Session
import bcrypt
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
router= APIRouter( 
    tags =['auth']
    )
@router.post('/login', response_model=schemas.Token)
def login(credentials:OAuth2PasswordRequestForm= Depends(),db:Session = Depends(database.getdb)):
   
    user = db.query(models.User).filter(models.User.phonenumber==credentials.phonenumber).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="invalid email")
    if not utilts.verify(credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    accesstoken=oauth2.creataccesstoken(data={"sub": str(user.id)})
    return {"accesstoken":accesstoken,"tokentype":"token bearer"}
