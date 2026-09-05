export interface Consultation {
  id: string;
  patientId: string;
  doctorName: string;
  hospitalName: string;
  symptoms: string;
  diagnosis: string;
  medicines: string;
  timestamp: any; // handles Date, Firestore Timestamp, or string
  vitals?: {
    bp?: string;
    pulse?: string;
    spO2?: string;
    temp?: string;
  };
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  abhaId: string;
}

export const MOCK_PATIENT_PROFILES: Record<string, PatientProfile> = {
  'tc-patient-001': {
    id: 'tc-patient-001',
    name: 'Rahul Sharma',
    age: 34,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+91 98765 43210',
    emergencyContact: {
      name: 'Neha Sharma',
      relation: 'Spouse',
      phone: '+91 98765 43211',
    },
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    abhaId: '91-4829-1029-4820',
  },
  'tc-patient-002': {
    id: 'tc-patient-002',
    name: 'Ananya Verma',
    age: 28,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+91 98123 45678',
    emergencyContact: {
      name: 'Ramesh Verma',
      relation: 'Father',
      phone: '+91 98123 45679',
    },
    allergies: ['Dust mites', 'Pollen', 'Ciprofloxacin'],
    chronicConditions: ['Bronchial Asthma (Moderate Persistent)'],
    abhaId: '91-7291-3849-1102',
  },
  'tc-patient-003': {
    id: 'tc-patient-003',
    name: 'Vikram Malhotra',
    age: 58,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 99887 76655',
    emergencyContact: {
      name: 'Sunita Malhotra',
      relation: 'Spouse',
      phone: '+91 99887 76654',
    },
    allergies: ['NSAIDs (Aspirin sensitivity)'],
    chronicConditions: ['Coronary Artery Disease (Post-CABG 2021)', 'Dyslipidemia'],
    abhaId: '91-1029-4859-9921',
  },
};

