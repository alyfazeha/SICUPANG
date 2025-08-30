from fastapi import APIRouter
from pydantic import BaseModel
from services.prompt_template import RAGModel
from typing import Dict

router: APIRouter = APIRouter()
rag: RAGModel = RAGModel()
rag.load_and_prepare_price_context()

class TextInput(BaseModel):
    budget: int
    riwayat_penyakit: str
    alergi: str

@router.post("/food-recommendation")
def get_recommendation(input: TextInput) -> Dict[str, object]:
    result = rag.get_recommendation(input.budget, input.riwayat_penyakit, input.alergi)
    return {"response": result}