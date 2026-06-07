// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json({ results: [] });

  // 1. We knippen de query op in losse woorden en plakken overal een * achter
  // "fortnite guide" wordt -> ["fortnite*", "guide*"]
  const searchTerms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => `${word}*`);

  // Als er na filteren geen woorden overblijven
  if (searchTerms.length === 0) return NextResponse.json({ results: [] });

  // 2. We veranderen $q naar $terms. GROQ snapt dat hij nu elk los woord moet checken!
  const groqQuery = `
    *[_type in ["post", "article", "review", "page"] && (title match $terms || coalesce(excerpt, "") match $terms || pt::text(body) match $terms)] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      "label": select(
        _type == "review" => "REVIEW",
        _type == "post" => "ULTIMATE GUIDE",
        _type == "page" => "PAGE",
        coalesce(category->title, "ARTICLE")
      ),
      "score": select(title match $terms => 3, 0) + select(coalesce(excerpt, "") match $terms => 2, 0) + select(pt::text(body) match $terms => 1, 0)
    } | order(score desc)[0...10]
  `;

  try {
    // We geven de array van termen mee aan de query
    const results = await client.fetch(groqQuery, { terms: searchTerms });
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}