# UPJar - Micro-Investment Round-Up Platform

UPJar is a modern micro-investment platform that automatically rounds up daily transaction amounts and invests the spare change into user portfolios.

The stack consists of:
- **Backend**: FastAPI (Python 3.12) + SQLAlchemy + Supabase (Auth & PostgreSQL).
- **Frontend**: Lightweight HTML, CSS, JavaScript web application.
- **Web Server**: Nginx (serving static frontend files).
- **Containerization**: Docker & Docker Compose.

---

## 🚀 Quick Start (One Command with Docker)

Spins up both the **FastAPI Backend** (port `8000`) and **Nginx Frontend** (port `3000`) using Docker Compose.

### 1. Create `.env` File
Create a `.env` file in the project root with your Supabase credentials:

```env
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-supabase-project.supabase.co:5432/postgres
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 2. Run Docker Compose
From the project root directory, run:

```bash
docker compose up --build -d
```

### 3. Access the Application
- 🌐 **Frontend App**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend API**: [http://localhost:8000](http://localhost:8000)
- 📚 **Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

To view container logs or stop the application:
```bash
# View live logs
docker compose logs -f

# Stop containers
docker compose down
```

---

## 🛠️ Local Setup (Without Docker)

### 1. Backend Setup (FastAPI)
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Uvicorn development server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
Open `frontend/index.html` in your browser, or serve it using Python's simple HTTP server:

```bash
cd frontend
python3 -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/signup` | Create user in Supabase Auth & DB | No |
| `POST` | `/login` | Authenticate user & return JWT Token | No |
| `POST` | `/transactions/ingest` | Process payment & compute round-up | Yes (`Bearer Token`) |
| `GET` | `/transactions/` | Retrieve user transactions history | Yes (`Bearer Token`) |
| `GET` | `/users/{user_id}/investments` | Get user investment preferences | No |
| `POST` | `/users/{user_id}/investments` | Save user investment preferences | No |

---

## 📂 Project Structure

```
UPJar/
├── app/
│   ├── main.py               # FastAPI entry point & CORS configuration
│   ├── database.py           # SQLAlchemy database session manager
│   ├── models.py             # Database models (User, Transaction, InvestmentSettings)
│   ├── oauth2.py             # JWT token creation & authentication dependency
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── supabase_client.py    # Supabase SDK client initialization
│   └── routers/              # API Route handlers (auth, user, roundup)
├── frontend/
│   ├── Dockerfile            # Nginx container for static frontend
│   ├── Dashboard.html        # Main dashboard UI
│   ├── index.html            # Landing page
│   ├── login.html            # User login page
│   ├── register.html         # Account signup page
│   ├── connect.html          # Bank/UPI connection mockup page
│   ├── script.js             # Direct API integration script
│   └── style.css             # Application styling
├── .dockerignore             # Excluded build files for Docker
├── .env                      # Environment variables (Supabase URL, Keys)
├── Dockerfile                # FastAPI backend Docker image
├── docker-compose.yml        # Docker Compose service orchestrator
├── README.md                 # Project documentation & setup instructions
└── requirements.txt          # Python dependencies
```
