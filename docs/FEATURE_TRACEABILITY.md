# MediPulse BD Supporting 30-Feature Traceability Matrix

This matrix documents the 30 core functional capabilities implemented in **MediPulse BD**, modeled directly after the traceability standard in TrafficEase BD.

| ID | Functional Requirement | Primary User Interface | Backend / Model Evidence | External API / Mechanism |
|---:|---|---|---|---|
| **FR-01** | Live Air Quality & Smog Sync | Navbar ticker & Live Health Map | `/api/health-sync/live-telemetry` | OpenAQ & Open-Meteo REST API (PM2.5, AQI) |
| **FR-02** | Algorithmic Dengue Outbreak Index | Home Metric & Live Grid | Vector Risk Model | Open-Meteo Weather API (Humidity + Rainfall) |
| **FR-03** | Dynamic Hospital Route Navigation | Hospital Finder Sidebar | `/api/health-sync/ambulance-route` | OSRM & OpenStreetMap (Routing Engine) |
| **FR-04** | Automated 15-Minute Sync Daemon | System Background | `syncDaemon.js` | Node.js cron scheduler & In-Memory Cache |
| **FR-05** | Heatwave & Cardiac Risk Warning | Home Health Card | `/api/health-sync/live-telemetry` | Open-Meteo Temperature & Humidity |
| **FR-06** | Medical FX Currency Benchmark | Home Medical FX Card | `externalApiService.js` | ExchangeRate API (USD/BDT, INR/BDT) |
| **FR-07** | Emergency Blood Donor Search | Blood SOS Hub | `/api/blood/donors`; BloodDonor Model | District & Blood Group Filter |
| **FR-08** | Urgent Blood SOS Broadcast Trigger | Blood SOS Hub & Modal | `POST /api/blood/urgent-sos` | Live Broadcast Marquee & SMS Simulator |
| **FR-09** | Live Hospital Bed & ICU Tracker | Hospital Finder & Map | `GET /api/hospitals`; Hospital Model | ICU/General Bed Capacity Status |
| **FR-10** | DGDA Generic Medicine Matcher | Medicine Guide | `/api/medicines/search`; Medicine Model | DGDA Maximum Retail Price (MRP) Cap |
| **FR-11** | Public Hospital OPD Queue Estimator | Hospital Finder Sidebar | `Hospital.opdQueue` | Queue Delay Simulation Model |
| **FR-12** | National Emergency Speed-Dial Hub | Home & Citizen Services | `/api/operations/speed-dial` | Native tel: URI triggers (999, 16263, 333) |
| **FR-13** | 24/7 Emergency Pharmacy Directory | Citizen Services (Tab 2) | Static Directory & API | 24-Hour Verified Dispensaries |
| **FR-14** | Emergency Oxygen Cylinder Hub | Citizen Services (Tab 3) | Oxygen Rental Service | Emergency Oxygen & BiPAP Stock Tracker |
| **FR-15** | Mental Health Crisis Directory | Speed-Dial & Services | Speed-Dial Directory | Kaan Pete Roi & NIMH Hotline Access |
| **FR-16** | Child EPI Vaccination Auto-Scheduler | Citizen Services (Tab 1) | `/api/operations/vaccines` | WHO & Bangladesh EPI Schedule Engine |
| **FR-17** | Crowdsourced Counterfeit Drug Whistleblower | Medicine Guide | `POST /api/incidents`; IncidentReport | Citizen Photo/Batch Defect Submission |
| **FR-18** | Interactive Epidemic Hotspot Map | Live Health Grid | Leaflet GIS Layer | Dengue & Vector Cluster Radius Overlays |
| **FR-19** | Telemedicine OPD Booking Queue | Hospital Finder & Auth | Telemedicine Service | OPD Ticket & Doctor Consultation Queue |
| **FR-20** | Encrypted Patient Health Vault | Citizen Profile | AuthContext & LocalStorage | Emergency Records Caching |
| **FR-21** | Safe Blood Donation Eligibility Counter | Blood SOS Hub Sidebar | `POST /api/blood/check-eligibility` | 90-Day Hemoglobin Recovery Calculation |
| **FR-22** | Diagnostic Lab Test Price Comparator | Citizen Services (Tab 4) | Pricing Comparison Service | Public vs Private Hospital Lab Cost Matcher |
| **FR-23** | Hospital Bed Occupancy Updater | Authority Portal | `PUT /api/hospitals/:id/beds` | Protected Hospital Authority Workspace |
| **FR-24** | Ambulance Fair Fare per-km Calculator | Citizen Services (Tab 5) | Calculation Model | Official Fare Cap vs Private Extortion |
| **FR-25** | Mass-Casualty Disaster Surge Triage | Authority Portal | `PUT /api/hospitals/:id/surge-mode` | Disaster Triage Protocol Activator |
| **FR-26** | On-Duty Emergency Doctor Roster | Hospital Finder | `Hospital.doctorRoster` | Emergency Room Specialist Staffing View |
| **FR-27** | DGDA Recalled Medicine Circular Feed | Medicine Guide & Alerts | `/api/medicines/banned-recalled` | Counterfeit Batch Confiscation Notices |
| **FR-28** | Authority Incident Audit & Moderation Queue | Authority Portal | `PUT /api/incidents/:id/status` | Magistrate Action & Inspection Queue |
| **FR-29** | Dual-Language Bilingual Interface (EN/বাংলা) | Global Navbar Switcher | `LanguageContext.jsx` | Full UI & Medical Term Localization |
| **FR-30** | Immutable Operation Audit Trail | Authority Portal | `/api/operations/audit-logs` | OperationLog Administrative Verification |
