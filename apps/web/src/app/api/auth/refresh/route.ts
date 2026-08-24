import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  try {
    const response = await fetch('http://localhost:3001/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = NextResponse.json({ message: 'Failed to refresh token' }, { status: 401 });
      errorResponse.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
      errorResponse.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
      return errorResponse;
    }

    const nextResponse = NextResponse.json({ success: true });

    nextResponse.cookies.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    // If a new refresh token is returned (rotation)
    if (data.refreshToken) {
      nextResponse.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

  } catch {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
