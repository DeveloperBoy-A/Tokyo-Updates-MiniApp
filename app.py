import hashlib
import hmac
import json
import os
import time
from typing import Any
from urllib.parse import parse_qsl

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pymongo import MongoClient

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
BOT_TOKEN = os.getenv("BOT_TOKEN", "")
MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("MONGODB_DATABASE", "tokyo_updates")
REQUIRE_TELEGRAM_AUTH = os.getenv("REQUIRE_TELEGRAM_AUTH", "false").lower() == "true"

app = FastAPI(title="Tokyo Updates Mini App", version="1.0.0")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
_mongo_client = None
_db = None
if MONGODB_URI:
    try:
        _mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2500)
        _db = _mongo_client[DB_NAME]
    except Exception:
        _mongo_client = None
        _db = None

# Starter catalog data. Replace with your real catalog/database integration.
CATALOG = [
    {"id": "tokyo-001", "title": "Tokyo Picks", "year": 2026, "type": "Featured", "language": "Hindi", "quality": "HD", "description": "Featured picks from Tokyo Updates."},
    {"id": "tokyo-002", "title": "Series Spotlight", "year": 2026, "type": "Series", "language": "Hindi", "quality": "HD", "description": "Discover a series spotlight."},
    {"id": "tokyo-003", "title": "Weekend Watchlist", "year": 2025, "type": "Movies", "language": "English", "quality": "Full HD", "description": "A sample watchlist card."},
    {"id": "tokyo-004", "title": "Anime Corner", "year": 2026, "type": "Anime", "language": "Japanese", "quality": "HD", "description": "Explore the anime corner."},
]


def validate_init_data(init_data: str, max_age: int = 86400) -> dict[str, Any]:
    """Validate Telegram Mini App initData with the bot token; reject stale data."""
    if not BOT_TOKEN:
        raise HTTPException(status_code=503, detail="BOT_TOKEN is not configured")
    try:
        pairs = dict(parse_qsl(init_data, keep_blank_values=True, strict_parsing=True))
        received_hash = pairs.pop("hash")
        auth_date = int(pairs.get("auth_date", "0"))
    except (ValueError, KeyError):
        raise HTTPException(status_code=401, detail="Invalid Telegram initData")
    if auth_date <= 0 or abs(int(time.time()) - auth_date) > max_age:
        raise HTTPException(status_code=401, detail="Telegram initData expired")
    data_check_string = "\n".join(f"{key}={value}" for key, value in sorted(pairs.items()))
    secret_key = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
    calculated = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(calculated, received_hash):
        raise HTTPException(status_code=401, detail="Telegram initData signature mismatch")
    user = json.loads(pairs.get("user", "{}"))
    return {"user": user, "auth_date": auth_date}


async def current_user(authorization: str | None) -> dict[str, Any] | None:
    if not authorization or not authorization.startswith("tma "):
        if REQUIRE_TELEGRAM_AUTH:
            raise HTTPException(status_code=401, detail="Open this Mini App from Telegram")
        return None
    return validate_init_data(authorization[4:])


@app.get("/")
async def index():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))


@app.get("/api/health")
async def health():
    return {"ok": True, "service": "Tokyo Updates Mini App", "database_configured": _db is not None}


@app.get("/api/catalog")
async def catalog(q: str = "", category: str = "All", language: str = "All"):
    items = CATALOG
    if category and category != "All":
        items = [item for item in items if item["type"].lower() == category.lower()]
    if language and language != "All":
        items = [item for item in items if item["language"].lower() == language.lower()]
    if q.strip():
        needle = q.strip().casefold()
        items = [item for item in items if needle in item["title"].casefold() or needle in item["description"].casefold()]
    return {"items": items, "count": len(items)}


@app.get("/api/me")
async def me(authorization: str | None = Header(default=None)):
    user = await current_user(authorization)
    if not user:
        return {"authenticated": False, "user": None, "premium": False, "points": 0}
    telegram_user = user.get("user", {})
    result = {"authenticated": True, "user": telegram_user, "premium": False, "points": 0}
    if _db is not None and telegram_user.get("id") is not None:
        saved = _db.users.find_one({"telegram_id": telegram_user["id"]}, {"_id": 0, "premium": 1, "points": 1}) or {}
        result.update({"premium": bool(saved.get("premium", False)), "points": int(saved.get("points", 0))})
    return result


@app.post("/api/referral/claim")
async def referral_claim(request: Request, authorization: str | None = Header(default=None)):
    """Minimal referral endpoint; requires MongoDB and validated Telegram auth."""
    user = await current_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Telegram authentication required")
    if _db is None:
        raise HTTPException(status_code=503, detail="MongoDB is not configured")
    payload = await request.json()
    referral_code = str(payload.get("code", "")).strip()
    telegram_user = user.get("user", {})
    telegram_id = telegram_user.get("id")
    if not referral_code or not telegram_id:
        raise HTTPException(status_code=400, detail="Referral code is required")
    referrer = _db.users.find_one({"referral_code": referral_code})
    if not referrer or referrer.get("telegram_id") == telegram_id:
        raise HTTPException(status_code=400, detail="Invalid referral code")
    existing = _db.referrals.find_one({"referred_id": telegram_id})
    if existing:
        raise HTTPException(status_code=409, detail="Referral already claimed")
    _db.referrals.insert_one({"referrer_id": referrer["telegram_id"], "referred_id": telegram_id, "created_at": int(time.time())})
    _db.users.update_one({"telegram_id": referrer["telegram_id"]}, {"$inc": {"points": 1}}, upsert=True)
    _db.users.update_one({"telegram_id": telegram_id}, {"$setOnInsert": {"telegram_id": telegram_id, "points": 0}}, upsert=True)
    return {"ok": True, "message": "Referral recorded"}
