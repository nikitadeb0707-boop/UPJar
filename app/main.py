from fastapi import FastAPI, Body,Response,status,HTTPException, Depends, APIRouter
#import psycopg2,time
from psycopg2.extras import RealDictCursor
import models
from sqlalchemy.orm import Session
from routers import roundup
app = FastAPI()
app.include_router(roundup.router)