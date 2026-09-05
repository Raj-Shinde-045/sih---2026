'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';

const RECORDS = [
  { doctorName: 'Dr. Sarah Jenkins',  hospitalName: 'City Hospital',          diagnosis: 'Dengue Fever (NS1+)',                  medicines: 'Paracetamol 500mg every 6hrs, ORS sachets. No NSAIDs.',               daysAgo: 8   },
  { doctorName: 'Dr. Emily Chen',     hospitalName: 'Metro General Hospital',  diagnosis: 'Lumbar Disc Herniation (L4-L5)',        medicines: 'Ibuprofen 400mg 1-1-1, Methocarbamol 500mg at night. MRI done.',    daysAgo: 35  },
  { doctorName: 'Dr. Marcus Thorne',  hospitalName: 'Oakridge Dental Clinic',  diagnosis: 'Irreversible Pulpitis',                medicines: 'Amoxicillin 500mg TDS for 5 days. Root canal scheduled.',            daysAgo: 62  },
  { doctorName: 'Dr. Robert Singh',   hospitalName: 'TapCare General',         diagnosis: 'Vitamin D Deficiency (14 ng/mL)',       medicines: 'Vitamin D3 60,000 IU weekly. Calcium 500mg daily.',                  daysAgo: 90  },
  { doctorName: 'Dr. William Davies', hospitalName: 'CardioCare Institute',    diagnosis: 'GERD',                                 medicines: 'Omeprazole 20mg before breakfast daily.',                             daysAgo: 130 },
  { doctorName: 'Dr. Amanda Torres',  hospitalName: 'Valley Eye Center',       diagnosis: 'Myopia OD: -1.5 OS: -1.75',            medicines: 'Prescription glasses. Eye drops for dryness.',                       daysAgo: 185 },
  { doctorName: 'Dr. James Wilson',   hospitalName: 'Peak Orthopedics',        diagnosis: 'Grade II Lateral Ankle Sprain',         medicines: 'RICE protocol. Ankle brace 3 weeks. Physiotherapy 3x/week.',         daysAgo: 240 },
  { doctorName: 'Dr. Linda Gupta',    hospitalName: 'Sunrise Dermatology',     diagnosis: 'Allergic Contact Dermatitis',           medicines: 'Hydrocortisone 1% cream BD for 5 days. Cetirizine 10mg at night.',  daysAgo: 310 },
  { doctorName: 'Dr. Priya Rajan',    hospitalName: 'Apollo Diagnostics',      diagnosis: 'Iron Deficiency Anemia (Hb: 9.2)',      medicines: 'Ferrous Sulfate 200mg BD with Vitamin C.',                           daysAgo: 390 },
  { doctorName: 'Dr. Sarah Jenkins',  hospitalName: 'City Hospital',           diagnosis: 'COVID-19 Mild — RAT Positive',          medicines: 'Paracetamol SOS. Montelukast 10mg at night. Home isolation 10d.',   daysAgo: 450 },
  { doctorName: 'Dr. Anita Kapoor',   hospitalName: 'Rainbow ENT Clinic',      diagnosis: 'Acute Sinusitis + Allergic Rhinitis',   medicines: 'Amoxiclav 625mg BD 7 days. Nasal saline spray BD.',                  daysAgo: 510 },
  { doctorName: 'Dr. Robert Singh',   hospitalName: 'TapCare General',         diagnosis: 'Urinary Tract Infection',               medicines: 'Nitrofurantoin 100mg BD 7 days. 3L water daily.',                    daysAgo: 580 },
];

const ACCOUNTS = [
  { email: 'patient@tapcare.in',        password: 'tapcare@123', name: 'Rahul Sharma',      role: 'patient', patientId: 'tc-patient-001' },
  { email: 'priya.patient@tapcare.in',  password: 'tapcare@123', name: 'Priya Mehta',        role: 'patient', patientId: 'tc-patient-002' },
  { email: 'arjun.patient@tapcare.in',  password: 'tapcare@123', name: 'Arjun Nair',         role: 'patient', patientId: 'tc-patient-003' },
  { email: 'doctor@tapcare.in',         password: 'tapcare@123', name: 'Dr. Sarah Jenkins',  role: 'doctor' },
  { email: 'cardiac.doctor@tapcare.in', password: 'tapcare@123', name: 'Dr. William Davies', role: 'doctor' },
  { email: 'ortho.doctor@tapcare.in',   password: 'tapcare@123', name: 'Dr. James Wilson',   role: 'doctor' },
  { email: 'admin@tapcare.in',          password: 'tapcare@123', name: 'Admin TapCare',      role: 'admin' },
];

