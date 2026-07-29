'use client';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center text-black">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={() => reset()} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">
        Try again
      </button>
    </div>
  );
}