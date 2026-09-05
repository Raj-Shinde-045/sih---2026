'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, FileText, Pill, Clock, Download, ScanLine, Search, ArrowUpDown } from 'lucide-react';

export default function PatientDashboard() {
  const [isTapped, setIsTapped] = useState(false);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'all'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    const patientId = 'tc-patient-001'; 
    const q = query(
      collection(db, 'consultations'),
      where('patientId', '==', patientId),
      orderBy('timestamp', sortOrder)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConsultations(docs);
    });
    return () => unsubscribe();
  }, [sortOrder]);

  const filteredConsultations = useMemo(() => {
    if (!searchQuery) return consultations;
    const lowerQ = searchQuery.toLowerCase();
    return consultations.filter(c => 
      c.doctorName?.toLowerCase().includes(lowerQ) || 
      c.diagnosis?.toLowerCase().includes(lowerQ) ||
      c.hospitalName?.toLowerCase().includes(lowerQ)
    );
  }, [consultations, searchQuery]);


  if (!isTapped) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
          <Card className="w-full max-w-md bg-white/70 backdrop-blur-xl border-white/50 shadow-2xl shadow-emerald-900/10 rounded-2xl relative z-10 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300" onClick={() => setIsTapped(true)}>
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20 scale-150"></div>
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40 scale-110" style={{ animationDelay: '0.5s' }}></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full p-8 text-white shadow-xl shadow-emerald-500/30">
                  <ScanLine className="h-16 w-16" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Access Locked</h2>
                <p className="text-lg text-slate-600 font-medium px-4">Tap your NFC card to see your medical access.</p>
                <p className="text-sm text-slate-400">(Click anywhere on this card to simulate the tap)</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const renderRecordCard = (record: any) => (
    <Card key={record.id} className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all group animate-in slide-in-from-bottom-2 duration-300">
      <div className="h-1 w-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors"></div>
      <CardHeader className="py-4 px-5 bg-white">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-lg text-slate-900 font-bold leading-tight">{record.doctorName}</CardTitle>
            <CardDescription className="text-slate-500 mt-1 font-medium">
              {record.hospitalName} • {record.timestamp?.toDate ? record.timestamp.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Just now'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 shrink-0">
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-4 px-5 bg-slate-50/50 border-t border-slate-100">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-bold text-slate-900 flex items-center mb-1">
              <Pill className="mr-1.5 h-4 w-4 text-slate-400" /> Diagnosis
            </p>
            <p className="text-sm text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg">{record.diagnosis}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 flex items-center mb-1">
              <FileText className="mr-1.5 h-4 w-4 text-slate-400" /> Treatment / Prescription
            </p>
            <p className="text-sm text-slate-600 pl-6">{record.medicines || 'None'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 font-sans">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Hero Section */}
        <section className="mb-6 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
            <ShieldCheck className="h-64 w-64" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-500/30 p-2 rounded-xl backdrop-blur-md">
                  <ShieldCheck className="h-8 w-8 text-emerald-100" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Medical Vault</h1>
              </div>
              <p className="text-emerald-100 text-base font-medium max-w-md">Your highly secure medical data is unlocked. You have {consultations.length} total records securely stored.</p>
            </div>
          </div>
        </section>

        {/* Custom Tabs */}
        <div className="flex gap-6 border-b border-slate-200 mb-6">
          <button 
            className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'overview' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('overview')}
          >
            Recent Overview
          </button>
          <button 
            className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'all' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('all')}
          >
            All Records
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center mb-2">
                <Clock className="mr-2 h-5 w-5 text-slate-500" /> Latest Consultations
              </h2>
              {consultations.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-xl border border-dashed">No recent records.</div>
              ) : (
                <div className="space-y-4">
                  {consultations.slice(0, 3).map(renderRecordCard)}
                  {consultations.length > 3 && (
                    <Button variant="outline" className="w-full text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" onClick={() => setActiveTab('all')}>
                      View all {consultations.length} records
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center mb-2">
                <ShieldCheck className="mr-2 h-5 w-5 text-slate-500" /> Security Log
              </h2>
              <Card className="border-slate-200 shadow-sm rounded-xl">
                <div className="divide-y divide-slate-100">
                  <div className="p-4 bg-white hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-bold text-emerald-700">Access Granted (OTP)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Dr. Sarah Jenkins • City Hospital</p>
                    <p className="text-xs text-slate-400 font-medium mt-2">Today, 10:14 AM</p>
                  </div>
                  <div className="p-4 bg-white hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-bold text-red-600">Access Revoked (Timeout)</p>
                    <p className="text-xs text-slate-500 mt-0.5">System Auto-Lock</p>
                    <p className="text-xs text-slate-400 font-medium mt-2">Yesterday, 4:00 PM</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'all' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Search by doctor, diagnosis, or hospital..." 
                  className="pl-10 h-12 bg-slate-50 border-transparent focus:border-emerald-500 focus:bg-white transition-all rounded-xl text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="h-12 px-6 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-medium w-full sm:w-auto"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" /> 
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {filteredConsultations.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="font-medium text-lg text-slate-600">No records found matching your search.</p>
                  <Button variant="link" onClick={() => setSearchQuery('')} className="text-emerald-600">Clear filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredConsultations.map(renderRecordCard)}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
