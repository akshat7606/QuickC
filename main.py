from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
import json
import uuid
from typing import List, Optional
from twilio.twiml.voice_response import VoiceResponse
import random
from dotenv import load_dotenv
import time
import asyncio
from pathlib import Path

# Load environment variables from a local .env file if present. This is optional and safe
# for local development (do NOT commit your .env file to version control).
load_dotenv()

# Database setup
import os
from fastapi.middleware.cors import CORSMiddleware
import httpx

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cab_aggregator.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if "sqlite" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String, unique=True, index=True)
    phone = Column(String, index=True)
    pickup_location = Column(String)
    drop_location = Column(String)
    driver_name = Column(String)
    driver_phone = Column(String)
    fare = Column(Float)
    eta_minutes = Column(Integer)
    status = Column(String, default="confirmed")  # confirmed, completed, cancelled
    channel = Column(String)  # APP, IVR
    created_at = Column(DateTime, default=datetime.utcnow)
    raw_data = Column(JSON)

class Driver(Base):
    __tablename__ = "drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String, unique=True)
    vehicle_type = Column(String)  # bike, auto, sedan, suv
    rating = Column(Float, default=4.0)
    location_lat = Column(Float)
    location_lng = Column(Float)
    is_available = Column(String, default="true")

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="QuickC API", version="1.0.0")

# CORS: allow frontend origins (comma-separated in FRONTEND_ORIGINS)
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in FRONTEND_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MapMyIndia server-side config (store these as env vars; never expose in frontend bundle)
MAPMYINDIA_KEY = os.getenv("MAPMYINDIA_REST_KEY", "")
MAPMYINDIA_CLIENT_ID = os.getenv("MAPMYINDIA_CLIENT_ID", "")
MAPMYINDIA_CLIENT_SECRET = os.getenv("MAPMYINDIA_CLIENT_SECRET", "")

if not MAPMYINDIA_KEY:
    # Provide a clear error early when starting the app in interactive runs. Do not
    # fail hard in all contexts because some deployments may set env vars differently.
    print("WARNING: MAPMYINDIA_REST_KEY is not set. MapMyIndia proxy endpoints will return 500 until configured.")

# Pydantic models
class SearchRequest(BaseModel):
    pickup_lat: float
    pickup_lng: float
    pickup_address: str
    drop_lat: Optional[float] = None
    drop_lng: Optional[float] = None
    drop_address: Optional[str] = None
    ride_type: Optional[str] = "any"  # bike, auto, sedan, suv, any

class DriverOffer(BaseModel):
    driver_id: str
    driver_name: str
    vehicle_type: str
    fare: float
    eta_minutes: int
    rating: float
    phone: str

class SearchResponse(BaseModel):
    offers: List[DriverOffer]
    search_id: str

class BookRequest(BaseModel):
    phone: str
    pickup_lat: float
    pickup_lng: float
    pickup_address: str
    drop_lat: Optional[float] = None
    drop_lng: Optional[float] = None
    drop_address: Optional[str] = None
    driver_id: str
    fare: float

class BookingResponse(BaseModel):
    booking_id: str
    driver_name: str
    driver_phone: str
    fare: float
    eta_minutes: int
    status: str

class IVRRequest(BaseModel):
    phone: str
    pickup_location: str
    drop_location: Optional[str] = None

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock data for MVP
MOCK_DRIVERS = [
    {"name": "Rajesh Kumar", "phone": "+919876543201", "vehicle_type": "auto", "rating": 4.2},
    {"name": "Amit Singh", "phone": "+919876543202", "vehicle_type": "sedan", "rating": 4.5},
    {"name": "Priya Sharma", "phone": "+919876543203", "vehicle_type": "bike", "rating": 4.1},
    {"name": "Suresh Patel", "phone": "+919876543204", "vehicle_type": "suv", "rating": 4.3},
    {"name": "Kavita Joshi", "phone": "+919876543205", "vehicle_type": "auto", "rating": 4.4},
]

def calculate_fare(vehicle_type: str, distance_km: float = 5.0) -> float:
    """Calculate fare based on vehicle type and distance"""
    base_rates = {
        "bike": 15,
        "auto": 25,
        "sedan": 35,
        "suv": 50
    }
    base_fare = base_rates.get(vehicle_type, 30)
    return round(base_fare + (distance_km * 8), 2)

