from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, conint
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ===== Models =====
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class RatingIn(BaseModel):
    voter_id: str = Field(min_length=4, max_length=128)
    score: conint(ge=1, le=10)


class RatingOut(BaseModel):
    ep_num: int
    avg: float
    count: int
    mine: Optional[int] = None


# ===== Status routes =====
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ===== IMDb-style episode ratings =====
# Collection: episode_ratings
#   { ep_num, voter_id, score (1..10), updated_at }
# One doc per (ep_num, voter_id) — re-voting upserts.

async def _ensure_rating_index():
    try:
        await db.episode_ratings.create_index(
            [("ep_num", 1), ("voter_id", 1)], unique=True, name="ep_voter_unique"
        )
    except Exception as e:  # pragma: no cover
        logging.getLogger(__name__).warning("rating index init failed: %s", e)


async def _aggregate_rating(ep_num: int, voter_id: Optional[str]) -> RatingOut:
    pipeline = [
        {"$match": {"ep_num": ep_num}},
        {"$group": {"_id": "$ep_num", "sum": {"$sum": "$score"}, "count": {"$sum": 1}}},
    ]
    agg = await db.episode_ratings.aggregate(pipeline).to_list(1)
    if agg:
        count = agg[0]["count"]
        avg = round(agg[0]["sum"] / count, 1) if count else 0.0
    else:
        count, avg = 0, 0.0

    mine = None
    if voter_id:
        doc = await db.episode_ratings.find_one(
            {"ep_num": ep_num, "voter_id": voter_id}, {"_id": 0, "score": 1}
        )
        if doc:
            mine = int(doc["score"])

    return RatingOut(ep_num=ep_num, avg=avg, count=count, mine=mine)


@api_router.get("/ratings/{ep_num}", response_model=RatingOut)
async def get_rating(ep_num: int, voter_id: Optional[str] = None):
    if ep_num < 1 or ep_num > 999:
        raise HTTPException(status_code=400, detail="invalid ep_num")
    return await _aggregate_rating(ep_num, voter_id)


@api_router.get("/ratings", response_model=List[RatingOut])
async def get_all_ratings(voter_id: Optional[str] = None):
    """Bulk fetch: aggregated rating for every episode that has at least
    one vote, used to build the IMDb-style 'Bölümler' ranking page in a
    single request instead of N requests."""
    pipeline = [
        {"$group": {"_id": "$ep_num", "sum": {"$sum": "$score"}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    agg = await db.episode_ratings.aggregate(pipeline).to_list(1000)

    mine_by_ep = {}
    if voter_id:
        cursor = db.episode_ratings.find(
            {"voter_id": voter_id}, {"_id": 0, "ep_num": 1, "score": 1}
        )
        async for doc in cursor:
            mine_by_ep[doc["ep_num"]] = int(doc["score"])

    out = []
    for row in agg:
        ep_num = row["_id"]
        count = row["count"]
        avg = round(row["sum"] / count, 1) if count else 0.0
        out.append(RatingOut(ep_num=ep_num, avg=avg, count=count, mine=mine_by_ep.get(ep_num)))
    return out


@api_router.post("/ratings/{ep_num}", response_model=RatingOut)
async def submit_rating(ep_num: int, payload: RatingIn):
    if ep_num < 1 or ep_num > 999:
        raise HTTPException(status_code=400, detail="invalid ep_num")
    await db.episode_ratings.update_one(
        {"ep_num": ep_num, "voter_id": payload.voter_id},
        {"$set": {
            "ep_num": ep_num,
            "voter_id": payload.voter_id,
            "score": int(payload.score),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    return await _aggregate_rating(ep_num, payload.voter_id)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def _startup():
    await _ensure_rating_index()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
