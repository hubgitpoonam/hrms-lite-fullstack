# HRMS Lite — Human Resource Management System

A lightweight, full-stack HR management system built for managing employee records and daily attendance tracking. Clean UI, REST API backend, and production deployment on Vercel + Render.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://hrms-lite-fullstack-nu.vercel.app |
| Backend API | https://hrms-lite-fullstack-tr8k.onrender.com/api |

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM v7
- Axios

**Backend**
- Django 6 + Django REST Framework
- PostgreSQL
- python-decouple · gunicorn · whitenoise · django-cors-headers

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → Render PostgreSQL (free tier)

---

## Features

### Employee Management
- Add employee with ID, full name, email, department
- View all employees in a table
- Delete employee (cascades attendance records)
- Duplicate employee ID and email validation

### Attendance Management
- Mark attendance as Present / Absent per employee per date
- View attendance records with filters by employee and date
- One record per employee per day enforced at DB level
- Attendance summary per employee (total / present / absent)

### UI/UX
- Dashboard with stats overview
- Loading, empty, and error states
- Reusable Modal, Table, and Form components
- Responsive sidebar navigation

---

## API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/` | List all employees |
| POST | `/api/employees/` | Create employee |
| GET | `/api/employees/:id/` | Get employee |
| PATCH | `/api/employees/:id/` | Update employee |
| DELETE | `/api/employees/:id/` | Delete employee |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/` | List records (filter: `?employee=&date=`) |
| POST | `/api/attendance/` | Mark attendance |
| PUT | `/api/attendance/:id/` | Update record |
| DELETE | `/api/attendance/:id/` | Delete record |
| GET | `/api/attendance/summary/:employee_id/` | Get summary stats |

---

## Run Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=hrms_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

```bash
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```

Open http://localhost:5173

---

## Project Structure

```
hrms-lite-fullstack/
├── backend/
│   ├── hrms/               # Django project settings & URLs
│   ├── employees/          # Employee model, views, serializers
│   ├── attendance/         # Attendance model, views, serializers
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance & API functions
│   │   ├── components/     # Reusable UI components
│   │   └── pages/          # Dashboard, Employees, Attendance
│   └── package.json
├── vercel.json             # Vercel frontend config
├── render.yaml             # Render backend + DB config
└── README.md
```

---

## Deployment

### Backend (Render)
1. Push repo to GitHub
2. Render → New → Blueprint → connect repo (auto-detects `render.yaml`)
3. Set environment variables in Render dashboard
4. Deploy

### Frontend (Vercel)
1. Vercel → Import Git Repository
2. Add environment variable: `VITE_API_URL=https://<your-render-url>/api`
3. Deploy

---

## Assumptions & Limitations

- Single admin user — no authentication required
- Free tier Render services spin down after inactivity (cold start ~30s)
- Leave management, payroll, and roles are out of scope
- No data export functionality
