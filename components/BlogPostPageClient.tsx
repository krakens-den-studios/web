'use client';

import Link from 'next/link';
import type { BlogPost } from '@/shared/blogPosts';
import { Route } from '@/shared/Route';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/i18n/translations';

function formatBlogDate(iso: string, lang: Language) {
  return new Date(iso + 'T12:00:00').toLocaleDateString(
    lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'ca-ES',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export default function BlogPostPageClient({ post }: { post: BlogPost }) {
  const { t, language } = useLanguage();
  const paragraphs = post.content[language];

  return (
    <main className="relative w-full min-h-screen pt-28 md:pt-36 pb-20 px-6 md:px-12">
      <article className="max-w-3xl mx-auto">
        <Link
          href={Route.BLOG}
          className="inline-block text-turquoise-400 hover:text-turquoise-300 text-sm md:text-base font-medium mb-8"
        >
          {t.blog.backToList}
        </Link>

        <header className="mb-10">
          <h1 className="font-lora text-3xl md:text-5xl font-bold text-white leading-tight">{post.title[language]}</h1>
          <time className="mt-4 block text-sm text-white/50" dateTime={post.date}>
            {formatBlogDate(post.date, language)}
          </time>
        </header>

        <div className="flex flex-col gap-5 text-white/90 text-base md:text-lg leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
