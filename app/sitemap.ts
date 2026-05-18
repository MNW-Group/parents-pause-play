/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.parentspauseandplay.com'; // Jouw live domein

  // 1. Haal alle dynamische URL's (artikelen, reviews, etc.) uit Sanity
  const query = `*[_type in ["post", "article", "review", "page"]] { "slug": slug.current, _updatedAt }`;
  const sanityPages = await client.fetch(query);

  // 2. Definieer je statische, vaste routes
  const staticRoutes = ['', '/articles', '/reviews', '/guides', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8, // De homepage (route '') heeft de hoogste prioriteit (1.0)
  }));

  // 3. Bouw de dynamische routes op
  const dynamicRoutes = sanityPages.map((page: any) => ({
    url: page.slug === 'about' ? `${baseUrl}/about` : `${baseUrl}/${page.slug}`,
    lastModified: new Date(page._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6, // Individuele artikelen hebben standaard prioriteit
  }));

  // Voeg ze samen en stuur ze naar de zoekmachine
  return [...staticRoutes, ...dynamicRoutes];
}