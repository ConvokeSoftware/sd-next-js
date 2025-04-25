import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