export const INITIAL_CONSULTATIONS: Consultation[] = [
  // --- Rahul Sharma (tc-patient-001) ---
  {
    id: 'c-001',
    patientId: 'tc-patient-001',
    doctorName: 'Dr. Priya Nair (MD, Cardiology)',
    hospitalName: 'Apollo Hospitals, New Delhi',
    symptoms: 'Mild resting palpitation, intermittent headache post-exertion.',
    diagnosis: 'Borderline Hypertension with Controlled Glycemic Status (HbA1c 6.9%)',
    medicines: '1. Tab Telmisartan 40mg (1-0-0) after breakfast\n2. Tab Metformin 500mg SR (1-0-1) after meals\n3. Tab Atorvastatin 10mg (0-0-1) at bedtime',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '138/88 mmHg', pulse: '76 bpm', spO2: '98%', temp: '98.4°F' }
  },
  {
    id: 'c-002',
    patientId: 'tc-patient-001',
    doctorName: 'Dr. Rajesh Kulkarni (Endocrinologist)',
    hospitalName: 'Manipal Superspecialty Clinic',
    symptoms: 'Quarterly diabetic follow-up. Mild early morning fatigue.',
    diagnosis: 'Type 2 Diabetes Mellitus - Good Control',
    medicines: '1. Tab Metformin 500mg SR (1-0-1)\n2. Cap Vitamin D3 60k IU weekly for 8 weeks\n3. Continue low-glycemic dietary regimen',
    timestamp: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '130/82 mmHg', pulse: '72 bpm', spO2: '99%', temp: '98.6°F' }
  },
  {
    id: 'c-003',
    patientId: 'tc-patient-001',
    doctorName: 'Dr. Sunita Deshmukh (MS, Ophthalmology)',
    hospitalName: 'TapCare Vision & Eye Center',
    symptoms: 'Annual diabetic eye screening, computer vision screen fatigue.',
    diagnosis: 'No Diabetic Retinopathy detected. Mild Dry Eye Syndrome.',
    medicines: '1. Refresh Tears (Carboxymethylcellulose 0.5%) eye drops 4 times daily\n2. Blue-cut corrective glasses prescribed',
    timestamp: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '128/80 mmHg', pulse: '74 bpm', spO2: '99%', temp: '98.2°F' }
  },
  {
    id: 'c-004',
    patientId: 'tc-patient-001',
    doctorName: 'Dr. Amit Roy (MD, General Medicine)',
    hospitalName: 'Fortis Memorial Research Institute',
    symptoms: 'High fever for 2 days (102°F), productive cough, sore throat, chills.',
    diagnosis: 'Acute Upper Respiratory Tract Infection (Seasonal Viral Bronchitis)',
    medicines: '1. Tab Paracetamol 650mg SOS\n2. Tab Levocetirizine 5mg (0-0-1) for 5 days\n3. Ascoril-D Cough Syrup 10ml TID\n4. Steam inhalation twice daily',
    timestamp: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '124/84 mmHg', pulse: '92 bpm', spO2: '97%', temp: '101.8°F' }
  },
  {
    id: 'c-005',
    patientId: 'tc-patient-001',
    doctorName: 'Dr. Vikram Sen (MS, Orthopedics)',
    hospitalName: 'Max Super Speciality Hospital',
    symptoms: 'Right knee pain after 5k marathon training, mild medial joint line tenderness.',
    diagnosis: 'Grade 1 Medial Collateral Ligament (MCL) Strain',
    medicines: '1. Tab Aceclofenac + Paracetamol (1-0-1) for 3 days post food\n2. Gel Thiocholchicoside topical application TID\n3. Knee brace support for 2 weeks & active physiotherapy',
    timestamp: new Date(Date.now() - 260 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '126/82 mmHg', pulse: '70 bpm', spO2: '99%', temp: '98.4°F' }
  },
  {
    id: 'c-006',
    patientId: 'tc-patient-001',
    doctorName: 'Dr. Priya Nair (MD, Cardiology)',
    hospitalName: 'Apollo Hospitals, New Delhi',
    symptoms: 'Annual executive health check-up, baseline treadmill test.',
    diagnosis: 'Normal 2D Echo (LVEF 62%), TMT Negative for inducible ischemia',
    medicines: 'Continue baseline lifestyle modifications and daily 45-min brisk walking.',
    timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '132/84 mmHg', pulse: '68 bpm', spO2: '99%', temp: '98.5°F' }
  },

  // --- Ananya Verma (tc-patient-002) ---
  {
    id: 'c-101',
    patientId: 'tc-patient-002',
    doctorName: 'Dr. Meera Reddy (MD, Pulmonology)',
    hospitalName: 'Aster Medcity',
    symptoms: 'Nocturnal wheezing, dry irritable cough triggered by winter smog.',
    diagnosis: 'Acute Asthmatic Exacerbation (PEFR 370 L/min)',
    medicines: '1. Foracort Inhaler 200 (Budesonide + Formoterol) 2 puffs BD with spacer\n2. Tab Montelukast 10mg (0-0-1) at night\n3. Asthalin Inhaler (Salbutamol 100mcg) SOS',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '118/76 mmHg', pulse: '84 bpm', spO2: '96%', temp: '98.6°F' }
  },
  {
    id: 'c-102',
    patientId: 'tc-patient-002',
    doctorName: 'Dr. Rohan Kapoor (Allergy & Immunology)',
    hospitalName: 'TapCare Allergy Clinic',
    symptoms: 'Recurrent nasal sneezing, itching around eyes, skin hives.',
    diagnosis: 'Allergic Rhinitis with Atopic Dermatitis flare-up',
    medicines: '1. Bilastine 20mg (1-0-0) before breakfast for 14 days\n2. Fluticasone Furoate Nasal Spray 1 spray in each nostril OD\n3. Caladryl lotion for pruritus',
    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '114/72 mmHg', pulse: '76 bpm', spO2: '99%', temp: '98.4°F' }
  },
  {
    id: 'c-103',
    patientId: 'tc-patient-002',
    doctorName: 'Dr. S. Narayanan (MS, ENT)',
    hospitalName: 'Care Hospital',
    symptoms: 'Left ear discomfort, mild blocked sensation post-swimming.',
    diagnosis: 'Otitis Externa (Mild bacterial canal inflammation)',
    medicines: '1. Ciplox-D Ear Drops (Ciprofloxacin + Dexamethasone) 3 drops TID for 5 days\n2. Keep ear dry during showers',
    timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '116/74 mmHg', pulse: '72 bpm', spO2: '99%', temp: '98.8°F' }
  },

  // --- Vikram Malhotra (tc-patient-003) ---
  {
    id: 'c-201',
    patientId: 'tc-patient-003',
    doctorName: 'Dr. Arvind Swamy (MCh, Cardiothoracic)',
    hospitalName: 'Narayana Institute of Cardiac Sciences',
    symptoms: 'Semi-annual post-CABG surgical review. Zero chest tightness, good exercise tolerance.',
    diagnosis: 'Stable Post-Coronary Artery Bypass Graft (CABG), Normal graft perfusion',
    medicines: '1. Tab Clopidogrel 75mg (1-0-0)\n2. Tab Metoprolol Succinate 25mg ER (1-0-0)\n3. Tab Rosuvastatin 20mg (0-0-1)\n4. Tab Ramipril 2.5mg (1-0-0)',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '122/78 mmHg', pulse: '64 bpm', spO2: '98%', temp: '98.4°F' }
  },
  {
    id: 'c-202',
    patientId: 'tc-patient-003',
    doctorName: 'Dr. Harish Mehta (DM, Nephrology)',
    hospitalName: 'Lilavati Hospital & Research Centre',
    symptoms: 'Routine renal panel review. Serum Creatinine: 1.08 mg/dL, eGFR: 81.',
    diagnosis: 'Normal Renal Function on ACE-inhibitor therapy',
    medicines: 'Hydration advisory (2.5L clean water daily). Maintain low-sodium diet (<2g/day).',
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '124/80 mmHg', pulse: '66 bpm', spO2: '98%', temp: '98.6°F' }
  },
  {
    id: 'c-203',
    patientId: 'tc-patient-003',
    doctorName: 'Dr. Shalini Verma (MD, Gastroenterology)',
    hospitalName: 'Kokilaben Dhirubhai Ambani Hospital',
    symptoms: 'Retro-sternal burning after dinner, acid regurgitation.',
    diagnosis: 'Gastroesophageal Reflux Disease (GERD) - secondary to cardiac meds',
    medicines: '1. Tab Pantoprazole 40mg + Domperidone 30mg (1-0-0) 30 min before breakfast for 14 days\n2. Gaviscon Syrup 10ml after dinner',
    timestamp: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
    vitals: { bp: '126/82 mmHg', pulse: '68 bpm', spO2: '99%', temp: '98.2°F' }
  }
];

