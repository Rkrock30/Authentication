# User Authentication API

## Description
This is a Node.js REST API for user registration and login with PostgreSQL, JWT-based authentication, and rate limiting.

## Tech Stack
- Node.js (Express)
- PostgreSQL
- Sequelize
- Docker

## Setup Instructions

1. Clone the repository
2. Copy `.env.example` to `.env` and adjust if needed
3. Run with Docker:
   ```bash
   docker-compose up --build
   ```

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`  (Rrtrieves JWT token)
- `GET /api/auth/profile` (Requires JWT in `token` header)

## Notes
- Rate limit: Max 5 login attempts per 15 minutes per IP
- Passwords are securely hashed with bcrypt
- JWT secret is configured from `.env`