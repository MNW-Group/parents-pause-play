import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="p-6 md:p-12 lg:p-16 max-w-4xl mx-auto w-full font-sans text-white">
      <Link href="/" className="text-brand-pink hover:text-brand-blue transition-colors mb-16 inline-block font-bold text-sm tracking-wider">
        ← BACK TO HOME
      </Link>
      
      <div className="flex flex-col items-center justify-center pt-10 text-center">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-4">
          4<span className="animate-color-rotate">0</span>4
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Game <span className="animate-color-rotate">Over</span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto text-lg font-light leading-relaxed">
          It looks like this save file got corrupted. The page you are looking for does not exist or has been moved.
        </p>
      </div>
    </main>
  );
}