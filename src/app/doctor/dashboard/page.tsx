'use client';

import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        {/* Main Content (The Waiting Room) */}
        <main className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
          {/* Stunning background pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>

          <Card className="w-full max-w-md bg-white/70 backdrop-blur-xl border-white/50 shadow-2xl shadow-blue-900/10 rounded-2xl relative z-10 overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 space-y-6">
              
              <div className="relative">
                {/* Radar ring animations */}
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-150"></div>
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-40 scale-110" style={{ animationDelay: '0.5s' }}></div>
                
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-8 text-white shadow-xl shadow-blue-500/30">
                  <Wifi className="h-16 w-16" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Ready for Scan</h2>
                <p className="text-lg text-slate-600 font-medium">
                  Waiting for Patient NFC Tap...
                </p>
                <p className="text-sm text-slate-400">
                  Hold patient's card to your NFC reader or click below to simulate an incoming tap.
                </p>
              </div>

              <div className="w-full space-y-2.5 pt-2">
                <Link href="/doctor/workspace/tc-patient-001" className="block w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-medium shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-between px-4">
                    <span className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" /> Tap Rahul Sharma (B+)
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/doctor/workspace/tc-patient-002" className="block w-full">
                  <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl h-10 font-medium transition-all flex items-center justify-between px-4">
                    <span className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-600" /> Tap Ananya Verma (A+)
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Button>
                </Link>

                <Link href="/doctor/workspace/tc-patient-003" className="block w-full">
                  <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl h-10 font-medium transition-all flex items-center justify-between px-4">
                    <span className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-600" /> Tap Vikram Malhotra (O+)
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Button>
                </Link>
              </div>

            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
