import type { Metadata } from "next";
import "./globals.css";
// Importeer je nieuwe component
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.parentspauseandplay.com'), // Vertelt Google dat dit jouw hoofddomein is
  title: {
    default: "Parents, Pause & Play",
    template: "%s | Parents, Pause & Play" // Zorgt dat je tabbladen er prachtig uit zien (bijv: "Pokemon Review | Parents, Pause...")
  },
  description: "Gaming through parenthood. Actionable tips, parent-proof game reviews, and strategies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Jouw originele body classes behouden */}
      <body className="bg-brand-black text-white antialiased font-sans flex flex-col md:flex-row min-h-screen">
        
        {/* Hier laadt hij jouw perfect ontworpen sidebar in (inclusief mobiele functionaliteit) */}
        <Sidebar />

        {/* MAIN CONTENT AREA: Schuift 80 eenheden op, exact zoals jij had gedefinieerd */}
        <div className="flex-1 md:ml-80 flex flex-col min-h-screen">
          {children}
        </div>

      </body>
    </html>
  );
}