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

All accounts share the password: **`tapcare@123`**

### 👤 Patients
| Name | Email | Blood Group |
|---|---|---|
| Rahul Sharma | `patient@tapcare.in` | O+ |
| Priya Mehta | `priya.patient@tapcare.in` | A+ |
| Arjun Nair | `arjun.patient@tapcare.in` | B+ |

### 👨‍⚕️ Doctors
| Name | Email | Specialty |
|---|---|---|
| Dr. Sarah Jenkins | `doctor@tapcare.in` | General Physician |
| Dr. William Davies | `cardiac.doctor@tapcare.in` | Cardiologist |
| Dr. James Wilson | `ortho.doctor@tapcare.in` | Orthopedic Surgeon |

### 🔧 Admin
| Email | Password |
|---|---|
| `admin@tapcare.in` | `tapcare@123` |

> **💡 Instant Zero-Setup Demo:**
> The database comes **pre-loaded with extensive, realistic clinical histories** across multiple patients (Cardiology, Endocrinology, Pulmonology, Orthopedics) with ABHA IDs, allergies, and prescriptions. Everything works out-of-the-box with zero delays and zero configuration!

---

## 🎯 3-Minute Winning Demo Pitch for Judges

| Step | Action | Key Talking Point for Judges |
|---|---|---|
| **1. The Problem** | Open landing page | *"Over 70% of Indian patients struggle with fragmented paper records and lost prescriptions across different hospitals."* |
| **2. Patient Vault** | Click **"Patient Demo"** → Tap card | *"Patient taps their encrypted NFC card to unlock their ABHA-linked EHR vault. Notice full multi-hospital medical history, medication dosages, and instant search."* |
| **3. Doctor Workspace** | Click **"Doctor Demo"** → Tap Rahul Sharma | *"Doctor taps the patient's card. Instant access with automatic clinical safety alert for documented Penicillin/Sulfa allergies, preventing fatal adverse drug reactions."* |
| **4. Live Consultation** | Add diagnosis & click **"Save & Push"** | *"Doctor records new prescription; it signs and updates directly to the patient's vault with end-to-end integrity."* |
| **5. Lost Card Security** | Open **Admin Portal** | *"If a patient loses their physical NFC card, admin can instantly deactivate the token or re-issue a new secure cryptographic link."* |

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
