# Overview

This is the Universal Cab Aggregator (UCA) application - a unified platform for booking rides from multiple providers (Uber, Ola, Rapido, etc.). The system normalizes ride options, displays comparative ETAs and fares, and allows users to either deep-link to provider apps or complete bookings directly through the platform. The backend is built with FastAPI and includes database models for managing bookings and drivers, with support for both mobile app integration and IVR (phone-based) booking channels.

## Current Status
✅ **Backend MVP Complete**: FastAPI server running on port 8000 with all core endpoints functional
✅ **Database Schema**: SQLite database with Booking and Driver models implemented  
✅ **API Endpoints**: Search, Book, History, IVR, and Health endpoints all tested and working
✅ **IVR Integration**: Twilio webhook support for voice-based bookings
✅ **Mock Data**: Complete set of mock drivers and fare calculation algorithms

## Project Structure
```
/
├── main.py              # FastAPI backend with all endpoints
├── cab_aggregator.db    # SQLite database (auto-created)
├── replit.md           # Project documentation
└── .pythonlibs/        # Python dependencies
```

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Framework
- **FastAPI**: RESTful API server providing endpoints for ride search, booking management, and partner integrations
- **SQLAlchemy ORM**: Database abstraction layer with declarative models for bookings and drivers
- **SQLite**: Local database for development and testing (production likely uses PostgreSQL)

## Database Design
- **Booking Model**: Stores ride bookings with pickup/drop locations, driver details, fare information, status tracking, and support for multiple booking channels (APP/IVR)
- **Driver Model**: Manages driver profiles including contact information, vehicle types, ratings, location coordinates, and availability status

## Integration Strategy
The system supports three levels of partner integration:
1. **Deep-link MVP**: Simple URL redirects to partner apps
2. **Affiliate/Partner API**: Server-side API calls to retrieve real-time ride options
3. **Full booking API**: OAuth-based user authentication with complete booking management

## Data Normalization
- **Ride Types**: Maps various provider categories into standardized types (bike, economy, sedan, premium, XL, auto)
- **Pricing**: Normalizes fare structures including base price, distance charges, time charges, fees, and surge pricing
- **ETA**: Standardizes estimated arrival times across providers

## Ranking Algorithm
Uses weighted scoring system considering:
- Price normalization (40% weight)
- ETA optimization (30% weight) 
- Provider reliability (20% weight)
- User preferences (10% weight)
- Surge pricing penalty (15% deduction)

## Communication Channels
- **Mobile App**: Primary interface for ride aggregation and booking
- **IVR System**: Twilio-based voice response system for phone bookings
- **Webhook Support**: Partner notification system for booking status updates

# External Dependencies

## Core Services
- **Twilio**: Voice response system for IVR booking functionality
- **Partner APIs**: Integration with ride-sharing providers (Uber, Ola, Rapido)

## Performance Infrastructure
- **Redis**: Caching layer with TTL for search results and provider responses
- **Circuit Breaker**: Failover mechanism for unreliable partner services

## Database
- **SQLite**: Development database (easily replaceable with PostgreSQL for production)
- **SQLAlchemy**: ORM for database operations and migrations

## API Integration
- **HTTP Client**: Parallel API calls to multiple ride providers with 600ms timeout
- **OAuth**: Authentication system for full booking API integration with partners
- **Webhook Handlers**: Incoming notifications from partner services for booking status updates