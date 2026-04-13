import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PAGE_TEAM_META_DESCRIPTION, SITE_DEFAULT_META_KEYWORDS } from '@/shared/seoPages';

const title = "Team — Kraken's Den Studios";

export const metadata: Metadata = {
  title,
  description: PAGE_TEAM_META_DESCRIPTION,
  keywords: [...SITE_DEFAULT_META_KEYWORDS],
  openGraph: {
    title,
    description: PAGE_TEAM_META_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: PAGE_TEAM_META_DESCRIPTION,
  },
};

export default function TeamLayout({ children }: { children: ReactNode }) {
  return children;
}
