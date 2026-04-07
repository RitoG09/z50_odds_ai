from fastapi import FastAPI
from app.schemas.request import OddsRequest
from app.model.odds_model import generate_odds

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Odds AI Service (z50 assignment) Running"}

@app.post("/generate-odds")
def generate(data: OddsRequest):
    result = generate_odds(
        data.teamA_rating,
        data.teamB_rating
    )
    return result