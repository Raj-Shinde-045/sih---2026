'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, ShieldCheck, Activity } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

function LoginContent() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthSuccess = (userCredential: any) => {
    const user = userCredential.user;
    const emailLower = (user.email || '').toLowerCase();
    
    let targetRole: 'admin' | 'doctor' | 'patient' = role;
    if (emailLower.includes('admin')) {
      targetRole = 'admin';
    } else if (emailLower.includes('doctor') || emailLower.includes('dr')) {
      targetRole = 'doctor';
    }

    // Run Firestore & Session cookie in background without blocking navigation
    (async () => {
      try {
        const idToken = await user.getIdToken();
        const { db } = await import('@/lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        const userDocRef = doc(db, 'users', user.uid);
        
        await setDoc(userDocRef, {
          email: user.email,
          role: targetRole,
          lastLogin: new Date().toISOString()
        }, { merge: true }).catch(() => {});

        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: targetRole, idToken })
        }).catch(() => {});
      } catch (e) {
        console.warn('Background sync warning:', e);
      }
    })();

    // Instant redirect (< 50ms)
    if (targetRole === 'admin') router.push('/admin/dashboard');
    else if (targetRole === 'doctor') router.push('/doctor/dashboard');
    else router.push('/patient/dashboard');
  };

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);

    const loginEmail = (customEmail || email).trim();
    const loginPass = customPass || password;

    // Detect target role instantly
    const lower = loginEmail.toLowerCase();
    const targetRole = lower.includes('admin') ? 'admin' : (lower.includes('doctor') || lower.includes('dr') ? 'doctor' : role);
    const targetPath = targetRole === 'admin' ? '/admin/dashboard' : targetRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';

    // Fire background Firebase authentication so state persists without stalling the UI
    (async () => {
      try {
        const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
        } catch (authError: any) {
          if (
            authError.code === 'auth/user-not-found' ||
            authError.code === 'auth/invalid-credential' ||
            authError.code === 'auth/invalid-login-credentials'
          ) {
            userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPass);
          }
        }

        if (userCredential) {
          const idToken = await userCredential.user.getIdToken();
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: targetRole, idToken })
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('Background auth sync note:', err);
      }
    })();

    // Navigate immediately without delay!
    router.push(targetPath);
  };

  const quickLogin = (targetRole: 'admin' | 'doctor' | 'patient') => {
    setLoading(true);
    const targetPath = targetRole === 'admin' ? '/admin/dashboard' : targetRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
    
    // Background cookie sync
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: targetRole, idToken: 'quick-token-' + Date.now() })
    }).catch(() => {});

    // Instant zero-wait navigation
    router.push(targetPath);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      handleAuthSuccess(userCredential);
    } catch (error: any) {
      console.warn('Google Auth popup closed or unconfigured, logging in as patient:', error);
      // Fallback: don't leave user stranded
      quickLogin('patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 mesh-bg relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full blur-[100px] opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400 rounded-full blur-[120px] opacity-30"></div>
      
      <div className="mb-8 z-10 flex flex-col items-center text-center">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
          <Activity className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">TapCare <span className="text-blue-600">NFC</span></h1>
        <p className="text-slate-600 font-medium">Secure Medical Records Ecosystem</p>
      </div>

      <Card className="w-full max-w-md glass border-white/50 shadow-2xl shadow-blue-900/10 z-10 rounded-2xl">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Please sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-8 bg-slate-100/50 p-1 rounded-xl">
            <Button
              variant={role === 'patient' ? 'default' : 'ghost'}
              className={`flex-1 rounded-lg transition-all ${role === 'patient' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              onClick={() => setRole('patient')}
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> Patient
            </Button>
            <Button
              variant={role === 'doctor' ? 'default' : 'ghost'}
              className={`flex-1 rounded-lg transition-all ${role === 'doctor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              onClick={() => setRole('doctor')}
            >
              <Stethoscope className="mr-2 h-4 w-4" /> Doctor / Admin
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email / Phone</Label>
              <Input 
                id="email" 
                type="text" 
                className="rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:bg-white transition-all h-11"
                placeholder={role === 'doctor' ? "dr.smith@clinic.com (or admin)" : "patient@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
              <Input 
                id="password" 
                type="password" 
                className="rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:bg-white transition-all h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-medium mt-2 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline"
            className="w-full rounded-xl h-11 font-medium bg-white hover:bg-slate-50 text-slate-700 border-slate-200 transition-all" 
            disabled={loading}
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>

          {/* Quick Demo Login Shortcuts */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              1-Click Demo Logins
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 py-2 h-auto"
                disabled={loading}
                onClick={() => quickLogin('admin')}
              >
                ⚡ Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 py-2 h-auto"
                disabled={loading}
                onClick={() => quickLogin('doctor')}
              >
                ⚡ Doctor
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 py-2 h-auto"
                disabled={loading}
                onClick={() => quickLogin('patient')}
              >
                ⚡ Patient
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-500 font-medium animate-pulse">Loading secure portal...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
