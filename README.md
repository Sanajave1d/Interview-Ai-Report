# AI Interview Prep

An AI-powered tool that turns a job description, your resume, and a short self-description into a
tailored interview briefing — technical questions, behavioral questions, a preparation roadmap,
a job-match score, and a downloadable, ATS-friendly resume rewritten for the role.

## How it works

1. Paste a job description, upload your resume (PDF), and add a short self-description.
2. The backend sends this to Gemini to generate a structured interview report: technical
   questions, behavioral questions, a day-by-day prep roadmap, a match score, and skill gaps.
3. You can revisit any generated report by its ID, and generate a tailored resume PDF
   (rendered from AI-generated HTML via Puppeteer) at any time.

## Tech stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Axios
- lucide-react (icons)
- React Context for global interview/report state

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- JWT auth (short-lived access token + long-lived refresh token, refresh token stored in an
  `httpOnly` cookie, blacklisted on logout)
- bcrypt for password hashing
- Google Gemini API for report and resume generation
- Puppeteer for HTML → PDF resume rendering
- Zod for schema validation

## Project structure

```
.
├── frontend/     # React + Vite client
└── backend/      # Express API server
```

Each folder is deployed independently (frontend on Vercel, backend on Render) — see
[Deployment](#deployment) below.

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Google Gemini API key

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

Run the server:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
```

Run the dev server:
```bash
npm run dev
```

The app should now be running locally, with the frontend calling the backend at `VITE_API_URL`.

## API overview

| Method | Endpoint                              | Description                          |
|--------|----------------------------------------|---------------------------------------|
| POST   | `/api/auth/register`                  | Register a new user                   |
| POST   | `/api/auth/login`                     | Log in                                |
| POST   | `/api/auth/refresh`                   | Rotate access/refresh tokens          |
| POST   | `/api/auth/logout`                    | Log out (blacklists refresh token)    |
| POST   | `/api/interview`                      | Generate a new interview report       |
| GET    | `/api/interview`                      | List all reports for the user         |
| GET    | `/api/interview/:id`                  | Get a single report by ID             |
| POST   | `/api/interview/report/pdf/:id`       | Generate a tailored resume PDF        |

> Adjust this table to match your actual routes — filled in based on what's been built so far
> in this project.

## Deployment

This project deploys as two separate services from a single repo:

- **Frontend → Vercel**, with **Root Directory** set to `frontend`
- **Backend → Render** (not Vercel — Puppeteer and long-lived Express/MongoDB connections don't
  fit Vercel's serverless model well), with **Root Directory** set to `backend`

After deploying:
1. Set `VITE_API_URL` in Vercel to your live Render backend URL, and redeploy the frontend.
2. On the backend, set CORS to allow your exact Vercel frontend origin with `credentials: true`.
3. Set the refresh-token cookie's `sameSite` to `"none"` and `secure` to `true` in production,
   since frontend and backend live on different domains.

## Environment variables reference

| Variable                | Where     | Description                                  |
|--------------------------|-----------|-----------------------------------------------|
| `MONGO_URI`              | backend   | MongoDB connection string                     |
| `JWT_SECRET`              | backend   | Secret used to sign access/refresh tokens     |
| `ACCESS_TOKEN_EXPIRY`     | backend   | e.g. `15m`                                    |
| `REFRESH_TOKEN_EXPIRY`    | backend   | e.g. `7d`                                     |
| `GEMINI_API_KEY`          | backend   | Google Gemini API key                         |
| `NODE_ENV`                | backend   | `development` or `production`                 |
| `VITE_API_URL`            | frontend  | Base URL of the backend API                   |

## License

Add a license here if you plan to open-source this (MIT is the common default).