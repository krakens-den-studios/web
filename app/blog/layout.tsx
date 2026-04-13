import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PAGE_BLOG_META_DESCRIPTION, SITE_DEFAULT_META_KEYWORDS } from '@/shared/seoPages';

const title = "Blog — Kraken's Den Studios";

export const metadata: Metadata = {
  title,
  description: PAGE_BLOG_META_DESCRIPTION,
  keywords: [...SITE_DEFAULT_META_KEYWORDS, 'blog', 'devlog', 'game development'],
  openGraph: {
    title,
    description: PAGE_BLOG_META_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: PAGE_BLOG_META_DESCRIPTION,
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
