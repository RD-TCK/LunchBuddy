import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'http://localhost:3001/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'POST');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'PATCH');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  return proxyRequest(request, slug, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  slug: string[],
  method: string,
) {
  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  const path = slug.join('/');
  // Preserve query params
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const targetUrl = `${API_BASE}/properties/${path}${queryString ? `?${queryString}` : ''}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  let body: string | undefined;
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      const json = await request.json();
      body = JSON.stringify(json);
      headers['Content-Type'] = 'application/json';
    } catch {
      // No body
    }
  }

  try {
    const response = await fetch(targetUrl, { method, headers, body });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || 'Request failed' },
        { status: response.status },
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
