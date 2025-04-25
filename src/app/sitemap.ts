import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

  return [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ];
}
