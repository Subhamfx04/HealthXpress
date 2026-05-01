# HealthCare+ Backend

Minimal, functional backend for HealthCare+ platform.

## Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: SQLite (no server needed)
- **Password Hashing**: bcrypt

## Setup

### Prerequisites
- Node.js (v14+)
- No database server needed!

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment** (optional, already has defaults):
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. **Initialize database** (creates `healthcare.db` + seed data):
```bash
npm run init-db
```

4. **Start server**:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user details

### Ambulance
- `POST /api/ambulance` - Request ambulance
- `GET /api/ambulance/:user_id` - Get user's requests
- `PUT /api/ambulance/:request_id` - Update request status

### Government Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get single scheme

### Diseases
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/:id` - Get single disease

### Medical Camps
- `GET /api/camps` - Get all camps
- `GET /api/camps/:id` - Get single camp

### Doctor Consultations
- `POST /api/consultations` - Record consultation choice
- `GET /api/consultations/:user_id` - Get user's consultations

## Request/Response Examples

### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "created_at": "2026-04-28T10:00:00.000Z"
  }
}
```

### Request Ambulance
```bash
POST /api/ambulance
Content-Type: application/json

{
  "user_id": 1,
  "location": "City Hospital Road, Downtown",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Get All Schemes
```bash
GET /api/schemes
```

Response:
```json
{
  "schemes": [
    {
      "id": 1,
      "title": "Ayushman Bharat",
      "description": "National health protection scheme",
      "eligibility": "Below poverty line families",
      "benefits": "Up to 5 lakh coverage per family per year",
      "created_at": "2026-04-28T10:00:00.000Z"
    }
  ]
}
```

## Database Schema

All tables are auto-created by `init-db.js`. See `schema.sql` for full schema.

**Tables**:
- `users` - User accounts
- `ambulance_requests` - Emergency ambulance requests
- `schemes` - Government healthcare schemes
- `diseases` - Disease information
- `camps` - Medical camps
- `consultations` - Doctor consultation records

## Folder Structure
```
backend/
├── server.js         # Main Express app
├── db.js            # PostgreSQL connection
├── init-db.js       # Database initialization
├── package.json     # Dependencies
├── .env.example     # Environment template
├── schema.sql       # Database schema
├── README.md        # This file
└── routes/
    ├── users.js
    ├── ambulance.js
    ├── schemes.js
    ├── diseases.js
    ├── camps.js
    └── consultations.js
```

## Notes
- No authentication middleware needed (simple project)
- Passwords are hashed with bcrypt (10 rounds)
- CORS enabled for all origins
- Basic error handling only
- No rate limiting or advanced validation
- Seed data included for schemes, diseases, camps
Database is stored in `healthcare.db` (SQLite file)
- 