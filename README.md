# 🏥 MEDIKIOSK — AI-Powered Smart Medicine Dispensing System

> An intelligent, end-to-end prescription processing and medicine dispensing kiosk platform built with React, FastAPI, Supabase, EasyOCR, and LLaMA AI models.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Detailed Project Structure](#-detailed-project-structure)
- [User Roles](#-user-roles)
- [Patient Workflow](#-patient-workflow)
- [Doctor Portal](#-doctor-portal)
- [Admin Panel](#-admin-panel)
- [AI & OCR Pipeline](#-ai--ocr-pipeline)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)

---

## 🌟 Overview

**MEDIKIOSK** is a full-stack kiosk application that allows patients to upload prescription images, have them analysed by AI, verify the medicines, and dispense them — all without requiring a pharmacist to be physically present.

Doctors can review and approve prescriptions remotely. Admins manage inventory, kiosk machines, and user accounts through a dedicated dashboard.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📸 Prescription Scanning | Upload a photo of any handwritten or printed prescription |
| 🤖 AI OCR Extraction | EasyOCR extracts text; Groq LLaMA 3.3 70B structures it |
| ✅ Doctor Approval | Doctors verify and approve prescriptions before dispensing |
| 💊 Smart Dispensing | Step-by-step medicine dispensing confirmation flow |
| 📊 Analytics Dashboard | Real-time stats for admins and doctors |
| 🔐 OTP Authentication | Patients log in via Twilio SMS OTP; doctors/admins via email+password |
| 🗂️ Full History | Every prescription and dispense is stored and traceable |
| 📄 PDF Receipts | Itemised receipt with medicine list generated and saved |
| 🏭 Machine Management | Admin tracks and manages all dispensing kiosk machines |
| 👥 User Management | Admin can view and manage patients, doctors, and admins |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Framer Motion** | Page transitions & animations |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Axios** | HTTP client for API calls |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | Python REST API framework |
| **Uvicorn** | ASGI server |
| **SQLAlchemy** | ORM for database models |
| **Pydantic v2** | Request/response validation |
| **python-jose** | JWT authentication |
| **passlib / bcrypt** | Password hashing |
| **EasyOCR** | Optical character recognition |
| **Groq (LLaMA 3.3 70B)** | AI text structuring from OCR output |
| **Twilio** | SMS OTP delivery for patient login |
| **Pillow / NumPy** | Image preprocessing |
| **httpx** | Async HTTP for external APIs |

### Database & Storage
| Technology | Purpose |
|---|---|
| **Supabase (PostgreSQL)** | Primary relational database |
| **Supabase Storage** | Prescription image & PDF receipt storage |

---

## 📁 Detailed Project Structure

Below is an exhaustive description of the entire project structure, demonstrating the separation of concerns between our frontend Single Page Application (SPA), server-side configurations, and backend RESTful API.

```text
Website/
├── README.md                   # Complete project documentation and structure details
│
├── frontend/                   # ⚛️ React SPA Frontend Application (Vite)
│   ├── .env                    # Frontend environment variables
│   ├── package.json            # NPM dependencies and project scripts
│   ├── tailwind.config.js      # Tailwind CSS configuration and theme tokens
│   ├── postcss.config.js       # PostCSS plugins setup (includes Tailwind)
│   ├── vite.config.js          # Vite build and dev server configuration
│   ├── index.html              # Main HTML entry point of the app
│   ├── public/                 # Static assets served at root
│   │   ├── admin-bg.jpg        # Background for the admin dashboard
│   │   ├── login-bg.png        # Transparent background for the auth screen
│   │   ├── medikiosk-logo.png  # MediKiosk platform logo
│   │   └── pharmacy-bg.png     # General thematic background image
│   │
│   └── src/                    # 📦 Frontend Source Code
│       ├── main.jsx            # React application bootstrapper & DOM renderer
│       ├── App.jsx             # Top-level application routing and Context Providers
│       ├── index.css           # Global custom CSS and Tailwind foundation
│       │
│       ├── components/         # Reusable and Modular React Components
│       │   ├── layout/         
│       │   │   └── DashboardLayout.jsx  # Core structured container (Sidebar + Topbar) for authorized users
│       │   ├── shared/         
│       │   │   ├── AnimatedPage.jsx     # Framer Motion wrapper for fluid page transitions
│       │   │   └── ProtectedRoute.jsx   # Role-based route guard and authentication barrier
│       │   └── ui/             
│       │       ├── Button.jsx           # Global customized click-action button component
│       │       ├── Card.jsx             # Reusable aesthetic container for information blocks
│       │       ├── Input.jsx            # Consistent form-field input component
│       │       ├── Modal.jsx            # Dynamic dialogs and overlays
│       │       ├── Skeleton.jsx         # Loading state placeholder component
│       │       └── StatusBadge.jsx      # Colored pill indicators for displaying dynamic statuses
│       │
│       ├── context/            
│       │   └── AuthContext.jsx # Evaluates and securely persists JWT state application-wide
│       │
│       ├── hooks/              
│       │   └── useAuth.js      # Encapsulated Auth logic (handle OTP generation, User Login, Register)
│       │
│       ├── services/           
│       │   └── api.js          # Global Axios Networking instance with request/response interceptors
│       │
│       └── pages/              # 🌐 View-level Page Components Segmented by Authorization Role
│           ├── public/         # Unauthenticated user access
│           │   ├── Landing.jsx # Immediate splash screen / welcome landing page
│           │   └── Login.jsx   # Dynamic Login portal holding OTP + Password capabilities
│           │
│           ├── patient/        # Patient Access Layer (Kiosk UI Workflow)
│           │   ├── Dashboard.jsx   # Patient overview view and kiosk entry points
│           │   ├── Upload.jsx      # Upload interface for prescriptions (drag/drop and camera capture)
│           │   ├── Processing.jsx  # Interactive loading state running OCR/AI extraction models
│           │   ├── Summary.jsx     # Structured verification screen showing extracted meds & dosage
│           │   ├── Dispensing.jsx  # Iterative confirmation screen guiding physical machine dispensing
│           │   ├── Success.jsx     # Dispensation confirmation and PDF receipt renderer
│           │   ├── History.jsx     # User specific historical prescription catalog
│           │   └── Profile.jsx     # Read/write user profile modification interface
│           │
│           ├── doctor/         # Doctor Evaluation Console
│           │   ├── Dashboard.jsx     # Aggregate statistical overview of assigned workflow
│           │   ├── Prescriptions.jsx # Data grid to review, authorize, edit, or reject prescriptions
│           │   └── PatientLogs.jsx   # Filterable table identifying patient demographic actions
│           │
│           └── admin/          # System Administration Command Centre
│               ├── Dashboard.jsx   # Top-level operational metrics (Totals / Financials)
│               ├── Inventory.jsx   # Full CRUD datagrid managing the pharmaceutical stock directory
│               ├── Machines.jsx    # Overview of interconnected dispensing systems and hardware statuses
│               └── Users.jsx       # Universal RBAC mutation engine supporting Patient/Doctor/Admin levels
│
└── backend/                    # 🐍 Python FastAPI Backend API Engine
    ├── .env                    # System-level database properties and 3rd party secrets
    ├── requirements.txt        # Tracked pip runtime dependencies for identical server creation
    ├── error_log.txt           # Captured errors bypassing primary stdout
    ├── server.log              # Persistent log outputs from general API actions
    ├── server_fresh.log        # Clean active session server trail
    ├── test_otp.py             # Sandboxed evaluation unit script for Twilio dispatch
    │
    └── app/                    # ⚙️ Primary Application Implementation
        ├── main.py             # FastAPI entry sequence, CORS enablement, routers aggregation
        ├── config.py           # Strictly typed environment configuration loaded with Pydantic
        ├── database.py         # SQLAlchemy PSQL connection pooling and engine binding setup
        │
        ├── models/             # Application Database Schemas mapped to SQLAlchemy ORM Data Tables
        │   ├── machine.py      # Models the state of remote physical dispensing units
        │   ├── medicine.py     # Models catalog inventory (Name, SKU, Price, Restrictions)
        │   ├── prescription.py # Tracks the lifecycle from scan to AI state to fulfilled dispensing
        │   └── user.py         # Global baseline profile model referencing access control rights
        │
        ├── schemas/            # API Response & Request Dictionaries managed by Pydantic Validation
        │   └── schemas.py      # Extremely strict typed validation mapping matching frontend expectations
        │
        ├── routers/            # Categorized Endpoint Interfaces representing the API Surface Area
        │   ├── auth.py         # Generates API credentials, registers users, executes SMS OTP triggers
        │   ├── patient.py      # Upload proxies targeting inference tasks and retrieval of physical records
        │   ├── doctor.py       # Actions empowering prescription alteration and authorization triggers
        │   └── admin.py        # Vast privileged management points mutating global database objects
        │
        └── services/           # Decoupled complex Business Interceptors driving external infrastructure
            ├── auth_service.py     # JWT token fabrication middleware and symmetric passlib verifications
            ├── groq_service.py     # Facilitates unstructured REST inferences towards LLaMA GenAI nodes
            ├── ocr_service.py      # Preprocesses imagery prior to performing EasyOCR structural scrapes
            └── storage_service.py  # Wrapper client executing authenticated payloads against remote Supabase Storage
```

---

## 👥 User Roles

### 🧑‍⚕️ Patient
- Logs in using **mobile number + SMS OTP** (via Twilio)
- Uploads prescription images
- Views AI-extracted medicine list
- Confirms and initiates dispensing
- Downloads PDF receipts
- Views full prescription history

### 👨‍⚕️ Doctor
- Logs in with **email + password**
- Reviews all pending prescriptions assigned to them
- Approves or rejects prescriptions with notes
- Views patient logs and analytics

### 🔑 Admin
- Logs in with **email + password**
- Full system access
- Manages medicine inventory (add / edit / delete / stock levels)
- Manages kiosk machines (status, location)
- Views & manages all users (patients, doctors, admins)
- System-wide analytics dashboard

---

## 🔄 Patient Workflow

```text
Landing Page (full-screen image, tap to continue)
        ↓
Login Page (Patient Login → Enter mobile → OTP verification)
        ↓
Patient Dashboard
        ↓
Upload Prescription (drag & drop or camera capture)
        ↓
AI Processing (EasyOCR → Groq LLaMA → Structured medicines)
        ↓
Prescription Summary (review medicines, dosage, frequency)
        ↓
Doctor Approval (prescription queued for doctor review)
        ↓
Dispensing Screen (step-by-step collection confirmation)
        ↓
Success Page (PDF receipt generated & downloadable)
```

---

## 🩺 Doctor Portal

| Page | Description |
|---|---|
| **Dashboard** | Stats — pending approvals, approved today, active patients |
| **Prescriptions** | Queue of prescriptions to review, approve, or reject |
| **Patient Logs** | Full list of patients with activity summary |

---

## 🔧 Admin Panel

| Page | Description |
|---|---|
| **Dashboard** | Total prescriptions, medicines dispensed, system health |
| **Inventory** | Medicine catalogue with stock, price, category management |
| **Machines** | Kiosk machine locations, status, last-seen tracking |
| **Users** | All users across roles — view, activate, deactivate |

---

## 🤖 AI & OCR Pipeline

```text
Prescription Image (JPEG/PNG)
        ↓
EasyOCR  →  Raw extracted text
        ↓
Groq API (LLaMA 3.3 70B)
   → Cleans and structures text into:
       • Medicine name
       • Dosage (mg, ml)
       • Frequency (1-0-1, TDS, etc.)
       • Duration (days)
       • Quantity
        ↓
Structured JSON  →  Stored in Supabase
        ↓
Displayed in Summary page for patient confirmation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Supabase** project (free tier works)
- **Groq API key** (free at [console.groq.com](https://console.groq.com))
- **Twilio** account with a verified phone number (for OTP)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/medikiosk.git
cd medikiosk
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=prescriptions

# JWT
SECRET_KEY=your_very_long_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Groq AI
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Doctor/Admin email + password login |
| `POST` | `/auth/register` | Register doctor or admin |
| `POST` | `/auth/send-otp` | Send OTP to patient's phone |
| `POST` | `/auth/verify-otp` | Verify patient OTP and return JWT |

### Patient
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/patient/upload-prescription` | Upload image, run OCR + AI |
| `GET` | `/patient/prescriptions` | Get patient's prescription history |
| `GET` | `/patient/prescriptions/{id}` | Get single prescription |
| `POST` | `/patient/prescriptions/{id}/dispense` | Mark as dispensed |

### Doctor
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/doctor/prescriptions` | List prescriptions for review |
| `POST` | `/doctor/prescriptions/{id}/approve` | Approve a prescription |
| `POST` | `/doctor/prescriptions/{id}/reject` | Reject with reason |
| `GET` | `/doctor/patients` | List patient activity |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/inventory` | List all medicines |
| `POST` | `/admin/inventory` | Add new medicine |
| `PUT` | `/admin/inventory/{id}` | Update medicine |
| `DELETE` | `/admin/inventory/{id}` | Remove medicine |
| `GET` | `/admin/machines` | List all kiosk machines |
| `GET` | `/admin/users` | List all users |
| `GET` | `/admin/analytics` | System analytics |

Full interactive docs: **`http://localhost:8000/docs`**

---

## 📝 Notes

- The system supports **handwritten and printed** prescriptions.
- OCR accuracy improves with clear, well-lit images.
- Patient OTP expires after **10 minutes**.
- All prescription images are stored securely in **Supabase Storage**.
- PDF receipts include itemised medicine prices and are saved to Supabase.

---

## 📄 License

This project is developed as part of an academic/research initiative. All rights reserved © 2026 MEDIKIOSK Team.

---

<p align="center">Built with ❤️ using React, FastAPI, and Groq AI</p>
