import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PAGE_HOME_META_DESCRIPTION, SITE_DEFAULT_META_KEYWORDS } from '@/shared/seoPages';

const title = "Home — Kraken's Den Studios";

export const metadata: Metadata = {
  title,
  description: PAGE_HOME_META_DESCRIPTION,
  keywords: [...SITE_DEFAULT_META_KEYWORDS],
  openGraph: {
    title,
    description: PAGE_HOME_META_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: PAGE_HOME_META_DESCRIPTION,
  },
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return children;
}
