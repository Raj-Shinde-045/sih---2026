'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, CreditCard, UserPlus, Link as LinkIcon, CheckCircle, XCircle, RefreshCw, Stethoscope } from 'lucide-react';

type CardData = {
  id: string;
  type: 'Patient' | 'Doctor';
  name: string;
  mobile: string;
  url: string;
  status: 'pending' | 'uploaded';
  isActive: boolean;
};

const defaultCards: CardData[] = [
  {
    id: 'tc-patient-001',
    type: 'Patient',
    name: 'Rahul Sharma',
    mobile: '+91 98765 43210',
    url: 'https://tapcare-navy.vercel.app/scan?id=tc-patient-001',
    status: 'uploaded',
    isActive: true,
  },
  {
    id: 'tc-patient-002',
    type: 'Patient',
    name: 'Ananya Verma',
    mobile: '+91 98123 45678',
    url: 'https://tapcare-navy.vercel.app/scan?id=tc-patient-002',
    status: 'pending',
    isActive: true,
  },
  {
    id: 'tc-patient-003',
    type: 'Patient',
    name: 'Vikram Malhotra',
    mobile: '+91 99887 76655',
    url: 'https://tapcare-navy.vercel.app/scan?id=tc-patient-003',
    status: 'uploaded',
    isActive: false,
  }
];

