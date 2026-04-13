import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PAGE_CONTACT_META_DESCRIPTION, SITE_DEFAULT_META_KEYWORDS } from '@/shared/seoPages';

const title = "Contact — Kraken's Den Studios";

export const metadata: Metadata = {
  title,
  description: PAGE_CONTACT_META_DESCRIPTION,
  keywords: [...SITE_DEFAULT_META_KEYWORDS],
  openGraph: {
    title,
    description: PAGE_CONTACT_META_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: PAGE_CONTACT_META_DESCRIPTION,
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
