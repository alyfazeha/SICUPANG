"""
Ini merupakan endpoint dari aplikasi SICUPANG, dan masih berupa contoh kode
yang bisa diganti sesuai kebutuhan.
"""

from fastapi import FastAPI
from fastapi.routing import APIRouter
from routes.food_recommendation import router

app = FastAPI(title="Emolog API")

assert isinstance(router, APIRouter)
app.include_router(router, prefix="/api")