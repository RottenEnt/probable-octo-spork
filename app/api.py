from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.algorithms.sorting import bubble_sort_steps  # см. пояснение ниже

api_router = APIRouter()  # <-- имя меняем на api_router

class SortRequest(BaseModel):
    array: List[int]
    algorithm: str = "bubble"

class SortStep(BaseModel):
    array: List[int]
    compare: Optional[List[int]] = None
    swap: Optional[List[int]] = None
    description: str

@api_router.post("/visualize/sort", response_model=List[SortStep])
async def visualize_sort(req: SortRequest):
    # Пока поддерживаем только bubble sort
    if req.algorithm != "bubble":
        # Можно расширить позже: например, выбросить HTTPException(400, ...)
        pass

    steps = bubble_sort_steps(req.array)
    return steps