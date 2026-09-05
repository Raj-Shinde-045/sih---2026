import { NextResponse } from 'next/server';

const PROJECT_ID = 'tapcare-cards';
const API_KEY = 'AIzaSyCGRtkEl3b0HrO_p-P2zE8aeEv5U1z4HBw';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const AUTH_BASE = `https://identitytoolkit.googleapis.com/v1`;

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { email: 'patient@tapcare.in',        password: 'tapcare@123', name: 'Rahul Sharma',     role: 'patient',  patientId: 'tc-patient-001', age: 28, bloodGroup: 'O+', phone: '+91-9876543210', city: 'Mumbai' },
  { email: 'priya.patient@tapcare.in',  password: 'tapcare@123', name: 'Priya Mehta',      role: 'patient',  patientId: 'tc-patient-002', age: 34, bloodGroup: 'A+', phone: '+91-9123456789', city: 'Pune' },
  { email: 'arjun.patient@tapcare.in',  password: 'tapcare@123', name: 'Arjun Nair',       role: 'patient',  patientId: 'tc-patient-003', age: 52, bloodGroup: 'B+', phone: '+91-9988776655', city: 'Bangalore' },
  { email: 'doctor@tapcare.in',         password: 'tapcare@123', name: 'Dr. Sarah Jenkins', role: 'doctor',  specialty: 'General Physician',  hospital: 'City Hospital',        licenseNo: 'MCI-DL-2198' },
  { email: 'cardiac.doctor@tapcare.in', password: 'tapcare@123', name: 'Dr. William Davies',role: 'doctor',  specialty: 'Cardiologist',        hospital: 'CardioCare Institute', licenseNo: 'MCI-DL-3342' },
  { email: 'ortho.doctor@tapcare.in',   password: 'tapcare@123', name: 'Dr. James Wilson',  role: 'doctor',  specialty: 'Orthopedic Surgeon',  hospital: 'Peak Orthopedics',     licenseNo: 'MCI-DL-5511' },
  { email: 'admin@tapcare.in',          password: 'tapcare@123', name: 'Admin TapCare',     role: 'admin' },
];

// ─── CONSULTATIONS ────────────────────────────────────────────────────────────
const ALL_RECORDS = [
  { doctorName: 'Dr. Sarah Jenkins',  hospitalName: 'City Hospital',         symptoms: 'High fever (103°F), body ache, chills, loss of appetite for 3 days.', diagnosis: 'Dengue Fever (NS1+)', medicines: 'Paracetamol 500mg every 6hrs, ORS sachets, Platelet monitoring every 12hrs. No NSAIDs.', daysAgo: 8 },
  { doctorName: 'Dr. Emily Chen',     hospitalName: 'Metro General Hospital', symptoms: 'Severe lower back pain radiating to right leg, worse in mornings, tingling sensation.', diagnosis: 'Lumbar Disc Herniation (L4-L5)', medicines: 'Ibuprofen 400mg 1-1-1, Pantoprazole 40mg, Methocarbamol 500mg at night. MRI scheduled.', daysAgo: 35 },
  { doctorName: 'Dr. Marcus Thorne',  hospitalName: 'Oakridge Dental Clinic', symptoms: 'Sharp pain in lower right molar for 5 days, sensitivity to cold and sweets.', diagnosis: 'Irreversible Pulpitis (Root Canal Needed)', medicines: 'Amoxicillin 500mg TDS for 5 days, Ibuprofen 400mg for pain. Root canal scheduled.', daysAgo: 62 },
  { doctorName: 'Dr. Robert Singh',   hospitalName: 'TapCare General',        symptoms: 'Annual health checkup. Mild fatigue, no acute complaints.', diagnosis: 'Vitamin D Deficiency (Level: 14 ng/mL)', medicines: 'Vitamin D3 60,000 IU weekly for 8 weeks, Calcium 500mg daily. Repeat test in 3 months.', daysAgo: 90 },
  { doctorName: 'Dr. William Davies', hospitalName: 'CardioCare Institute',    symptoms: 'Occasional chest tightness after meals, acid regurgitation, worsens on lying down.', diagnosis: 'GERD (Gastroesophageal Reflux Disease)', medicines: 'Omeprazole 20mg before breakfast daily. Avoid spicy food, elevate head while sleeping.', daysAgo: 130 },
  { doctorName: 'Dr. Amanda Torres',  hospitalName: 'Valley Eye Center',       symptoms: 'Progressive blurry vision while reading, frequent headaches in the evening.', diagnosis: 'Myopia OD: -1.5 OS: -1.75', medicines: 'Prescription glasses. Eye drops for dryness. 20-20-20 rule for screen use.', daysAgo: 185 },
  { doctorName: 'Dr. James Wilson',   hospitalName: 'Peak Orthopedics',        symptoms: 'Left ankle swelling and pain after sports injury, unable to put full weight.', diagnosis: 'Grade II Lateral Ankle Sprain', medicines: 'RICE protocol. Diclofenac gel topically. Ankle brace for 3 weeks. Physiotherapy 3x/week.', daysAgo: 240 },
  { doctorName: 'Dr. Linda Gupta',    hospitalName: 'Sunrise Dermatology',     symptoms: 'Itchy red rash on both forearms and neck, appeared after switching soap brand.', diagnosis: 'Allergic Contact Dermatitis', medicines: 'Hydrocortisone 1% cream BD for 5 days, Cetirizine 10mg at night for 7 days.', daysAgo: 310 },
  { doctorName: 'Dr. Priya Rajan',    hospitalName: 'Apollo Diagnostics',      symptoms: 'Fatigue, pale skin, frequent dizziness on standing up, cold hands and feet.', diagnosis: 'Iron Deficiency Anemia (Hb: 9.2 g/dL)', medicines: 'Ferrous Sulfate 200mg BD with Vitamin C. Avoid tea/coffee with meals. Repeat CBC in 6 weeks.', daysAgo: 390 },
  { doctorName: 'Dr. Sarah Jenkins',  hospitalName: 'City Hospital',           symptoms: 'Persistent dry cough for 2 weeks, mild fever, fatigue, mild breathlessness.', diagnosis: 'COVID-19 (Mild) — RAT Positive', medicines: 'Paracetamol 500mg SOS. Montelukast 10mg at night. Steam inhalation BD. Home isolation for 10 days.', daysAgo: 450 },
  { doctorName: 'Dr. Anita Kapoor',   hospitalName: 'Rainbow ENT Clinic',      symptoms: 'Blocked nose, sore throat, loss of smell for 5 days, mild ear pain.', diagnosis: 'Acute Sinusitis with Allergic Rhinitis', medicines: 'Amoxiclav 625mg BD for 7 days, Montelukast+Levocetirizine at night, Nasal saline spray BD.', daysAgo: 510 },
  { doctorName: 'Dr. Robert Singh',   hospitalName: 'TapCare General',         symptoms: 'Burning sensation while urinating, increased frequency, mild fever (low-grade).', diagnosis: 'Urinary Tract Infection (UTI)', medicines: 'Nitrofurantoin 100mg BD for 7 days. Increase water intake (>3L/day). Avoid carbonated drinks.', daysAgo: 580 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function toFirestoreValue(val: any): any {
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') return { integerValue: String(val) };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (val && typeof val === 'object') {
    return { mapValue: { fields: Object.fromEntries(Object.entries(val).map(([k, v]) => [k, toFirestoreValue(v)])) } };
  }
  return { nullValue: null };
}

function toFirestoreFields(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toFirestoreValue(v)]));
}

