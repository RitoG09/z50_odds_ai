from pydantic import BaseModel

class OddsRequest(BaseModel):
    teamA: str
    teamB: str
    teamA_rating: float
    teamB_rating: float