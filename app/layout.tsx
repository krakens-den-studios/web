import LayoutWrapper from '@/components/LayoutWrapper';
import { LanguageProvider } from '@/contexts/LanguageContext';
import type { Metadata } from 'next';
import { Lora, Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_DEFAULT_META_DESCRIPTION, SITE_DEFAULT_META_KEYWORDS } from '@/shared/seoPages';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--roboto'
});

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--lora'
});

export const metadata: Metadata = {
  title: "Kraken's Den Studios",
  description: SITE_DEFAULT_META_DESCRIPTION,
  keywords: [...SITE_DEFAULT_META_KEYWORDS],
  openGraph: {
    title: "Kraken's Den Studios",
    description: SITE_DEFAULT_META_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kraken's Den Studios",
    description: SITE_DEFAULT_META_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${lora.variable} font-roboto bg-black flex flex-col items-center`}>
        <LanguageProvider>
          <LayoutWrapper>
            <Toaster position="top-right" />
            {children}
          </LayoutWrapper>
          <SpeedInsights />
        </LanguageProvider>
      </body>
    </html>
  );
}
