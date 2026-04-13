import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  HEART_WEAVER_META_DESCRIPTION,
  HEART_WEAVER_META_KEYWORDS,
} from '@/shared/seoHeartWeaver';

export const metadata: Metadata = {
  title: "HeartWeaver — Kraken's Den Studios",
  description: HEART_WEAVER_META_DESCRIPTION,
  keywords: HEART_WEAVER_META_KEYWORDS,
  openGraph: {
    title: "HeartWeaver — Kraken's Den Studios",
    description: HEART_WEAVER_META_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "HeartWeaver — Kraken's Den Studios",
    description: HEART_WEAVER_META_DESCRIPTION,
  },
};

export default function HeartWeaverLayout({ children }: { children: ReactNode }) {
  return children;
}
