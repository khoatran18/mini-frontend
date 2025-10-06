
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Log to the server terminal with a clear prefix
    console.log('-- LOG FROM CLIENT --\n', JSON.stringify(body, null, 2), '\n-- END LOG --');
    return NextResponse.json({ success: true, message: "Logged successfully" });
  } catch (error) {
    console.error("[LOGGING API ERROR]: Failed to process log message.", error);
    // Avoid sending a response that could trigger another log, creating a loop
    return new Response(null, { status: 500 });
  }
}
