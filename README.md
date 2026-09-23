# MediPulse BD (স্বাস্থ্যপালস) — Emergency Healthcare & Epidemic Surveillance Network

MediPulse BD is an intelligent, real-time emergency healthcare, epidemic surveillance, and hospital operations network built specifically for the population of Bangladesh.

Inspired by the multi-role, 30+ capability architecture of **TrafficEase BD**, MediPulse BD integrates **automated external APIs** (OpenAQ, Open-Meteo, OSRM) with live ICU bed capacity tracking, instant emergency blood SOS broadcasts, DGDA generic medicine price intelligence, and hospital disaster surge triage.

---

## 🌟 Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Leaflet GIS (`react-leaflet`), Lucide Icons, Axios, React Router v6.
- **Backend:** Node.js, Express.js, JWT Authentication, Bcrypt.js, Mongoose, Axios.
- **External Real-Time APIs:**
  - **Open-Meteo Weather API:** Real-time temperature, humidity, rainfall, and algorithmic Dengue vector risk modeling.
  - **OpenAQ & Open-Meteo Air Quality:** Automated hourly PM2.5, PM10, and US AQI feeds with respiratory advisories for Dhaka, Gazipur, and Chittagong.
  - **OSRM (Open Source Routing Machine):** Dynamic hospital routing, ambulance arrival duration, and distance calculation.
  - **ExchangeRate API:** Real-time USD/BDT and INR/BDT exchange rates for imported medicines and treatment benchmarks.
- **Background Synchronization:** `node-cron` automated 15-minute background sync daemon with in-memory caching and persistent DB fallback.
- **Database:** MongoDB (with resilient automatic in-memory fallback for instant zero-config startup).

---

## 🚀 Quick Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm start
# Server starts on http://localhost:5000
# Live Telemetry: http://localhost:5000/api/health-sync/live-telemetry
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Vite dev server starts on http://localhost:5173
```

---

## 🔐 One-Click Demo Access Accounts
The login modal includes 4 instant one-click demo profiles:
- **Citizen Demo:** `citizen@medipulse.bd` (Public healthcare, blood search, generic savings)
- **Donor Hero Demo:** `donor@medipulse.bd` (Emergency blood donor with LifeSaver badge)
- **Hospital Authority Demo:** `hospital@medipulse.bd` (DMCH Staff — bed updater, surge triage)
- **DGHS Admin Demo:** `admin@medipulse.bd` (Directorate General — report moderation, bulletin broadcast)

Password for all local demo accounts: `password123`

---

## 📋 30-Feature Traceability
See [docs/FEATURE_TRACEABILITY.md](docs/FEATURE_TRACEABILITY.md) for the complete 30-feature matrix across citizen tools, real-time external telemetry, and administrative operations.
