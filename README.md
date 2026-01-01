# Virtual Kids Platform - Backend API

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users` - Get all users (protected)
- GET `/api/users/:id` - Get user by ID (protected)

### Tests
- POST `/api/tests` - Create test (protected)
- GET `/api/tests` - Get all tests (protected)
- GET `/api/tests/:id` - Get test by ID (protected)

### Results
- POST `/api/results` - Submit test result (protected)
- GET `/api/results` - Get all results (protected)