export const MOCK_ADMIN_CARDS = [
  {
    id: 'tc-patient-001',
    type: 'Patient' as const,
    name: 'Rahul Sharma',
    mobile: '+91 98765 43210',
    url: 'https://tapcare-navy.vercel.app/scan?id=tc-patient-001',
    status: 'uploaded' as const,
    isActive: true,
    age: 34,
    bloodGroup: 'B+'
  },
  {
    id: 'tc-patient-002',
    type: 'Patient' as const,
    name: 'Ananya Verma',
    mobile: '+91 98123 45678',
    url: 'https://tapcare-navy.vercel.app/scan?id=tc-patient-002',
    status: 'uploaded' as const,
    isActive: true,
    age: 28,
    bloodGroup: 'A+'
  },
  {
    id: 'tc-patient-003',
    type: 'Patient' as const,
    name: 'Vikram Malhotra',
    mobile: '+91 99887 76655',
    url: 'https://tapcare-navy.vercel.app/scan?id=tc-patient-003',
    status: 'uploaded' as const,
    isActive: true,
    age: 58,
    bloodGroup: 'O+'
  },
  {
    id: 'tc-patient-004',
    type: 'Patient' as const,
    name: 'Pooja Hegde',
    mobile: '+91 98334 11223',
    url: 'https://tapcare-navy.vercel.app/scan?id=tc-patient-004',
    status: 'pending' as const,
    isActive: true,
    age: 24,
    bloodGroup: 'AB+'
  },
  {
    id: 'tc-patient-005',
    type: 'Patient' as const,
    name: 'Suresh Kumar',
    mobile: '+91 97654 88776',
    url: 'https://tapcare-navy.vercel.app/scan?id=tc-patient-005',
    status: 'pending' as const,
    isActive: true,
    age: 49,
    bloodGroup: 'O-'
  },
  {
    id: 'tc-patient-006',
    type: 'Doctor' as const,
    name: 'Dr. Priya Nair',
    mobile: '+91 98111 22334',
    url: 'https://tapcare-navy.vercel.app/scan?id=doc-001',
    status: 'uploaded' as const,
    isActive: true,
    age: 42,
    bloodGroup: 'A+'
  },
  {
    id: 'tc-patient-007',
    type: 'Doctor' as const,
    name: 'Dr. Arvind Swamy',
    mobile: '+91 98222 33445',
    url: 'https://tapcare-navy.vercel.app/scan?id=doc-002',
    status: 'uploaded' as const,
    isActive: true,
    age: 51,
    bloodGroup: 'B+'
  }
];

