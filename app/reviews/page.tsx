/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { client } from '@/sanity/lib/client';
import ReviewFilter from '@/components/ReviewFilter';

const REVIEWS_QUERY = `
  *[_type == "review"] | order(_updatedAt desc) {
    _id,
    title,
    excerpt,
    mainImage,
    "slug": slug.current,
    _updatedAt,
    "label": "REVIEW",
    genres,
    platforms,
    pausePlayFlexibility,
    pickUpPlayFactor,
    energyLevel,
    silentPlayability,
    contactNapFactor
  }
`;

export default async function ReviewsPage() {
  const allArticles = await client.fetch(REVIEWS_QUERY);

  return (
    <main className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full font-sans text-white">
      <header className="mb-16 border-b-2 border-gray-800 pb-12">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
          More <span className="animate-color-rotate">Reviews</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl font-light"> 
          Curious how we evaluate games for busy parents? Read everything about our methodology in the{' '}
          <Link 
            href="/how-we-rate" 
            className="!text-brand-pink hover:!text-brand-blue font-bold underline transition-none"
          >
            How We Rate Games: The Pause & Play Stats Guide
          </Link>
        </p>
      </header>

      <ReviewFilter allArticles={allArticles} />
    </main>
  );
}