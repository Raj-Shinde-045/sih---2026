'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname !== '/';

  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      await signOut(auth);
    } catch {}
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 glass">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800 hover:opacity-80 transition-opacity">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            TapCare <span className="text-blue-600">NFC</span>
          </span>
        </Link>

        {isDashboard && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
