import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('sessionRole')?.value;
    
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // 1. Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Add the user to the Firestore users collection with the 'doctor' role
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      name,
      role: 'doctor',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Doctor registered successfully' });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
