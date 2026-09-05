-- DOCTORS TABLE
CREATE TABLE doctors (
    doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(150),
    clinic_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE, -- Admins must approve them
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PATIENTS TABLE
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nfc_tag_id VARCHAR(255) UNIQUE NOT NULL, -- The encrypted string actually stored on the card
    abha_id VARCHAR(14) UNIQUE, -- Ayushman Bharat ID for the SIH pitch
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL, -- Crucial for sending the OTP
    dob DATE,
    blood_group VARCHAR(5),
    emergency_contact VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a fast lookup index for when the card is tapped
CREATE INDEX idx_nfc_tag ON patients(nfc_tag_id);

-- CONSULTATIONS TABLE (The Visits)
CREATE TABLE consultations (
    consultation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(doctor_id),
    symptoms TEXT,
    diagnosis TEXT,
    clinical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MEDICATIONS TABLE (The Prescriptions)
CREATE TABLE medications (
    medication_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(consultation_id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100), -- e.g., "500mg"
    frequency VARCHAR(100), -- e.g., "1-0-1 (Morning/Night)"
    duration VARCHAR(100) -- e.g., "5 Days"
);

-- SCANNED DOCUMENTS TABLE (The OCR Pipeline)
CREATE TABLE scanned_documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES doctors(doctor_id),
    document_type VARCHAR(100), -- e.g., 'Past Prescription', 'Lab Report'
    file_url VARCHAR(500) NOT NULL, -- Link to the image in your Supabase/AWS bucket
    extracted_data JSONB, -- The clean JSON object returned by the Gemini Vision API!
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ACCESS LOGS (The "Patient Vault" tracking)
CREATE TABLE access_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(doctor_id),
    action VARCHAR(100) NOT NULL, -- e.g., "Access Granted via OTP", "Access Revoked"
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
