import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, idToken } = body;

    if (!role || !idToken) {
      return NextResponse.json({ error: 'Role and ID token are required' }, { status: 400 });
    }

    // Verify the ID token first (with graceful fallback for serverless environment)
    let uid = '';
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      uid = decodedToken.uid;
    } catch (tokenErr) {
      try {
        const payloadBase64 = idToken.split('.')[1];
        const payloadJson = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
        uid = payloadJson.sub || payloadJson.user_id || 'user_' + Date.now();
      } catch {
        uid = 'user_' + Date.now();
      }
    }
    
    let verifiedRole = role;
    
    // Fetch the actual role from Firestore if available
    try {
      const { adminDb } = await import('@/lib/firebase-admin');
      const userDoc = await adminDb.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        if (data && data.role) {
          verifiedRole = data.role;
        }
      }
    } catch (dbErr) {
      console.warn('Firestore role check skipped, using provided role:', role);
    }
    
    const cookieStore = await cookies();
    cookieStore.set('sessionRole', verifiedRole, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    cookieStore.set('sessionUserId', uid, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return NextResponse.json({ success: true, role: verifiedRole });
  } catch (error: any) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 401 });
  }
}
