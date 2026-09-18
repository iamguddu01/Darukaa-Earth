# Darukaa.Earth

A comprehensive web application for managing environmental projects and sites, featuring an interactive map interface and secure user authentication.

## High-Level Architecture

The application is built using a modern decoupled architecture, split between a backend API and a frontend single-page application (SPA).

### Backend (FastAPI)
- **Framework**: FastAPI (Python) for high-performance, asynchronous API endpoints.
- **ORM**: SQLAlchemy for database interactions, along with `geoalchemy2` for spatial data support (PostGIS).
- **Authentication**: JWT-based authentication for securing endpoints.
- **CORS**: Configured to allow cross-origin requests from the frontend during development.

### Frontend (React + Vite)
- **Framework**: React 19 built with Vite for fast HMR and optimized production builds.
- **Routing**: `react-router-dom` for client-side navigation.
- **Mapping**: Interactive mapping powered by Mapbox GL JS (`react-map-gl`) and `@mapbox/mapbox-gl-draw` for drawing geometries.
- **Styling**: Tailwind CSS for rapid, responsive UI development.
- **Data Visualization**: `chart.js` and `react-chartjs-2` for displaying analytics.

---

## Database Schema

The application uses a relational database (PostgreSQL + PostGIS recommended due to the use of `geoalchemy2`'s `Geometry` column) structured into three main tables:

### 1. `users`
Stores user credentials for authentication.
- `id` (Integer, Primary Key)
- `username` (String, Unique, Indexed)
- `password_hash` (String)

### 2. `projects`
Represents an umbrella project that can contain multiple geographical sites.
- `id` (Integer, Primary Key)
- `name` (String, Unique, Indexed)
- `description` (String)

### 3. `sites`
Represents specific geographical areas linked to a project.
- `id` (Integer, Primary Key)
- `name` (String, Indexed)
- `project_id` (Integer, Foreign Key linking to `projects.id`)
- `geometry` (Geometry: POLYGON, SRID: 4326) - Stores the spatial boundary of the site.

**Relationships:**
- A **Project** has a one-to-many relationship with **Sites**.

---

## Environment Setup & Running Locally

Follow these steps to get the application running on your local machine.

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- PostgreSQL with the PostGIS extension installed.

### 1. Database Setup
Ensure you have a PostgreSQL database running with the PostGIS extension enabled:
```sql
CREATE DATABASE darukaa_earth;
\c darukaa_earth;
CREATE EXTENSION postgis;
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   *(Assuming there is a requirements.txt, otherwise install FastAPI, SQLAlchemy, GeoAlchemy2, uvicorn, psycopg2-binary, etc.)*
   ```bash
   pip install fastapi uvicorn sqlalchemy geoalchemy2 python-dotenv asyncpg
   ```
4. Configure environment variables:
   Create a `.env` file in the `backend` directory and add your database URL:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/darukaa_earth
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   *The API will be available at `http://localhost:8000`.*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `frontend` directory. You will likely need a Mapbox Access Token:
   ```env
   VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`.*

---

## Verification
- Visit `http://localhost:8000/docs` to view the interactive API documentation (Swagger UI).
- Visit `http://localhost:5173` to view the frontend application.

---

## 🌍 Deployment Guide

To deploy Darukaa.Earth to production, you will need to host three components: the Database, the Backend API, and the Frontend SPA.

### 1. Database Deployment (PostgreSQL + PostGIS)
You need a PostgreSQL database provider that supports the PostGIS extension. 
*   **Recommended Providers**: [Supabase](https://supabase.com/), [Aiven](https://aiven.io/), or [Render](https://render.com/).
*   **Setup**: 
    1. Provision a PostgreSQL instance.
    2. Connect to the database and run `CREATE EXTENSION postgis;`.
    3. Copy the database connection URL (make sure it starts with `postgresql://`).

### 2. Backend Deployment (Render / Railway / Heroku)
The FastAPI backend can be deployed on any platform supporting Python containers or buildpacks. We recommend **Render** or **Railway**.

**Using Render (Example):**
1. Create a new "Web Service" and connect your GitHub repository.
2. Set the **Root Directory** to `backend`.
3. Set the **Environment** to `Python 3`.
4. Set the **Build Command** to: `pip install -r requirements.txt` *(Make sure you generate a requirements.txt file by running `pip freeze > requirements.txt` locally!)*.
5. Set the **Start Command** to: `uvicorn main:app --host 0.0.0.0 --port $PORT` (or use `gunicorn` for better production performance).
6. **Environment Variables**: Add your `DATABASE_URL` obtained from step 1.
7. Note down the deployed URL of the backend (e.g., `https://darukaa-api.onrender.com`).

### 3. Frontend Deployment (Vercel / Netlify)
The Vite/React frontend is highly optimized for static site hosting.

**Using Vercel (Example):**
1. Create a new project on [Vercel](https://vercel.com/) and import your repository.
2. Set the **Root Directory** to `frontend`.
3. Vercel should automatically detect the framework as **Vite**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**: Add the following:
   - `VITE_MAPBOX_TOKEN`: Your Mapbox access token.
   - `VITE_API_BASE_URL`: The deployed URL of your backend (e.g., `https://darukaa-api.onrender.com`).
5. Click **Deploy**.

Once all three are set up, your full-stack spatial application will be live!
