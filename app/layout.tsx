import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const title = 'Türkçe Cümle Değerlendirme Çalışması';
const description = 'Bağlam içindeki Türkçe cümleleri değerlendirin.';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const trustedSiteUrl =
  configuredSiteUrl?.startsWith('https://')
    ? new URL(configuredSiteUrl.endsWith('/') ? configuredSiteUrl : `${configuredSiteUrl}/`)
    : undefined;
const socialImage = trustedSiteUrl ? new URL('og.png', trustedSiteUrl).toString() : undefined;

export const metadata: Metadata = {
  title,
  description,
  metadataBase: trustedSiteUrl,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    type: 'website',
    ...(socialImage ? { images: [{ url: socialImage, width: 1200, height: 630 }] } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    ...(socialImage ? { images: [socialImage] } : {}),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <head>
        <meta name="referrer" content="no-referrer" />
        <Script
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/experiment-config.js`}
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
