import { NextRequest, NextResponse } from 'next/server';
import { supabaseBrowser } from '@/lib/supabase-browser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      session: data.session,
      user: { id: data.user?.id, email: data.user?.email },
    });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE() {
  await supabaseBrowser.auth.signOut();
  return NextResponse.json({ success: true });
}
