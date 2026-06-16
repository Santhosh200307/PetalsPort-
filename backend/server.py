from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="PetalsPort API")
api_router = APIRouter(prefix="/api")


# ===== Seed Catalog (mirrors frontend/src/lib/data.js) =====
CATEGORIES = [
    {"slug": "wedding", "name": "Wedding", "tagline": "Sacred vows, in bloom."},
    {"slug": "birthday", "name": "Birthday", "tagline": "A year wrapped in petals."},
    {"slug": "corporate", "name": "Corporate", "tagline": "Refined ambience, on schedule."},
]

PRODUCTS = [
    {"id": "rose-red-dutch", "name": "Dutch Red Roses", "category": "wedding", "color": "Crimson", "season": "All year", "unit": "bunch of 20 stems", "retailPrice": 480, "wholesalePrice": 320, "minWholesale": 50},
    {"id": "marigold-genda", "name": "Marigold Genda", "category": "wedding", "color": "Saffron", "season": "Oct – Feb", "unit": "kilogram", "retailPrice": 180, "wholesalePrice": 90, "minWholesale": 20},
    {"id": "lily-oriental-white", "name": "Oriental White Lilies", "category": "corporate", "color": "Ivory", "season": "All year", "unit": "bunch of 10 stems", "retailPrice": 720, "wholesalePrice": 520, "minWholesale": 30},
    {"id": "carnation-blush", "name": "Carnation — Soft Blush", "category": "birthday", "color": "Blush", "season": "All year", "unit": "bunch of 25 stems", "retailPrice": 360, "wholesalePrice": 220, "minWholesale": 40},
    {"id": "orchid-cymbidium", "name": "Cymbidium Orchids", "category": "wedding", "color": "Champagne", "season": "Nov – Mar", "unit": "spike", "retailPrice": 850, "wholesalePrice": 610, "minWholesale": 25},
    {"id": "gerbera-mixed", "name": "Mixed Gerberas", "category": "birthday", "color": "Mixed", "season": "All year", "unit": "bunch of 20 stems", "retailPrice": 280, "wholesalePrice": 170, "minWholesale": 30},
    {"id": "tuberose-rajnigandha", "name": "Tuberose Rajnigandha", "category": "wedding", "color": "Snow", "season": "Apr – Oct", "unit": "kilogram", "retailPrice": 240, "wholesalePrice": 140, "minWholesale": 20},
    {"id": "hydrangea-antique", "name": "Antique Hydrangea", "category": "corporate", "color": "Sage Green", "season": "Jun – Oct", "unit": "stem", "retailPrice": 320, "wholesalePrice": 220, "minWholesale": 40},
    {"id": "tulip-pastel", "name": "Pastel Tulips", "category": "birthday", "color": "Pastel mix", "season": "Dec – Mar", "unit": "bunch of 10 stems", "retailPrice": 540, "wholesalePrice": 380, "minWholesale": 25},
]


# ===== Models =====
class QuoteRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = ""
    event_type: str
    event_date: str
    location: str
    guest_count: Optional[str] = ""
    budget: Optional[str] = ""
    notes: Optional[str] = ""


class QuoteRequestRecord(QuoteRequest):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = ""
    message: str


class ContactMessageRecord(ContactMessage):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class NewsletterSub(BaseModel):
    email: EmailStr


# ===== Routes =====
@api_router.get("/")
async def root():
    return {"app": "PetalsPort", "status": "blooming"}


@api_router.get("/categories")
async def list_categories():
    return CATEGORIES


@api_router.get("/products")
async def list_products(category: Optional[str] = None):
    if category and category != "all":
        return [p for p in PRODUCTS if p["category"] == category]
    return PRODUCTS


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    for p in PRODUCTS:
        if p["id"] == product_id:
            return p
    raise HTTPException(status_code=404, detail="Product not found")


@api_router.post("/quote-request")
async def submit_quote(payload: QuoteRequest):
    record = QuoteRequestRecord(**payload.model_dump())
    await db.quote_requests.insert_one(record.model_dump())
    return {"ok": True, "id": record.id}


@api_router.get("/quote-request")
async def list_quotes():
    docs = await db.quote_requests.find({}, {"_id": 0}).to_list(500)
    return docs


@api_router.post("/contact")
async def submit_contact(payload: ContactMessage):
    record = ContactMessageRecord(**payload.model_dump())
    await db.contact_messages.insert_one(record.model_dump())
    return {"ok": True, "id": record.id}


@api_router.get("/contact")
async def list_contacts():
    docs = await db.contact_messages.find({}, {"_id": 0}).to_list(500)
    return docs


@api_router.post("/newsletter")
async def newsletter(payload: NewsletterSub):
    doc = {
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.newsletter.update_one({"email": payload.email}, {"$set": doc}, upsert=True)
    return {"ok": True}


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


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
