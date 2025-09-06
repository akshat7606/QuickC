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

# Database setup
SQLITE_DATABASE_URL = "sqlite:///./cab_aggregator.db"
engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
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
app = FastAPI(title="Universal Cab Aggregator API", version="1.0.0")

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
    return {"message": "Universal Cab Aggregator API", "status": "running"}

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
        booking_id = f"UCA{int(datetime.now().timestamp())}"
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
            raw_data=request.dict()
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
        response.say("Welcome to Universal Cab Aggregator! Please hold while we book your ride.")
        
        # For MVP, we'll create a simple booking
        db = next(get_db())
        booking_id = f"UCA{int(datetime.now().timestamp())}"
        
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)