
import { NextResponse } from 'next/server';
import { AuthAPI } from '@/lib/endpoints';

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const response = await AuthAPI.register(body);
    if (!response.success) {
      return NextResponse.json({ message: response.message }, { status: 400 });
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
