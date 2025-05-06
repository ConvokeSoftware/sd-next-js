import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTagManager } from '@next/third-parties/google';
import { ThemeProvider } from '@/components/theme-provider';
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    default: 'NextJS Chakra Template',
    template: '%s | NextJS Chakra Template', // For nested pages
  },
  description:
    'Modern Next.js + Chakra UI template for rapid web development with best practices built-in',
  keywords: ['Next.js', 'React', 'Chakra UI', 'Template', 'Web Development', 'TypeScript'],
  authors: [{ name: 'Neelesh Joshi', url: 'https://yourwebsite.com' }],
  creator: 'Neelesh Joshi',
  publisher: 'Convoke Software',
  applicationName: 'NextJS Chakra Template',
  generator: 'Next.js',
  // referrer: 'origin-when-cross-origin',
  // colorScheme: 'dark light',
  // viewport: {
  //   width: 'device-width',
  //   initialScale: 1,
  //   maximumScale: 1,
  // },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     'max-video-preview': -1,
  //     'max-image-preview': 'large',
  //     'max-snippet': -1,
  //   },
  // },
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  //   other: {
  //     rel: 'apple-touch-icon-precomposed',
  //     url: '/apple-touch-icon-precomposed.png',
  //   },
  // },
  // manifest: '/site.webmanifest',
  // openGraph: {
  //   type: 'website',
  //   locale: 'en_US',
  //   url: process.env.NEXT_PUBLIC_DOMAIN,
  //   title: 'NextJS Chakra Template',
  //   description:
  //     'Modern Next.js + Chakra UI template for rapid web development with best practices built-in',
  //   siteName: 'NextJS Chakra Template',
  //   images: [
  //     {
  //       url: `${process.env.NEXT_PUBLIC_DOMAIN}/og-image.jpg`,
  //       width: 1200,
  //       height: 630,
  //       alt: 'NextJS Chakra Template Preview',
  //     },
  //   ],
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'NextJS Chakra Template',
  //   description:
  //     'Modern Next.js + Chakra UI template for rapid web development with best practices built-in',
  //   creator: '@yourtwitterhandle',
  //   images: [`${process.env.NEXT_PUBLIC_DOMAIN}/twitter-image.jpg`],
  // },
  // verification: {
  //   google: 'your-google-site-verification',
  //   yandex: 'your-yandex-verification',
  //   yahoo: 'your-yahoo-verification',
  //   other: {
  //     'facebook-domain-verification': 'your-facebook-domain-verification',
  //   },
  // },
  // alternates: {
  //   canonical: process.env.NEXT_PUBLIC_DOMAIN,
  //   languages: {
  //     'en-US': '/en-US',
  //     'es-ES': '/es',
  //   },
  // },
  // archives: [`${process.env.NEXT_PUBLIC_DOMAIN}/blog`],
  // bookmarks: [`${process.env.NEXT_PUBLIC_DOMAIN}/features`],
  category: 'technology',
  classification: 'Development Tools',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <GoogleAnalytics gaId="G-XXXXXXXX" /> {/* Replace with your GA4 ID */}
        <GoogleTagManager gtmId="GTM-XXXXXXX" /> {/* Replace with your GTM ID */}
      </body>
    </html>
  );
}
