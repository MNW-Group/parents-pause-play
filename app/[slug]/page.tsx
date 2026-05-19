/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Metadata } from 'next'; // Nodig voor de SEO/WhatsApp kaartjes

// === 1. DYNAMISCHE SEO & META-DATA (Voor WhatsApp, Twitter & Google) ===
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  // We trekken een "lichte" versie van het artikel uit Sanity, puur voor de meta-data
  const meta = await client.fetch(`
    *[_type in ["post", "article", "review", "page"] && slug.current == $slug][0] {
      title,
      excerpt,
      mainImage
    }
  `, { slug: resolvedParams.slug });

  if (!meta) return {};

  return {
    title: `${meta.title} | Parents, Pause & Play`,
    description: meta.excerpt || "Actionable tips, parent-proof game reviews, and strategies to balance hobbies with parenthood.",
    openGraph: {
      title: meta.title,
      description: meta.excerpt || "Read our latest guide on gaming through parenthood.",
      images: meta.mainImage ? [urlFor(meta.mainImage).width(1200).height(630).url()] : [],
    },
  };
}

// === 2. HELPER FUNCTIE (Kleur-animatie) ===
const animateLastWord = (text: string) => {
  if (!text || typeof text !== 'string') return text;
  const words = text.trim().split(' ');
  if (words.length === 1) return <span className="animate-color-rotate">{text}</span>;
  const lastWord = words.pop();
  return (
    <>{words.join(' ')} <span className="animate-color-rotate">{lastWord}</span></>
  );
};

// === 3. DATABASE QUERY ===
const ARTICLE_QUERY = `
  *[_type in ["post", "article", "review", "page"] && slug.current == $slug][0] {
    _id,
    _type,
    title,
    _updatedAt,
    mainImage,
    "label": select(
      _type == "review" => "REVIEW",
      _type == "post" => "ULTIMATE GUIDE",
      coalesce(category->title, "PAGE")
    ),
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => { "slug": reference->slug.current }
      }
    }
  }
`;

export default async function ArticlePage({ 
  params, 
  searchParams // FIX: We vangen de URL parameters op
}: { 
  params: Promise<{ slug: string }>,
  searchParams?: Promise<{ ref?: string }> // TypeScript definitie
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const resolvedSearch = await searchParams; // Pak de zoekparameters uit
  const ref = resolvedSearch?.ref;

  if (!slug) notFound();
  const article = await client.fetch(ARTICLE_QUERY, { slug });
  if (!article) notFound();

  // === 4. CONTEXTUELE TERUGKNOP LOGICA ===
  let backLink = "/articles";
  let backText = "ARTICLES";

  // Als de gebruiker vanaf de homepage komt, stuur ze terug naar home!
  if (ref === 'home') {
    backLink = "/";
    backText = "HOME";
  } else {
    // Zo niet, gebruik de standaard logica
    if (article._type === "review") {
      backLink = "/reviews";
      backText = "REVIEWS";
    } else if (article._type === "post") {
      backLink = "/guides";
      backText = "GUIDES";
    }
  }

  // === 5. PORTABLE TEXT CONFIGURATIE ===
  const portableTextComponents = {
    // NIEUW: Hier vertellen we hoe afbeeldingen getekend moeten worden
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <div className="relative w-full aspect-video my-8 rounded-2xl overflow-hidden bg-[#0a0a0a]">
            <Image
              src={urlFor(value).width(1000).height(563).url()}
              alt={value.alt || "Parents Pause and Play afbeelding"} 
              fill
              className="object-cover"
            />
          </div>
        );
      },
    },
    // BESTAAND: Jouw bestaande links en koppen
    marks: {
      internalLink: ({ value, children }: any) => {
        if (!value?.slug) return <>{children}</>;
        return (
          <Link href={`/${value.slug}`} className="!text-brand-pink hover:!text-brand-blue font-bold underline transition-none">
            {children}
          </Link>
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
      
      {/* De slimme navigatieknop */}
      <Link href={backLink} className="text-gray-500 hover:text-white transition-colors mb-8 inline-block font-bold text-sm tracking-wider">
        ← BACK TO {backText}
      </Link>

      <article>
        <header className="mb-12 border-b-2 border-gray-800 pb-8">
          
          {/* Label en Datum verborgen op algemene pagina's */}
          {article._type !== 'page' && (
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="text-brand-pink font-mono tracking-wider uppercase font-bold">
                {article.label}
              </span>
              <span className="text-gray-600">|</span>
              <time dateTime={article._updatedAt} className="text-gray-500 font-light">
                Laatst geüpdatet: {new Date(article._updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
          )}
          
          {/* SEO Geoptimaliseerde Hero Image */}
          {article.mainImage && (
            <div className="relative w-full aspect-[1200/630] mb-8 rounded-3xl overflow-hidden border border-gray-800/50 shadow-2xl">
              <Image
                src={urlFor(article.mainImage).url()}
                alt={article.title} 
                fill 
                className="object-cover"
                priority 
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            {animateLastWord(article.title)}
          </h1>
        </header>

        {/* De Review Disclaimer (Alleen zichtbaar bij reviews) */}
        {article._type === 'review' && (
          <div className="mb-10 p-5 bg-[#111] border-l-4 border-brand-blue rounded-r-xl">
            <p className="text-gray-300 font-light text-sm md:text-base">
              Curious how we evaluate games for busy parents? Read everything about our methodology in the{' '}
              <Link href="/how-we-rate-games" className="!text-brand-pink hover:!text-brand-blue font-bold underline transition-none">
                How We Rate Games: Pause & Play Stats
              </Link> guide.
            </p>
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none prose-p:font-light">
          <PortableText value={article.body} components={portableTextComponents} />
        </div>
      </article>

    </main>
  );
}