// Helper to normalize timestamp to string / date
export function formatConsultationDate(timestamp: any): string {
  if (!timestamp) return 'Just now';
  if (typeof timestamp === 'object' && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  const d = new Date(timestamp);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return 'Recent';
}

// Local Storage Keys
const CONSULTATIONS_KEY = 'tapcare_consultations_vault';
const PATIENTS_KEY = 'tapcare_admin_patients';

export function getStoredConsultations(patientId?: string): Consultation[] {
  if (typeof window === 'undefined') {
    return patientId 
      ? INITIAL_CONSULTATIONS.filter(c => c.patientId === patientId)
      : INITIAL_CONSULTATIONS;
  }

  let list: Consultation[] = [];
  try {
    const raw = localStorage.getItem(CONSULTATIONS_KEY);
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = [...INITIAL_CONSULTATIONS];
      localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(list));
    }
  } catch {
    list = [...INITIAL_CONSULTATIONS];
  }

  // Ensure default mock data is always seeded in list if missing
  const existingIds = new Set(list.map(c => c.id));
  let modified = false;
  for (const item of INITIAL_CONSULTATIONS) {
    if (!existingIds.has(item.id)) {
      list.push(item);
      modified = true;
    }
  }
  if (modified) {
    try {
      localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(list));
    } catch {}
  }

  if (patientId) {
    return list.filter(c => c.patientId === patientId);
  }
  return list;
}

export function saveLocalConsultation(consultation: Omit<Consultation, 'id'> & { id?: string }): Consultation {
  const newRecord: Consultation = {
    ...consultation,
    id: consultation.id || `c-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: consultation.timestamp || new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredConsultations();
      const updated = [newRecord, ...existing];
      localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }

  return newRecord;
}

export function getPatientProfile(patientId: string): PatientProfile {
  if (MOCK_PATIENT_PROFILES[patientId]) {
    return MOCK_PATIENT_PROFILES[patientId];
  }

  // Generate sensible profile for unknown ID
  const cleanId = patientId.replace(/[^a-zA-Z0-9]/g, '');
  return {
    id: patientId,
    name: `Patient ${patientId.slice(-4).toUpperCase()}`,
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98000 ' + (cleanId.slice(0, 5) || '12345'),
    emergencyContact: {
      name: 'Primary Contact',
      relation: 'Family',
      phone: '+91 98000 00000',
    },
    allergies: ['None known'],
    chronicConditions: ['None reported'],
    abhaId: `91-0000-${cleanId.slice(0, 4) || '1234'}-9999`,
  };
}

export function getStoredAdminCards(): any[] {
  if (typeof window === 'undefined') return MOCK_ADMIN_CARDS;
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(MOCK_ADMIN_CARDS));
    return MOCK_ADMIN_CARDS;
  } catch {
    return MOCK_ADMIN_CARDS;
  }
}

export function saveLocalAdminCard(card: any): any[] {
  if (typeof window === 'undefined') return MOCK_ADMIN_CARDS;
  try {
    const cards = getStoredAdminCards();
    const updated = [card, ...cards];
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return MOCK_ADMIN_CARDS;
  }
}
