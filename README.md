# Apex Motors — Car Dealership (MERN)

Full-stack car dealership application with user authentication, searchable inventory, purchases, and admin inventory management.

## Installation

### Prerequisites

- Node.js 20+
- MongoDB running locally (or a MongoDB Atlas connection string)

### Clone and install

```bash
cd car-dealership/backend
npm install

cd ../frontend
npm install
```

### Environment files

Copy the examples and adjust as needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Run locally

Terminal 1 — API:

```bash
cd backend
npm run dev
```

Terminal 2 — UI:

```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  
- Health check: http://localhost:5000/api/health  

## Environment variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | API port |
| `NODE_ENV` | `development` | `development`, `test`, or `production` |
| `MONGODB_URI` | `mongodb://localhost:27017/car-dealership` | MongoDB connection string |
| `JWT_SECRET` | `dev-jwt-secret-change-me` | Required in production |
| `JWT_EXPIRES_IN` | `1d` | Token lifetime |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` (code fallback) | API base URL. Example: `http://localhost:5000/api` |

In Vite dev mode, `/api` is also proxied to `http://localhost:5000`.

## Folder structure

```text
car-dealership/
├── backend/
│   ├── src/
│   │   ├── config/           # Env + Mongo connection
│   │   ├── constants/        # Shared domain constants
│   │   ├── controllers/      # HTTP adapters
│   │   ├── interfaces/       # Ports / contracts
│   │   ├── middleware/       # Auth, authorization, errors
│   │   ├── models/           # Mongoose schemas
│   │   ├── repositories/     # Data access
│   │   ├── routes/           # Route wiring
│   │   ├── services/         # Business logic + factories
│   │   ├── tests/            # Jest tests + helpers
│   │   ├── utils/            # Errors, JWT, hashing
│   │   └── validators/       # Input validation
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/              # Axios client + resource APIs
    │   ├── components/       # Layout, UI, vehicle components
    │   ├── constants/        # Shared frontend constants
    │   ├── context/          # Auth provider
    │   ├── hooks/            # Reusable hooks
    │   ├── pages/            # Route pages (+ admin)
    │   ├── routes/           # Router + guards
    │   ├── types/            # Shared TypeScript types
    │   └── utils/            # Errors, JWT decode, validation
    ├── .env.example
    └── package.json
```

## API documentation

Base path: `/api`

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health |

### Auth

| Method | Path | Auth | Body | Success |
|---|---|---|---|---|
| `POST` | `/auth/register` | Public | `{ name, email, password }` | `201` user (no password) |
| `POST` | `/auth/login` | Public | `{ email, password }` | `200 { token }` |

JWT payload: `{ id, email, role }` where `role` is `user` or `admin`.

### Vehicles

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/vehicles` | Public | Optional `?page=&limit=` |
| `GET` | `/vehicles/search` | Public | `make`, `model`, `category`, `minPrice`, `maxPrice` |
| `POST` | `/vehicles` | Bearer | Create vehicle |
| `PUT` | `/vehicles/:id` | Bearer | Full update |
| `DELETE` | `/vehicles/:id` | Admin | `204` |
| `POST` | `/vehicles/:id/purchase` | Bearer | Decrements quantity by 1 |
| `POST` | `/vehicles/:id/restock` | Admin | Body `{ amount }` (positive integer) |

Vehicle body for create/update:

```json
{
  "make": "Toyota",
  "model": "Camry",
  "category": "sedan",
  "price": 25000,
  "quantity": 5
}
```

Categories: `sedan`, `suv`, `truck`, `coupe`, `convertible`, `hatchback`, `van`.

### Error shape

```json
{ "message": "Validation failed", "errors": [{ "field": "email", "message": "Email is required" }] }
```

Common statuses: `400` validation, `401` auth, `403` forbidden, `404` not found, `409` conflict / out of stock, `500` unexpected.

## Testing instructions

### Backend

```bash
cd backend
npm test
npm run test:coverage
npm run lint
npm run format:check
```

### Frontend

```bash
cd frontend
npm test
npm run build
```

## Deployment instructions

### Backend

1. Set production env vars (`NODE_ENV=production`, strong `JWT_SECRET`, real `MONGODB_URI`, `PORT`).
2. Build and start:

```bash
cd backend
npm ci
npm run build
npm start
```

3. Serve behind HTTPS and restrict CORS origins for production deployments.

### Frontend

1. Set `VITE_API_URL` to the public API URL (for example `https://api.example.com/api`).
2. Build static assets:

```bash
cd frontend
npm ci
npm run build
```

3. Deploy the `frontend/dist` folder to any static host (Nginx, Netlify, Vercel, S3+CloudFront, etc.).
4. Ensure the host forwards `/api` to the backend if you rely on a relative API base URL.

### Admin users

Registration always creates `role: user`. Seed an admin document in MongoDB (set `role` to `admin`) when you need admin UI access for delete/restock and the admin pages.
