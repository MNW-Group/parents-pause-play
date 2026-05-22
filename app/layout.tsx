import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.parentspauseandplay.com'),
  title: {
    default: "Parents, Pause & Play",
    template: "%s | Parents, Pause & Play"
  },
  description: "Gaming through parenthood. Actionable tips, parent-proof game reviews, and strategies.",
  openGraph: {
    title: "Parents, Pause & Play",
    description: "Gaming through parenthood. Actionable tips, parent-proof game reviews, and strategies.",
    url: "https://www.parentspauseandplay.com",
    siteName: "Parents, Pause & Play",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans bg-black text-white min-h-screen flex flex-col md:flex-row`}>
        
        {/* De Sidebar (Mobiel bovenaan, Desktop aan de zijkant) */}
        <Sidebar />
        
        {/* De Hoofd-content (die de rest van de ruimte opeist) */}
        <div className="flex-1 flex flex-col min-h-screen md:ml-80">
          
          <main className="flex-grow p-4 md:p-12">
            {children}
          </main>

          {/* Jouw strakke nieuwe Footer */}
          <footer className="w-full border-t border-gray-800 bg-brand-dark py-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-light">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Image 
                  src="/white-logo-clean-500x500-upscale-removebg.png" 
                  alt="Logo" 
                  width={48} 
                  height={48} 
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
                <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="font-bold text-brand-pink tracking-wider">PARENTS, PAUSE & PLAY</span>
                  <span>&copy; {new Date().getFullYear()} MNW Group. All rights reserved.</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <a href="mailto:info@parentspauseandplay.com" className="hover:text-brand-pink transition-colors font-bold tracking-wide">CONTACT</a>
                {/* Fix voor de Error: Verander <a> naar <Link> */}
                <Link href="/about" className="hover:text-brand-blue transition-colors font-bold tracking-wide">OUR STORY</Link>
              </div>
            </div>
          </footer>
          
          <ScrollToTop />
          <Analytics />
        </div>
      </body>
    </html>
  );
}