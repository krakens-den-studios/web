'use client';

import { Route } from '@/shared/Route';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiMailFill } from 'react-icons/ri';

export default function Contact() {
  const { isPageUnlocked, isLoading } = useUnlockedPages();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const newsletterUnlocked = isPageUnlocked('newsletter');

  useEffect(() => {
    // If page is not unlocked, redirect to root (wait for loading to complete)
    if (!isLoading && !isPageUnlocked(Route.CONTACT)) {
      router.push('/');
    }
  }, [isLoading, isPageUnlocked, router]);

  // If page is not unlocked, don't show content
  if (isLoading || !isPageUnlocked(Route.CONTACT)) {
    return null;
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY || '',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          listIds: [2]
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative w-full h-fit">
      {/* First section: title and subtitle with black background */}
      <section className="relative w-full h-fit pt-32 md:pt-40 pb-20">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
          <div className="text-center mb-16">
            <h1 className="font-lora text-5xl md:text-6xl font-bold text-turquoise-400 mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto">
              Reach out to us or stay connected through our newsletter
            </p>
          </div>
        </div>
      </section>

      {/* Second section: contact info and newsletter with turquoise-800 background */}
      <section className="relative w-full h-fit bg-turquoise-800 pb-20">
        <div className="w-full max-w-4xl mx-auto px-8 md:px-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Email Contact */}
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 md:p-10 border-2 border-turquoise-400">
              <div className="flex items-center gap-4 mb-6">
                <RiMailFill className="text-turquoise-400 text-4xl" />
                <h2 className="font-lora text-3xl font-bold text-white">
                  Email
                </h2>
              </div>
              <a 
                href="mailto:krakensdenstudios@gmail.com"
                className="text-turquoise-300 text-lg md:text-xl hover:text-turquoise-200 transition-colors break-all"
              >
                krakensdenstudios@gmail.com
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 md:p-10 border-2 border-turquoise-400">
              <h2 className="font-lora text-3xl font-bold text-white mb-6">
                Newsletter
              </h2>
              {newsletterUnlocked ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="rounded-xl px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 focus:border-turquoise-400 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!email || isSubmitting || submitted}
                    className={`rounded-xl px-6 py-3 font-lora font-bold text-lg transition-all ${
                      submitted
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : email && !isSubmitting
                        ? 'bg-turquoise-400 hover:bg-turquoise-300 text-black cursor-pointer'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {submitted ? 'Subscribed!' : isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  {submitted && (
                    <p className="text-green-400 text-sm text-center">
                      Thank you for subscribing!
                    </p>
                  )}
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-300 text-lg mb-4">
                    Newsletter is locked
                  </p>
                  <p className="text-gray-400 text-sm">
                    Unlock the Newsletter in The Kraken&apos;s Treasure to subscribe.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

