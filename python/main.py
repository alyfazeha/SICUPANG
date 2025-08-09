
"""
Ini merupakan endpoint dari aplikasi SICUPANG, dan masih berupa contoh kode
yang bisa diganti sesuai kebutuhan.
"""

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Input(BaseModel):
    anggota_keluarga: int
    penghasilan: float
    pengeluaran: float


@app.post("/rekomendasi")
def rekomendasi(data: Input):
    return {"rekomendasi": data.penghasilan - data.pengeluaran}