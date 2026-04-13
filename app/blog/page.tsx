'use client';

import Link from 'next/link';
import { blogPosts } from '@/shared/blogPosts';
import { Route } from '@/shared/Route';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/i18n/translations';

function formatBlogDate(iso: string, lang: Language) {
  return new Date(iso + 'T12:00:00').toLocaleDateString(
    lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'ca-ES',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export default function BlogPage() {
  const { t, language } = useLanguage();
  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="relative w-full min-h-screen pt-28 md:pt-36 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
      <h1 className="font-lora text-4xl md:text-5xl font-bold text-turquoise-400 mb-3">{t.blog.title}</h1>
      <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl">{t.blog.subtitle}</p>

      {sorted.length === 0 ? (
        <p className="text-white/60">{t.blog.empty}</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {sorted.map((post) => (
            <li
              key={post.slug}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-6 md:p-8 transition-colors hover:border-turquoise-400/35"
            >
              <Link href={`${Route.BLOG}/${post.slug}`} className="group block">
                <h2 className="font-lora text-2xl md:text-3xl text-white group-hover:text-turquoise-400 transition-colors mb-2">
                  {post.title[language]}
                </h2>
              </Link>
              <time className="text-sm text-white/45" dateTime={post.date}>
                {formatBlogDate(post.date, language)}
              </time>
              <p className="text-white/80 mt-4 leading-relaxed">{post.excerpt[language]}</p>
              <Link
                href={`${Route.BLOG}/${post.slug}`}
                className="inline-block mt-5 text-turquoise-400 hover:text-turquoise-300 font-medium text-sm md:text-base"
              >
                {t.blog.readMore} →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
