# 🏥 TapCare NFC — Secure Medical Records Ecosystem

> A Smart India Hackathon 2026 project. TapCare enables doctors and patients to securely access, manage, and share medical records using NFC card technology.

**🔴 Live Demo:** [https://tapcare-navy.vercel.app](https://tapcare-navy.vercel.app)

---

## ✨ Features

- 🔐 **Role-Based Auth** — Separate portals for Patients, Doctors & Admins
- 🏥 **NFC Card Integration** — Patients tap a physical/simulated NFC card to unlock their vault
- 📋 **Real-Time Medical Records** — Doctors write consultations that sync instantly to the patient's vault
- 🔍 **Search & Filter** — Patients can search and filter their full medical history
- 👨‍⚕️ **Doctor Workspace** — Structured form to record symptoms, diagnosis & prescriptions
- 🛡️ **Security Audit Log** — Every vault access is logged
- 🤖 **AI OCR** *(Coming Soon)* — Scan physical prescriptions with Gemini Vision

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn UI + Lucide React |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Hosting | Vercel |
| AI *(planned)* | Google Gemini API |

---

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Raj-Shinde-045/sih---2026.git
cd sih---2026
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project with the following contents:

```env
# Firebase Config (tapcare-cards project)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCGRtkEl3b0HrO_p-P2zE8aeEv5U1z4HBw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tapcare-cards.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tapcare-cards
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tapcare-cards.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=610386417445
NEXT_PUBLIC_FIREBASE_APP_ID=1:610386417445:web:b4585f6ec5e7b8da676ccc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-D5BVH5VQK1

# Gemini API (for AI OCR feature - coming soon)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

Use these credentials to explore all three portals, or use the **1-Click Demo Login** buttons on the login screen for instant access.

### 👤 Patient
| Field | Value |
|---|---|
| Email | `patient@tapcare.in` |
| Password | `tapcare@123` |

### 👨‍⚕️ Doctor
| Field | Value |
|---|---|
| Email | `doctor@tapcare.in` |
| Password | `tapcare@123` |

### 🔧 Admin
| Field | Value |
|---|---|
| Email | `admin@tapcare.in` |
| Password | `tapcare@123` |

> **💡 Tip:** After logging in as a Patient, click the NFC scan card to simulate a card tap. If your vault is empty, click **"Inject Demo History"** to populate it with 8 realistic historical records!

---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Login page
│   ├── admin/dashboard/page.tsx        # Admin portal
│   ├── doctor/
│   │   ├── dashboard/page.tsx          # Doctor portal
│   │   └── workspace/[patientId]/      # Patient workspace (after NFC tap)
│   ├── patient/dashboard/page.tsx      # Patient vault
│   ├── scan/page.tsx                   # NFC scan entry point
│   └── api/
│       ├── auth/login/route.ts         # Login API
│       └── admin/create-doctor/        # Secure doctor creation
├── components/
│   ├── layout/Navbar.tsx
│   └── ui/                             # Shadcn components
└── lib/
    ├── firebase.ts                     # Firebase client config
    └── firebase-admin.ts               # Firebase Admin SDK
```

---

## 📍 Roadmap

- [x] Phase 1 — Real Firestore medical records
- [ ] Phase 2 — OTP/PIN security gate on NFC scan
- [ ] Phase 3 — Gemini AI OCR for scanned prescriptions
- [ ] Phase 4 — Physical NFC card provisioning

---

## 👥 Team

Built with ❤️ for **Smart India Hackathon 2026**

---

*⚠️ Note: Credentials above are for demo purposes only. Do not use real patient data in this prototype.*
