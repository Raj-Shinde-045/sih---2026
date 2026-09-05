import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCGRtkEl3b0HrO_p-P2zE8aeEv5U1z4HBw",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tapcare-cards",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockData = [
  {
    doctorName: "Dr. Emily Chen",
    hospitalName: "Metro General Hospital",
    symptoms: "Severe lower back pain, radiating down right leg.",
    diagnosis: "Sciatica",
    medicines: "Ibuprofen 400mg 1-1-1, Muscle relaxant (Cyclobenzaprine 5mg) at night. Physical therapy recommended.",
    daysAgo: 120
  },
  {
    doctorName: "Dr. Marcus Thorne",
    hospitalName: "Oakridge Dental Clinic",
    symptoms: "Toothache in lower right molar, sensitivity to cold.",
    diagnosis: "Dental Caries",
    medicines: "Amoxicillin 500mg 1-1-1 for 5 days. Scheduled for filling next week.",
    daysAgo: 85
  },
  {
    doctorName: "Dr. Sarah Jenkins",
    hospitalName: "City Hospital",
    symptoms: "Persistent dry cough, mild fever, fatigue.",
    diagnosis: "Viral Bronchitis",
    medicines: "Cough suppressant syrup, Paracetamol 500mg as needed. Rest and hydration.",
    daysAgo: 40
  },
  {
    doctorName: "Dr. James Wilson",
    hospitalName: "Peak Orthopedics",
    symptoms: "Twisted ankle during sports, swelling, inability to bear weight.",
    diagnosis: "Grade 2 Ankle Sprain",
    medicines: "R.I.C.E protocol. Ace bandage. Ibuprofen 400mg for pain.",
    daysAgo: 210
  },
  {
    doctorName: "Dr. Linda Gupta",
    hospitalName: "Sunrise Dermatology",
    symptoms: "Red, itchy rash on both forearms.",
    diagnosis: "Contact Dermatitis",
    medicines: "Hydrocortisone 1% cream applied twice daily. Avoid scented soaps.",
    daysAgo: 310
  },
  {
    doctorName: "Dr. Robert Singh",
    hospitalName: "TapCare General",
    symptoms: "Annual physical checkup. No acute complaints.",
    diagnosis: "Healthy / Routine Checkup",
    medicines: "Multivitamins daily. Recommended 30 mins cardio 3x a week.",
    daysAgo: 15
  },
  {
    doctorName: "Dr. Amanda Torres",
    hospitalName: "Valley Eye Center",
    symptoms: "Blurry vision when reading, mild headaches.",
    diagnosis: "Presbyopia",
    medicines: "Prescribed reading glasses (+1.50). Artificial tears for dryness.",
    daysAgo: 400
  },
  {
    doctorName: "Dr. William Davies",
    hospitalName: "CardioCare Institute",
    symptoms: "Occasional chest tightness after heavy meals, heartburn.",
    diagnosis: "GERD (Gastroesophageal Reflux Disease)",
    medicines: "Omeprazole 20mg once daily before breakfast.",
    daysAgo: 60
  }
];

async function seed() {
  console.log("Starting seeding process...");
  const patientId = "tc-patient-001";
  
  for (const record of mockData) {
    const date = new Date();
    date.setDate(date.getDate() - record.daysAgo);
    
    try {
      await addDoc(collection(db, 'consultations'), {
        patientId,
        doctorName: record.doctorName,
        hospitalName: record.hospitalName,
        symptoms: record.symptoms,
        diagnosis: record.diagnosis,
        medicines: record.medicines,
        timestamp: Timestamp.fromDate(date)
      });
      console.log(`Added record from ${record.doctorName} (${record.daysAgo} days ago)`);
    } catch (e) {
      console.error("Error adding record: ", e);
    }
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
