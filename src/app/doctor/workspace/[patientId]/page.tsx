'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Timer, AlertCircle, Upload, Save, ScanLine, FileText } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function DoctorWorkspace() {
  const routerParams = useParams();
  const rawId = typeof routerParams?.patientId === 'string' ? routerParams.patientId : 'tc-patient-001';
  const patientId = rawId || 'tc-patient-001';

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [ocrLoading, setOcrLoading] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState('');
  const [pastConsultations, setPastConsultations] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    const q = query(
      collection(db, 'consultations'),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPastConsultations(docs);
    });
    return () => unsubscribe();
  }, [patientId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const simulateOCR = async () => {
    setOcrLoading(true);
    // Simulate API call to Gemini
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setSymptoms('Fever, body ache, sore throat (Extracted from scan)');
    setDiagnosis('Viral Infection');
    setMedicines('Paracetamol 500mg, 1-0-1 for 3 days');
    setOcrLoading(false);
  };

  const handleSaveConsultation = async () => {
    if (!symptoms || !diagnosis) {
      alert('Please enter symptoms and diagnosis.');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'consultations'), {
        patientId,
        doctorName: 'Dr. TapCare (Demo)',
        hospitalName: 'TapCare Clinic',
        symptoms,
        diagnosis,
        medicines,
        timestamp: serverTimestamp()
      });
      setSymptoms('');
      setDiagnosis('');
      setMedicines('');
      alert('Consultation saved securely to vault.');
    } catch (error) {
      console.error(error);
      alert('Failed to save consultation.');
    } finally {
      setSaving(false);
    }
  };

  if (timeLeft === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md text-center border-red-200">
          <CardHeader>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <CardTitle className="text-xl text-red-600">Session Expired</CardTitle>
            <CardDescription>
              Your secure access to this patient's records has timed out. Please tap the NFC card again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/doctor/dashboard'} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      {/* Top Header - Patient Info & Timer */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Alex Johnson</h1>
          <div className="text-sm text-slate-500 flex space-x-4">
            <span>ID: {patientId.substring(0, 8)}...</span>
            <span>Age: 32</span>
            <span className="font-medium text-red-500">Blood: O+</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full font-medium ${timeLeft < 300 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-50 text-blue-700'}`}>
            <Timer className="h-4 w-4" />
            <span>{formatTime(timeLeft)} remaining</span>
          </div>
          <Button variant="outline" className="text-slate-600" onClick={() => setTimeLeft(0)}>
            Close Session
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Column (60%): Medical Timeline */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-slate-500" />
              Patient Timeline
            </h2>
            
            <Accordion type="single" collapsible className="w-full space-y-2">
              {pastConsultations.length === 0 ? (
                <div className="text-sm text-slate-500 p-4 bg-white rounded-lg border">No past records found for this patient.</div>
              ) : (
                pastConsultations.map((consultation, i) => (
                  <AccordionItem key={consultation.id} value={`visit-${i}`} className="bg-white border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex justify-between w-full pr-4 text-left">
                        <div>
                          <p className="font-semibold text-slate-900">{consultation.doctorName} - {consultation.hospitalName}</p>
                          <p className="text-sm text-slate-500">
                            {consultation.timestamp?.toDate ? consultation.timestamp.toDate().toLocaleDateString() : 'Just now'} • Diagnosis: {consultation.diagnosis}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 text-slate-600 border-t">
                      <div className="space-y-3 mt-2">
                        <div>
                          <strong className="text-slate-900 text-sm">Symptoms:</strong>
                          <p className="text-sm">{consultation.symptoms}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                          <strong className="text-slate-900 text-sm block mb-1">Prescription:</strong>
                          <p className="text-sm whitespace-pre-line">{consultation.medicines || 'None'}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
            
            {/* The OCR Pipeline UI */}
            <Card className="border-blue-100 bg-blue-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-md flex items-center text-blue-800">
                  <ScanLine className="mr-2 h-5 w-5" />
                  Legacy Record OCR Scanner
                </CardTitle>
                <CardDescription>Upload a physical paper prescription to digitize it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center bg-white text-center">
                  <Upload className="h-8 w-8 text-blue-400 mb-2" />
                  <p className="text-sm text-slate-600 mb-4">Drag & drop or click to upload</p>
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={simulateOCR} disabled={ocrLoading}>
                    {ocrLoading ? 'Extracting via Gemini Vision...' : 'Scan Legacy Prescription'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (40%): New Entry Form */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 bg-white border-slate-200 shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
                <CardTitle className="text-lg">New Consultation</CardTitle>
                <CardDescription>Records are automatically signed with your verified ID</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {ocrLoading && (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-10 bg-slate-100 rounded"></div>
                    <div className="h-20 bg-slate-100 rounded"></div>
                  </div>
                )}
                
                <div className={`space-y-4 ${ocrLoading ? 'hidden' : 'block'}`}>
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Input 
                      id="symptoms" 
                      value={symptoms} 
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g. Cough, fever" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Input 
                      id="diagnosis" 
                      value={diagnosis} 
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Primary diagnosis" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medicines">Prescription</Label>
                    <textarea 
                      id="medicines"
                      value={medicines}
                      onChange={(e) => setMedicines(e.target.value)}
                      className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                      placeholder="List medicines, dosage, frequency"
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                    onClick={handleSaveConsultation}
                    disabled={saving}
                  >
                    <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save & Push to Patient Vault'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </main>
    </div>
  );
}
