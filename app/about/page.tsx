/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
// === 1. IMPORTS TOEVOEGEN VOOR AFBEELDINGEN & SEO ===
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Metadata } from 'next'; 

const animateLastWord = (text: string) => {
  if (!text || typeof text !== 'string') return text;
  const words = text.trim().split(' ');
  if (words.length === 1) return <span className="animate-color-rotate">{text}</span>;
  const lastWord = words.pop();
  return (
    <>
      {words.join(' ')} <span className="animate-color-rotate">{lastWord}</span>
    </>
  );
};

// === 2. QUERY UPDATEN: Voeg mainImage toe ===
const ABOUT_QUERY = `
  *[_type == "page" && slug.current == "about"][0] {
    title,
    body,
    mainImage
  }
`;

// === 3. DYNAMISCHE SEO & META-DATA ===
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await client.fetch(ABOUT_QUERY);
  
  if (!pageData) return {};

  return {
    title: `${pageData.title} | Parents, Pause & Play`,
    description: "Read our story. How we rate games and balance our hobbies with parenthood.",
    openGraph: {
      title: `${pageData.title} | Parents, Pause & Play`,
      description: "Read our story. How we rate games and balance our hobbies with parenthood.",
      images: pageData.mainImage ? [urlFor(pageData.mainImage).width(1200).height(630).url()] : [],
    },
  };
}

export default async function AboutPage() {
  const pageData = await client.fetch(ABOUT_QUERY);

  if (!pageData) {
    notFound(); 
  }

  const portableTextComponents = {
    marks: {
      internalLink: ({ value, children }: any) => {
        if (!value?.slug) return <>{children}</>;
        return (
          <a href={`/${value.slug}`} className="!text-brand-pink hover:!text-brand-blue font-bold underline transition-none">
            {children}
          </a>
        );
      },
    },
    block: {
      h2: ({ value }: any) => {
        const plainText = value.children.map((child: any) => child.text).join('');
        return <h2 className="text-3xl md:text-4xl font-black mt-16 mb-2">{animateLastWord(plainText)}</h2>;
      },
      h3: ({ value }: any) => {
        const plainText = value.children.map((child: any) => child.text).join('');
        return <h3 className="text-2xl font-bold mt-12 mb-2">{animateLastWord(plainText)}</h3>;
      }
    }
  };

  return (
    <main className="p-6 md:p-12 lg:p-16 max-w-4xl mx-auto w-full font-sans text-white">
      <article>
        <Link href="/" className="text-gray-500 hover:text-white transition-colors mb-8 inline-block font-bold text-sm tracking-wider">
          ← BACK TO HOME
        </Link>
        <header className="mb-12 border-b-2 border-gray-800 pb-8">
          
          {/* === AFBEELDING INLADEN === */}
          {pageData.mainImage && (
            <div className="relative w-full aspect-[1200/630] mb-8 rounded-3xl overflow-hidden border border-gray-800/50 shadow-2xl">
              <Image
                src={urlFor(pageData.mainImage).url()}
                alt={pageData.title} 
                fill 
                className="object-cover"
                priority 
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            Our <span className="animate-color-rotate">Story</span>
          </h1>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-p:font-light">
          <PortableText value={pageData.body} components={portableTextComponents} />
        </div>
      </article>
    </main>
  );
}