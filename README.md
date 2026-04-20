# 🧬 CodeNucleus™ | Enterprise Medical Coding Agency OS

CodeNucleus is a high-precision, white-label medical coding platform designed for global agencies and vendors. It enables agency owners to provision isolated instances for their clients, automate PHI redaction using Google Cloud DLP, and extract ICD-10/CPT data using advanced LLMs (Llama 3 / Gemini).

---

## 🚀 Core Features

### 1. **Multi-Tenant Architecture (White-Labeling)**
*   **Subdomain Isolation:** Each agency can operate on its own subdomain (e.g., `apollo.codenucleus.com`).
*   **Custom Branding:** Admins can upload logos, set brand colors, and choose typography that propagates across the entire workspace.

### 2. **Clinical Data Security**
*   **Zero-Trust Ingestion:** Clinical notes are streamed to secure buckets and instantly processed via **Google Cloud DLP (Data Loss Prevention)**.
*   **PHI Scrubbing:** Automated redaction of names, SSNs, and locations before any AI processing occurs.
*   **Immutable Audit Logs:** Every action (login, scrub, export) is cryptographically timestamped for HIPAA compliance.

### 3. **Intelligence Engine**
*   **Neural Extraction:** Leverages Groq Llama 3 and Gemini for millisecond-latency ICD-10 and CPT code extraction.
*   **Denial Intelligence:** Custom payer rules embed specific coding logic to prevent insurance denials at the point of entry.

### 4. **Role-Based Access Control (RBAC)**
*   **SuperAdmin:** Global platform oversight, agency provisioning, and instance management.
*   **Admin (Agency Owner):** Staff management (Coders), branding, payer rule configuration, and QA review.
*   **Coder:** Workspace access for de-identified medical claim review and verification.

---

## 📂 Project Structure

```text
codenucleus/
├── backend/                # Node.js + Express API
│   ├── config/             # Cloud Storage (S3/GCS) & DB Config
│   ├── controllers/        # Business Logic (Auth, User, Org, Encounters)
│   ├── middleware/         # Auth, Role, & Audit Interceptors
│   ├── models/             # Mongoose Schemas (User, Org, PayerRule, AuditLog)
│   ├── routes/             # RESTful Endpoints
│   └── utils/              # AI Services, DLP Scrubber, FHIR Mapper
└── frontend/               # React + Vite + Tailwind CSS
    ├── src/
    │   ├── components/     # Reusable UI (Layouts, Modals, Home, Dashboard)
    │   ├── pages/          # Full-page Views (Admin, Coder, SuperAdmin)
    │   ├── services/       # API Integration Layer (Axios)
    │   ├── store/          # Global State (Zustand)
    │   └── helpers/        # Utility Functions
```

---

## 🛠️ Setup & Installation

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:5173
# Cloud Credentials
GCS_PROJECT_ID=...
GCS_KEY_FILE_PATH=...
GROQ_API_KEY=...
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Sample Credentials (IDs)

Use these credentials to test the different access levels of the platform.

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **SuperAdmin** | `main@codenucleus.com` | `SuperAdmin123!` | Global Provisioning |
| **Admin** | `sidlabs@gmail.com` | `sidlabs@gmail.com` | Agency Management |
| **Coder** | `sachin@sidlabs.com` | `sachin@sidlabs.com` | Workspace Access |

---

## 🛡️ Compliance & Standards
*   **HIPAA Compliant:** Automated PII/PHI redaction pipeline.
*   **Interoperability:** Data exports follow **FHIR R4 JSON** standards.
*   **Encryption:** AES-256 for data at rest and TLS 1.3 for data in transit.

---
© 2026 CodeNucleus Infrastructure. Proprietary extraction engine v4.0.
