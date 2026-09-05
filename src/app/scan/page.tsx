import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const cookieStore = await cookies();
  const role = cookieStore.get('sessionRole')?.value;

  if (!id) {
    redirect('/'); // Invalid NFC scan
  }

  if (!role) {
    // Scenario A: Stranger taps card (No active session)
    redirect('/');
  }

  if (role === 'doctor') {
    // Scenario B: Doctor taps card
    // In a real app, we'd redirect to an OTP verification route here:
    // redirect(`/doctor/verify-otp?patientId=${id}`);
    
    // For this prototype, we'll auto-verify and redirect to workspace to show the UI
    redirect(`/doctor/workspace/${id}`);
  }

  if (role === 'patient') {
    // Scenario C: Patient taps card (or logs in normally)
    redirect('/patient/dashboard');
  }

  if (role === 'admin') {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        <p className="text-slate-600 font-medium">Processing NFC Secure Token...</p>
      </div>
    </div>
  );
}