async function firestoreSet(collection: string, docId: string, data: Record<string, any>) {
  const url = `${FIRESTORE_BASE}/${collection}/${docId}?key=${API_KEY}`;
  const body = { fields: toFirestoreFields(data) };
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Firestore PATCH failed: ${await res.text()}`);
}

async function firestoreAdd(collection: string, data: Record<string, any>) {
  const url = `${FIRESTORE_BASE}/${collection}?key=${API_KEY}`;
  const body = { fields: toFirestoreFields(data) };
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Firestore POST failed: ${await res.text()}`);
}

async function createAuthUser(email: string, password: string, displayName: string): Promise<string> {
  // Try to sign in first (user might already exist)
  const signInRes = await fetch(`${AUTH_BASE}/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (signInRes.ok) {
    const data = await signInRes.json();
    return data.localId;
  }
  // Create new user
  const signUpRes = await fetch(`${AUTH_BASE}/accounts:signUp?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName, returnSecureToken: true }),
  });
  if (!signUpRes.ok) throw new Error(`Auth create failed for ${email}: ${await signUpRes.text()}`);
  const data = await signUpRes.json();
  return data.localId;
}

// ─── HANDLER ──────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('secret') !== 'tapcare-seed-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const results: string[] = [];
  let consultationCount = 0;

  // 1. Create Auth users & write Firestore profiles
  for (const user of DEMO_USERS) {
    try {
      const uid = await createAuthUser(user.email, user.password, user.name);
      const profile: Record<string, any> = { email: user.email, name: user.name, role: user.role, createdAt: new Date().toISOString() };
      if ('patientId' in user) { profile.patientId = user.patientId; profile.age = user.age; profile.bloodGroup = user.bloodGroup; profile.phone = user.phone; profile.city = user.city; }
      if ('specialty' in user) { profile.specialty = user.specialty; profile.hospital = user.hospital; profile.licenseNo = user.licenseNo; }
      await firestoreSet('users', uid, profile);
      if ('patientId' in user && user.patientId) {
        await firestoreSet('patients', user.patientId, { uid, ...profile, allergies: 'Penicillin, Dust Mites', emergencyContact: '+91-9000000000' });
      }
      results.push(`✅ ${user.role}: ${user.email}`);
    } catch (e: any) {
      results.push(`⚠️ Skipped ${user.email}: ${e.message}`);
    }
  }

  // 2. Seed consultations for each patient
  const patientIds = ['tc-patient-001', 'tc-patient-002', 'tc-patient-003'];
  for (const patientId of patientIds) {
    const records = patientId === 'tc-patient-001' ? ALL_RECORDS
      : patientId === 'tc-patient-002' ? ALL_RECORDS.filter((_, i) => i % 2 === 0)
      : ALL_RECORDS.filter((_, i) => i % 3 !== 1);

    for (const record of records) {
      const date = new Date();
      date.setDate(date.getDate() - record.daysAgo);
      const { daysAgo, ...rest } = record;
      await firestoreAdd('consultations', { ...rest, patientId, timestamp: date });
      consultationCount++;
    }
    results.push(`✅ Seeded ${records.length} consultations for ${patientId}`);
  }

  return NextResponse.json({
    success: true,
    summary: `Created/updated ${DEMO_USERS.length} users and seeded ${consultationCount} consultation records.`,
    details: results,
  });
}
