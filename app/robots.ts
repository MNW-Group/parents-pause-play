import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Geldt voor alle bots (Google, Bing, ChatGPT)
      allow: '/',     // Ze mogen de hele site lezen...
      disallow: ['/studio/'], // ...BEHALVE je Sanity CMS (uit veiligheidsoverwegingen)
    },
    // We vertellen de bot direct waar hij de sitemap kan vinden
    sitemap: 'https://www.parentspauseandplay.com/sitemap.xml', 
  };
}