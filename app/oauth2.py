from datetime import datetime, timedelta
# pyrefly: ignore [missing-import]
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import schemas,database,models
import os

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-for-dev-only")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="login")



def creataccesstoken(data: dict):
    toencode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    toencode.update({"exp": expire})
    encodedjwt = jwt.encode(toencode, SECRET_KEY, algorithm=ALGORITHM)
    return encodedjwt

def verifyaccesstoken(token: str, credential_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credential_exception
        tokendata = schemas.TokenData(id=user_id)
    except JWTError:
        raise credential_exception
    return tokendata

def getcurrentuser(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentialsexception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    token_data = verifyaccesstoken(token, credentialsexception)
    
    # 1. Explicitly check that token_data.id is not None
    if token_data.id is None:
        raise credentialsexception

    # 2. Query database using verified int user_id
    user = db.query(models.User).filter(models.User.user_id == int(token_data.id)).first()  # pyrefly: ignore
    
    if not user:
        raise credentialsexception
        
    return user