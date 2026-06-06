// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json({ results: [] });

  // GROQ query: Zoek in titel, excerpt, EN de platte tekst van de body
  const groqQuery = `
    *[_type in ["post", "article", "review"] && (title match $q || excerpt match $q || pt::text(body) match $q)] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      "label": select(
        _type == "review" => "REVIEW",
        _type == "post" => "ULTIMATE GUIDE",
        coalesce(category->title, "ARTICLE")
      )
    }[0...10]
  `;

  const results = await client.fetch(groqQuery, { q: `${query}*` });
  return NextResponse.json({ results });
}