export default function AdminDashboard() {
  const [cards, setCards] = useState<CardData[]>(defaultCards);
  
  const [activeTab, setActiveTab] = useState<'pending' | 'uploaded'>('pending');
  const [newUserName, setNewUserName] = useState('');
  const [newUserMobile, setNewUserMobile] = useState('');
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPass, setDocPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSeedLoading, setIsSeedLoading] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'patients'), 
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedCards: CardData[] = snapshot.docs.map(docSnap => ({
              id: docSnap.id,
              ...docSnap.data()
            })) as CardData[];
            setCards(fetchedCards);
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot blocked or offline, retaining default data:', error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore connection skipped:', e);
    }
  }, []);

  const generateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCardRef = await addDoc(collection(db, 'patients'), {
        type: 'Patient',
        name: newUserName,
        mobile: newUserMobile,
        status: 'pending',
        isActive: true,
        createdAt: serverTimestamp()
      });
      // Generate URL based on the document ID
      const url = `https://tapcare.com/scan?id=${newCardRef.id}`;
      await updateDoc(newCardRef, { url });
      
      setNewUserName('');
      setNewUserMobile('');
      alert(`Link Generated: ${url}`);
    } catch (error) {
      console.error(error);
      alert('Failed to issue card');
    } finally {
      setLoading(false);
    }
  };

  const markAsUploaded = async (id: string) => {
    await updateDoc(doc(db, 'patients', id), { status: 'uploaded' });
  };

  const toggleActivation = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'patients', id), { isActive: !currentStatus });
  };

  const generateNewLinkForCard = async (id: string) => {
    const newId = `regen-${Math.floor(Math.random() * 10000)}`;
    const url = `https://tapcare.com/scan?id=${newId}`;
    await updateDoc(doc(db, 'patients', id), { url, status: 'pending' });
    alert('New link generated and moved to Pending.');
  };

  const registerDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/create-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: docName, email: docEmail, password: docPass })
      });
      if (res.ok) {
        alert('Doctor Registered successfully.');
        setDocName('');
        setDocEmail('');
        setDocPass('');
      } else {
        const data = await res.json();
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert('Error registering doctor');
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    setIsSeedLoading(true);
    try {
      const res = await fetch('/api/seed?secret=tapcare-seed-2026', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSeedDone(true);
        alert(`✅ Database seeded!\n\n${data.summary}`);
      } else {
        alert(`❌ Seed failed: ${data.error}`);
      }
    } catch (e) {
      alert('Failed to reach seed endpoint.');
    } finally {
      setIsSeedLoading(false);
    }
  };

  const pendingCards = cards.filter(c => c.status === 'pending');
  const uploadedCards = cards.filter(c => c.status === 'uploaded');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Control Center</h1>
            <p className="text-slate-500 font-medium">Manage NFC card issuance and secure links</p>
          </div>
        </div>



        <div className="flex flex-col gap-10">
          
          {/* Top Section: Forms Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Patient Form */}
            <Card className="glass border-slate-200 shadow-md rounded-3xl overflow-hidden flex flex-col">
              <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center text-2xl font-extrabold text-slate-800">
                  <UserPlus className="mr-3 h-8 w-8 text-blue-600" /> Issue Patient Card
                </CardTitle>
                <CardDescription className="text-base text-slate-500 mt-2 leading-relaxed">
                  Generate a secure URL for an NFC tag.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-1">
                <form onSubmit={generateLink} className="space-y-6 flex flex-col h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-lg font-bold text-slate-700">Full Name</Label>
                      <Input 
                        id="name" 
                        className="h-14 text-lg rounded-2xl border-slate-300 bg-white shadow-sm px-6"
                        placeholder="e.g. Alex Johnson"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="mobile" className="text-lg font-bold text-slate-700">Mobile Number</Label>
                      <Input 
                        id="mobile" 
                        type="tel"
                        className="h-14 text-lg rounded-2xl border-slate-300 bg-white shadow-sm px-6"
                        placeholder="+1 234 567 8900"
                        value={newUserMobile}
                        onChange={(e) => setNewUserMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-slate-900 text-white rounded-2xl h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
                    Generate Secure Link
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Doctor Form */}
            <Card className="glass border-slate-200 shadow-md rounded-3xl overflow-hidden flex flex-col">
              <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-emerald-700"></div>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center text-2xl font-extrabold text-slate-800">
                  <Stethoscope className="mr-3 h-8 w-8 text-emerald-600" /> Register Doctor
                </CardTitle>
                <CardDescription className="text-base text-slate-500 mt-2 leading-relaxed">
                  Create secure login credentials for a new doctor.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-1">
                <form onSubmit={registerDoctor} className="space-y-6 flex flex-col h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="space-y-3">
                      <Label htmlFor="docName" className="text-lg font-bold text-slate-700">Full Name</Label>
                      <Input 
                        id="docName" 
                        className="h-14 text-lg rounded-2xl border-slate-300 bg-white shadow-sm px-6" 
                        placeholder="Dr. Smith" 
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="docEmail" className="text-lg font-bold text-slate-700">Email Address</Label>
                      <Input 
                        id="docEmail" 
                        type="email" 
                        className="h-14 text-lg rounded-2xl border-slate-300 bg-white shadow-sm px-6" 
                        placeholder="doctor@clinic.com" 
                        value={docEmail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="docPass" className="text-lg font-bold text-slate-700">Temporary Password</Label>
                      <Input 
                        id="docPass" 
                        type="password" 
                        className="h-14 text-lg rounded-2xl border-slate-300 bg-white shadow-sm px-6" 
                        value={docPass}
                        onChange={(e) => setDocPass(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 text-lg font-semibold shadow-xl transition-all">
                    {loading ? 'Registering...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>

          {/* Bottom Section: Tables */}
          <div className="w-full space-y-6 mt-4">
            
            {/* Custom Tabs */}
            <div className="flex gap-4 border-b border-slate-200 pb-2">
              <button 
                className={`pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('pending')}
              >
                To be uploaded ({pendingCards.length})
              </button>
              <button 
                className={`pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${activeTab === 'uploaded' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('uploaded')}
              >
                Already uploaded ({uploadedCards.length})
              </button>
            </div>

            <Card className="glass border-slate-200 shadow-sm rounded-2xl">
              <CardContent className="p-0">
                {activeTab === 'pending' && (
                  <div className="divide-y divide-slate-100">
                    {pendingCards.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 font-medium">No pending cards.</div>
                    ) : pendingCards.map((card) => (
                      <div key={card.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <input 
                            type="checkbox" 
                            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            onChange={() => markAsUploaded(card.id)}
                            title="Mark as uploaded to card"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{card.name}</span>
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{card.type}</span>
                            </div>
                            <div className="text-sm text-slate-500 font-medium mt-1">
                              Mobile: {card.mobile}
                            </div>
                            <div className="flex items-center mt-2 text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                              <LinkIcon className="h-3 w-3 mr-1" /> {card.url}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => markAsUploaded(card.id)} className="shrink-0 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                          Mark Uploaded
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'uploaded' && (
                  <div className="divide-y divide-slate-100">
                    {uploadedCards.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 font-medium">No uploaded cards.</div>
                    ) : uploadedCards.map((card) => (
                      <div key={card.id} className={`p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors ${!card.isActive ? 'opacity-50 grayscale' : ''}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <span className="font-bold text-slate-900">{card.name}</span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{card.type}</span>
                            {!card.isActive && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Deactivated</span>}
                          </div>
                          <div className="text-sm text-slate-500 font-medium mt-1 pl-7">
                            Mobile: {card.mobile}
                          </div>
                          <div className="flex items-center mt-2 ml-7 text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                            <LinkIcon className="h-3 w-3 mr-1" /> {card.url}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0 mt-2 sm:mt-0">
                          <Button variant="outline" size="sm" onClick={() => generateNewLinkForCard(card.id)} className="text-slate-600">
                            <RefreshCw className="h-4 w-4 mr-1" /> New Link
                          </Button>
                          <Button 
                            variant={card.isActive ? 'destructive' : 'outline'} 
                            size="sm" 
                            onClick={() => toggleActivation(card.id, card.isActive)}
                            className={!card.isActive ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' : ''}
                          >
                            {card.isActive ? <><ShieldAlert className="h-4 w-4 mr-1" /> Deactivate</> : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
