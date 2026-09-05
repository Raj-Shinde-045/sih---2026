'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

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

const PATIENT_IDS = [
  { id: 'tc-patient-001', name: 'Rahul Sharma',  records: RECORDS },
  { id: 'tc-patient-002', name: 'Priya Mehta',   records: RECORDS.filter((_, i) => i % 2 === 0) },
  { id: 'tc-patient-003', name: 'Arjun Nair',    records: RECORDS.filter((_, i) => i % 3 !== 1) },
];

export default function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [total, setTotal] = useState(0);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const runSeed = async () => {
    setRunning(true);
    setLog(['📋 Writing consultation records to Firestore...', '(No login needed — uses your existing session)']);
    let count = 0;

    try {
      for (const patient of PATIENT_IDS) {
        addLog(`⏳ Writing ${patient.records.length} records for ${patient.name}...`);
        for (const r of patient.records) {
          const date = new Date();
          date.setDate(date.getDate() - r.daysAgo);
          const { daysAgo, ...rest } = r;
          await addDoc(collection(db, 'consultations'), {
            ...rest,
            patientId: patient.id,
            symptoms: 'Patient presented with symptoms as noted in diagnosis.',
            timestamp: date,
          });
          count++;
          setTotal(count);
        }
        addLog(`✅ Done — ${patient.name} (${patient.records.length} records)`);
      }

      addLog(`🎉 Seeded ${count} total consultation records!`);
      addLog('👉 Go to tapcare-navy.vercel.app → Patient login → Tap card → See all records');
      setDone(true);
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
      addLog('Make sure you are logged in to the app first, then retry.');
    }

    setRunning(false);
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: 40, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>📋 TapCare — Seed Consultations</h1>
      <p style={{ color: '#555', marginBottom: 8 }}>
        Writes <strong>{RECORDS.length * 3} consultation records</strong> across 3 demo patients directly to Firestore.
      </p>
      <p style={{ color: '#e55', fontSize: 13, marginBottom: 24 }}>
        ⚠️ Make sure you are <strong>logged in to TapCare</strong> first (any role), then come back here and click Run.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {!done ? (
          <button
            onClick={runSeed}
            disabled={running}
            style={{
              background: running ? '#aaa' : '#059669',
              color: 'white', border: 'none',
              padding: '12px 32px', borderRadius: 8,
              fontSize: 16, cursor: running ? 'not-allowed' : 'pointer',
            }}
          >
            {running ? `⏳ Writing... (${total} records so far)` : '🚀 Seed Consultations'}
          </button>
        ) : (
          <a href="/" style={{
            background: '#4f46e5', color: 'white',
            padding: '12px 32px', borderRadius: 8, fontSize: 16,
            textDecoration: 'none', display: 'inline-block'
          }}>
            ✅ Done — Go to App →
          </a>
        )}
        <a href="/" style={{
          background: '#f1f5f9', color: '#334155',
          padding: '12px 24px', borderRadius: 8, fontSize: 14,
          textDecoration: 'none', display: 'inline-block', border: '1px solid #e2e8f0'
        }}>
          ← Back to App
        </a>
      </div>

      <div style={{
        background: '#1e1e1e', color: '#d4d4d4', borderRadius: 8,
        padding: 16, minHeight: 180, fontSize: 13, lineHeight: 2,
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