export default function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const signInOrCreate = async (email: string, password: string) => {
    const auth = getAuth();
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch {
      return await createUserWithEmailAndPassword(auth, email, password);
    }
  };

  const runSeed = async () => {
    setRunning(true);
    setLog([]);
    let consultationCount = 0;

    try {
      // ── Step 1: Create accounts one-by-one (sequential to avoid rate limits) ──
      addLog('🔐 Creating accounts (sequential)...');
      for (const account of ACCOUNTS) {
        try {
          const cred = await signInOrCreate(account.email, account.password);
          const uid = cred.user.uid;
          const profile: Record<string, any> = { email: account.email, name: account.name, role: account.role };
          if (account.patientId) profile.patientId = account.patientId;
          await setDoc(doc(db, 'users', uid), profile, { merge: true });
          if (account.patientId) {
            await setDoc(doc(db, 'patients', account.patientId), { uid, ...profile }, { merge: true });
          }
          addLog(`✅ ${account.role}: ${account.name}`);
        } catch (e: any) {
          addLog(`⚠️ ${account.name}: ${e.message}`);
        }
      }

      // ── Step 2: Write consultation records ────────────────────────────────────
      addLog('📋 Seeding medical records...');
      const patientSets = [
        { id: 'tc-patient-001', records: RECORDS },
        { id: 'tc-patient-002', records: RECORDS.filter((_, i) => i % 2 === 0) },
        { id: 'tc-patient-003', records: RECORDS.filter((_, i) => i % 3 !== 1) },
      ];

      for (const { id: patientId, records } of patientSets) {
        for (const r of records) {
          const date = new Date();
          date.setDate(date.getDate() - r.daysAgo);
          const { daysAgo, ...rest } = r;
          await addDoc(collection(db, 'consultations'), {
            ...rest,
            patientId,
            symptoms: 'Patient reported symptoms as noted in diagnosis.',
            timestamp: date,
          });
          consultationCount++;
        }
        addLog(`✅ ${records.length} records → ${patientId}`);
      }

      addLog(`🎉 Done! ${ACCOUNTS.length} accounts + ${consultationCount} records seeded.`);
      setDone(true);
    } catch (e: any) {
      addLog(`❌ Fatal error: ${e.message}`);
    }

    setRunning(false);
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: 40, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>🌱 TapCare — Seed Database</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Creates 7 demo accounts + {RECORDS.length * 3} consultation records. Run once before demo.
      </p>

      {!done && (
        <button
          onClick={runSeed}
          disabled={running}
          style={{
            background: running ? '#aaa' : '#4f46e5',
            color: 'white', border: 'none',
            padding: '12px 32px', borderRadius: 8,
            fontSize: 16, cursor: running ? 'not-allowed' : 'pointer', marginBottom: 24,
          }}
        >
          {running ? '⏳ Running...' : '🚀 Run Seed Now'}
        </button>
      )}

      {done && (
        <div style={{ background: '#d1fae5', border: '2px solid #6ee7b7', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <strong>✅ All done! Go to <a href="/" style={{ color: '#4f46e5' }}>tapcare-navy.vercel.app</a> to demo.</strong>
        </div>
      )}

      <div style={{
        background: '#1e1e1e', color: '#d4d4d4', borderRadius: 8,
        padding: 16, minHeight: 200, fontSize: 13, lineHeight: 2,
        overflowY: 'auto', maxHeight: 400,
      }}>
        {log.length === 0
          ? <span style={{ color: '#666' }}>Logs will appear here when you click Run...</span>
          : log.map((l, i) => <div key={i}>{l}</div>)
        }
      </div>
    </div>
  );
}
