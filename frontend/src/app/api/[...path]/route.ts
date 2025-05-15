import { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${API_BASE_URL}/api/${path.join('/')}`;
  
  const response = await fetch(url, {
    headers: request.headers,
  });

  return response;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${API_BASE_URL}/api/${path.join('/')}`;
  
  const body = await request.text();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...Object.fromEntries(request.headers.entries()),
    },
    body,
  });

  return response;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${API_BASE_URL}/api/${path.join('/')}`;
  
  const body = await request.text();
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...Object.fromEntries(request.headers.entries()),
    },
    body,
  });

  return response;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${API_BASE_URL}/api/${path.join('/')}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: request.headers,
  });

  return response;
}
