import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostPageClient from '@/components/BlogPostPageClient';
import { blogPostSlugs, getPostBySlug } from '@/shared/blogPosts';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return blogPostSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Blog — Kraken's Den Studios" };
  }
  const title = `${post.title.en} — Blog | Kraken's Den Studios`;
  return {
    title,
    description: post.excerpt.en,
    openGraph: {
      title: post.title.en,
      description: post.excerpt.en,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.en,
      description: post.excerpt.en,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }
  return <BlogPostPageClient post={post} />;
}
