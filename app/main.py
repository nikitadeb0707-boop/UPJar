from fastapi.middleware.cors import CORSMiddleware
from .routers import user, auth
from . import models
from .routers import roundup
from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roundup.router)
app.include_router(user.router)
app.include_router(auth.router)