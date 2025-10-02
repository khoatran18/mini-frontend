import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">403 - Unauthorized</h1>
      <p className="text-lg mt-4">You do not have permission to view this page.</p>
      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        Go to Dashboard
      </Link>
    </div>
  );
}