def calculate_eta(distance_km: float = 5.0) -> int:
    """Calculate ETA in minutes"""
    return max(5, int(distance_km * 3) + random.randint(-2, 5))

@app.get("/")
async def root():
    return {"message": "QuickC API", "status": "running"}

@app.post("/v1/search", response_model=SearchResponse)
async def search_rides(request: SearchRequest):
    """Search for available rides"""
    try:
        # Mock distance calculation
        distance_km = random.uniform(3.0, 8.0)
        
        offers = []
        for driver in MOCK_DRIVERS:
            fare = calculate_fare(driver["vehicle_type"], distance_km)
            eta = calculate_eta(distance_km)
            
            # Add some randomness to make it realistic
            fare += random.uniform(-5, 10)
            fare = round(max(fare, 15), 2)
            
            offer = DriverOffer(
                driver_id=str(uuid.uuid4()),
                driver_name=driver["name"],
                vehicle_type=driver["vehicle_type"],
                fare=fare,
                eta_minutes=eta,
                rating=driver["rating"],
                phone=driver["phone"]
            )
            offers.append(offer)
        
        # Sort by fare (cheapest first)
        offers.sort(key=lambda x: x.fare)
        
        return SearchResponse(
            offers=offers,
            search_id=str(uuid.uuid4())
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/book", response_model=BookingResponse)
async def book_ride(request: BookRequest):
    """Book a ride"""
    try:
        db = next(get_db())
        
        # Find the driver (in real implementation, this would verify availability)
        driver_name = "Driver"
        driver_phone = "+919876543200"
        
        # Create booking
        booking_id = f"QuickC{int(datetime.now().timestamp())}"
        booking = Booking(
            booking_id=booking_id,
            phone=request.phone,
            pickup_location=request.pickup_address,
            drop_location=request.drop_address,
            driver_name=driver_name,
            driver_phone=driver_phone,
            fare=request.fare,
            eta_minutes=calculate_eta(),
            status="confirmed",
            channel="APP",
            raw_data=request.model_dump()
        )
        
        db.add(booking)
        db.commit()
        db.refresh(booking)
        
        return BookingResponse(
            booking_id=booking_id,
            driver_name=driver_name,
            driver_phone=driver_phone,
            fare=request.fare,
            eta_minutes=calculate_eta(),
            status="confirmed"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/history/{phone}")
async def get_booking_history(phone: str):
    """Get booking history for a phone number"""
    try:
        db = next(get_db())
        bookings = db.query(Booking).filter(Booking.phone == phone).order_by(Booking.created_at.desc()).all()
        
        history = []
        for booking in bookings:
            history.append({
                "booking_id": booking.booking_id,
                "pickup_location": booking.pickup_location,
                "drop_location": booking.drop_location,
                "driver_name": booking.driver_name,
                "driver_phone": booking.driver_phone,
                "fare": booking.fare,
                "status": booking.status,
                "channel": booking.channel,
                "created_at": booking.created_at.isoformat(),
                "eta_minutes": booking.eta_minutes
            })
        
        return {"phone": phone, "bookings": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/ivr")
async def handle_ivr_booking(request: Request):
    """Handle IVR booking requests from Twilio"""
    try:
        form_data = await request.form()
        
        # Extract data from Twilio webhook
        caller_phone = form_data.get("From", "")
        
        # Create TwiML response
        response = VoiceResponse()
        
        # Welcome message
        response.say("Welcome to QuickC! Please hold while we book your ride.")
        
        # For MVP, we'll create a simple booking
        db = next(get_db())
        booking_id = f"QuickC{int(datetime.now().timestamp())}"
        
        # Mock booking data for IVR
        booking = Booking(
            booking_id=booking_id,
            phone=caller_phone,
            pickup_location="Current Location (IVR)",
            drop_location="Nearby Destination",
            driver_name="Rajesh Kumar",
            driver_phone="+919876543201",
            fare=45.00,
            eta_minutes=8,
            status="confirmed",
            channel="IVR",
            raw_data={"source": "ivr", "caller": caller_phone}
        )
        
        db.add(booking)
        db.commit()
        
        # Confirm booking
        response.say(f"Your ride has been booked! Booking ID is {booking_id}. Driver Rajesh will reach you in 8 minutes. Thank you!")
        
        return PlainTextResponse(str(response), media_type="application/xml")
    except Exception as e:
        response = VoiceResponse()
        response.say("Sorry, we couldn't process your booking. Please try again later.")
        return PlainTextResponse(str(response), media_type="application/xml")

@app.get("/v1/partner/health")
async def partner_health():
    """Health check for partner integrations"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "partners": {
            "mock_drivers": "online",
            "ivr_system": "online"
        }
    }

@app.get("/v1/mapmyindia/autocomplete")
async def mapmyindia_autocomplete(query: str):
    """Proxy autocomplete request to MapMyIndia using the server-side REST key.
    Returns the raw MapMyIndia JSON response. When debug mode is enabled, return
    recent sanitized upstream logs on failure to aid debugging.
    """
    if not MAPMYINDIA_KEY and not (MAPMYINDIA_CLIENT_ID and MAPMYINDIA_CLIENT_SECRET):
        raise HTTPException(status_code=500, detail="MapMyIndia REST key is not configured on the server")
    try:
        status, data = await call_mapmyindia_autocomplete(query)
        return data
    except HTTPException as e:
        # If debug mode is enabled, return the last few sanitized log entries to help debugging
        if os.getenv("MAPMYINDIA_DEBUG", "") == "true":
            entries = []
            if LOG_FILE.exists():
                with LOG_FILE.open("r", encoding="utf-8") as f:
                    lines = f.read().splitlines()
                for line in lines[-5:]:
                    try:
                        entries.append(json.loads(line))
                    except Exception:
                        continue
            return {"error": str(e.detail), "sanitized_logs": entries}
        raise

@app.get("/v1/mapmyindia/reverse")
async def mapmyindia_reverse(lat: float, lng: float):
    """Proxy reverse geocode request to MapMyIndia using the server-side REST key.
    Returns the raw MapMyIndia JSON response. When debug mode is enabled, return
    recent sanitized upstream logs on failure to aid debugging.
    """
    if not MAPMYINDIA_KEY and not (MAPMYINDIA_CLIENT_ID and MAPMYINDIA_CLIENT_SECRET):
        raise HTTPException(status_code=500, detail="MapMyIndia REST key is not configured on the server")
    try:
        status, data = await call_mapmyindia_reverse(lat, lng)
        return data
    except HTTPException as e:
        if os.getenv("MAPMYINDIA_DEBUG", "") == "true":
            entries = []
            if LOG_FILE.exists():
                with LOG_FILE.open("r", encoding="utf-8") as f:
                    lines = f.read().splitlines()
                for line in lines[-5:]:
                    try:
                        entries.append(json.loads(line))
                    except Exception:
                        continue
            return {"error": str(e.detail), "sanitized_logs": entries}
        raise

# In-memory OAuth token cache for MapMyIndia (local only)
_mapmyindia_token = None
_mapmyindia_token_expires_at = 0
_mapmyindia_token_lock = asyncio.Lock()

# Logging setup (sanitized, local-only)
LOG_FILE = Path("./mapmyindia_errors.log")
ADMIN_TOKEN = os.getenv("MAPMYINDIA_ADMIN_TOKEN", "")

def append_sanitized_log(entry: dict):
    # Keep logs small and avoid storing secrets
    try:
        entry_copy = {k: entry.get(k) for k in ("timestamp","endpoint","params","upstream_status","upstream_headers","note")}
        with LOG_FILE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry_copy, ensure_ascii=False) + "\n")
    except Exception as e:
        print("Failed to write mapmyindia error log:", e)

@app.get("/v1/mapmyindia/logs")
async def mapmyindia_logs(limit: int = 20, admin_token: str = ""):
    """Return last `limit` sanitized log entries. Requires ADMIN_TOKEN to be set and matched.
    Use only in local/dev. Do NOT enable in production without securing the endpoint.
    """
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Admin logging is not enabled on the server")
    if admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid admin token")

    if not LOG_FILE.exists():
        return {"entries": []}

    entries = []
    with LOG_FILE.open("r", encoding="utf-8") as f:
        lines = f.read().splitlines()
    for line in lines[-limit:]:
        try:
            entries.append(json.loads(line))
        except Exception:
            continue
    return {"entries": entries}

async def fetch_oauth_token():
    """Fetch or return cached MapMyIndia OAuth token using client credentials.
    Returns access_token str or raises HTTPException on failure.
    """
    global _mapmyindia_token, _mapmyindia_token_expires_at
    # Fast path: return cached token if still valid (with 30s buffer)
    if _mapmyindia_token and time.time() < (_mapmyindia_token_expires_at - 30):
        return _mapmyindia_token

    async with _mapmyindia_token_lock:
        if _mapmyindia_token and time.time() < (_mapmyindia_token_expires_at - 30):
            return _mapmyindia_token

        if not MAPMYINDIA_CLIENT_ID or not MAPMYINDIA_CLIENT_SECRET:
            raise HTTPException(status_code=500, detail="MapMyIndia client credentials are not configured on the server")

        token_url = "https://outpost.mapmyindia.com/api/security/oauth/token"
        data = {
            "grant_type": "client_credentials",
            "client_id": MAPMYINDIA_CLIENT_ID,
            "client_secret": MAPMYINDIA_CLIENT_SECRET
        }
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(token_url, data=data, timeout=10.0)
                resp.raise_for_status()
                body = resp.json()
                access_token = body.get("access_token")
                expires_in = int(body.get("expires_in", 0))
                if not access_token:
                    raise HTTPException(status_code=502, detail="Failed to obtain MapMyIndia access token")

                _mapmyindia_token = access_token
                _mapmyindia_token_expires_at = time.time() + max(expires_in, 60)
                print("MapMyIndia: obtained access token (expires_in=", expires_in, ")")
                return _mapmyindia_token
            except httpx.HTTPStatusError as e:
                detail = e.response.text if getattr(e, 'response', None) else str(e)
                print("MapMyIndia token exchange failed:", e.response.status_code, detail)
                raise HTTPException(status_code=502, detail=f"MapMyIndia token exchange failed: {e.response.status_code}")
            except Exception as e:
                print("MapMyIndia token exchange exception:", str(e))
                raise HTTPException(status_code=502, detail=f"Failed to fetch MapMyIndia token: {str(e)}")

async def _call_mapmyindia(url: str, params: dict, headers: Optional[dict] = None):
    """Call MapMyIndia and return (status_code, body, headers).
    Do not raise on non-2xx so callers can inspect status and decide whether to
    fallback to the OAuth flow or return an informative error to clients.
    """
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, headers=headers, timeout=10.0)
        # Try parse JSON if possible, otherwise return text
        try:
            body = resp.json()
        except Exception:
            body = resp.text
        # Return headers as a regular dict (safe to log selected keys)
        return resp.status_code, body, dict(resp.headers)

async def call_mapmyindia_autocomplete(query: str):
    """Call MapMyIndia autocomplete: try REST key path first; on 401/412 try OAuth token fallback."""
    params = {"query": query}

    # 1) Try REST-key-in-path if configured
    if MAPMYINDIA_KEY:
        url_with_key = f"https://apis.mapmyindia.com/advancedmaps/v1/{MAPMYINDIA_KEY}/autocomplete"
        status, data, upstream_headers = await _call_mapmyindia(url_with_key, params)
        if status == 200:
            return status, data
        # record sanitized log with a truncated body (avoid storing secrets)
        try:
            append_sanitized_log({
                "timestamp": datetime.utcnow().isoformat(),
                "endpoint": "autocomplete (restkey)",
                "params": {"query": query},
                "upstream_status": status,
                "upstream_headers": {k: v for k, v in upstream_headers.items() if k.lower() in ("x-cache", "via", "x-amz-cf-id", "server")},
                "note": "REST key path failed",
                # include small excerpt of body when debug enabled
                "body_excerpt": (json.dumps(data)[:1000] if os.getenv("MAPMYINDIA_DEBUG", "") == "true" else None)
            })
        except Exception:
            pass
        if status not in (401, 412):
            if os.getenv("MAPMYINDIA_DEBUG", "") == "true":
                raise HTTPException(status_code=502, detail=f"MapMyIndia returned {status}: {json.dumps(data) if isinstance(data,(dict,list)) else str(data)}")
            raise HTTPException(status_code=502, detail=f"MapMyIndia returned {status}")
        # else fall through to token flow (401/412)

    # 2) Try OAuth client_credentials flow (if configured)
    if MAPMYINDIA_CLIENT_ID and MAPMYINDIA_CLIENT_SECRET:
        token = await fetch_oauth_token()
        auth_url = "https://apis.mapmyindia.com/advancedmaps/v1/autocomplete"
        headers = {"Authorization": f"Bearer {token}"}
        s2, data2, upstream_headers2 = await _call_mapmyindia(auth_url, params, headers=headers)
        if s2 == 200:
            return s2, data2
        try:
            append_sanitized_log({
                "timestamp": datetime.utcnow().isoformat(),
                "endpoint": "autocomplete (oauth)",
                "params": {"query": query},
                "upstream_status": s2,
                "upstream_headers": {k: v for k, v in upstream_headers2.items() if k.lower() in ("x-cache", "via", "x-amz-cf-id", "server")},
                "note": "OAuth fallback failed",
                "body_excerpt": (json.dumps(data2)[:1000] if os.getenv("MAPMYINDIA_DEBUG", "") == "true" else None)
            })
        except Exception:
            pass
        if os.getenv("MAPMYINDIA_DEBUG", "") == "true":
            raise HTTPException(status_code=502, detail=f"MapMyIndia returned {s2}: {json.dumps(data2) if isinstance(data2,(dict,list)) else str(data2)}")
        raise HTTPException(status_code=502, detail=f"MapMyIndia returned {s2}")

    # No valid auth method succeeded
    raise HTTPException(status_code=502, detail="No valid MapMyIndia credentials available or all auth methods failed")

async def call_mapmyindia_reverse(lat: float, lng: float):
    params = {"lat": lat, "lng": lng}

    if MAPMYINDIA_KEY:
        url_with_key = f"https://apis.mapmyindia.com/advancedmaps/v1/{MAPMYINDIA_KEY}/rev_geocode"
        status, data, upstream_headers = await _call_mapmyindia(url_with_key, params)
        if status == 200:
            return status, data
        try:
            append_sanitized_log({
                "timestamp": datetime.utcnow().isoformat(),
                "endpoint": "reverse (restkey)",
                "params": {"lat": lat, "lng": lng},
                "upstream_status": status,
                "upstream_headers": {k: v for k, v in upstream_headers.items() if k.lower() in ("x-cache", "via", "x-amz-cf-id", "server")},
                "note": "REST key reverse failed",
                "body_excerpt": (json.dumps(data)[:1000] if os.getenv("MAPMYINDIA_DEBUG", "") == "true" else None)
            })
        except Exception:
            pass
        if status not in (401, 412):
            if os.getenv("MAPMYINDIA_DEBUG", "") == "true":
                raise HTTPException(status_code=502, detail=f"MapMyIndia returned {status}: {json.dumps(data) if isinstance(data,(dict,list)) else str(data)}")
            raise HTTPException(status_code=502, detail=f"MapMyIndia returned {status}")
        # else fall through to OAuth flow

    if MAPMYINDIA_CLIENT_ID and MAPMYINDIA_CLIENT_SECRET:
        token = await fetch_oauth_token()
        auth_url = "https://apis.mapmyindia.com/advancedmaps/v1/rev_geocode"
        headers = {"Authorization": f"Bearer {token}"}
        s2, data2, upstream_headers2 = await _call_mapmyindia(auth_url, params, headers=headers)
        if s2 == 200:
            return s2, data2
        print(f"OAuth reverse call failed with {s2}: {data2}")
        try:
            append_sanitized_log({
                "timestamp": datetime.utcnow().isoformat(),
                "endpoint": "reverse (oauth)",
                "params": {"lat": lat, "lng": lng},
                "upstream_status": s2,
                "upstream_headers": {k: v for k, v in upstream_headers2.items() if k.lower() in ("x-cache", "via", "x-amz-cf-id", "server")},
                "note": "OAuth fallback failed (reverse)",
                "body_excerpt": (json.dumps(data2)[:1000] if os.getenv("MAPMYINDIA_DEBUG", "") == "true" else None)
            })
        except Exception:
            pass
        if os.getenv("MAPMYINDIA_DEBUG", "") == "true":
            raise HTTPException(status_code=502, detail=f"MapMyIndia returned {s2}: {json.dumps(data2) if isinstance(data2,(dict,list)) else str(data2)}")
        raise HTTPException(status_code=502, detail=f"MapMyIndia returned {s2}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
