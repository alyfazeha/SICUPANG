from fastapi import APIRouter, Depends
from app.services.prompt_template import RAGModel
from pydantic import BaseModel

router = APIRouter()
rag = RAGModel()
rag.load_and_prepare_price_context()
class TextInput(BaseModel):
    budget: int
    riwayat_penyakit: str
    alergi: str

@router.post("/food-recommendation")
def get_recommendation(input: TextInput):
    result = rag.get_recommendation(input.budget, input.riwayat_penyakit, input.alergi)
    return {"response": result}

