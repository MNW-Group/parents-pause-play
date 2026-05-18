'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Fix voor de TypeScript waarschuwing: we loggen de error nu op de achtergrond.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="p-6 md:p-12 lg:p-16 max-w-4xl mx-auto w-full font-sans text-white">
      
      {/* Consistentie: Back to Home link linksboven */}
      <Link href="/" className="text-brand-pink hover:text-brand-blue transition-colors mb-16 inline-block font-bold text-sm tracking-wider">
        ← BACK TO HOME
      </Link>
      
      <div className="flex flex-col items-center justify-center text-center pt-10">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-4">
          5<span className="animate-color-rotate">0</span>0
        </h1>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Connection <span className="animate-color-rotate">Lost</span>
        </h2>
        
        <p className="text-gray-400 max-w-md mx-auto text-lg font-light leading-relaxed mb-10">
          We encountered an unexpected error while loading this content. Our servers might be taking a nap.
        </p>
        
        {/* De knop in exact dezelfde stijl als de Hero knop op de homepage */}
        <button
          onClick={() => reset()}
          className="inline-block bg-brand-pink text-black hover:bg-brand-blue font-bold py-4 px-8 rounded-full transition-transform hover:-translate-y-1"
        >
          TRY AGAIN
        </button>
      </div>
    </main>
  );
}