'use client';

import { RiMailFill } from 'react-icons/ri';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsletterForm from '@/components/NewsletterForm';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <main className="relative w-full h-fit">
      {/* First section: title and subtitle with black background */}
      <section className="relative w-full h-fit pt-32 md:pt-40 pb-20">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
          <div className="text-center mb-16">
            <h1 className="font-lora text-5xl md:text-6xl font-bold text-turquoise-400 mb-6">
              {t.contact.title}
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto">
              {t.contact.subtitle}
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
                  {t.contact.email}
                </h2>
              </div>
              <a
                href="mailto:help@krakensdenstudios.com"
                className="text-turquoise-300 text-lg md:text-xl hover:text-turquoise-200 transition-colors break-all"
              >
                help@krakensdenstudios.com
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-black bg-opacity-40 rounded-2xl p-8 md:p-10 border-2 border-turquoise-400">
              <h2 className="font-lora text-3xl font-bold text-white mb-6">
                {t.contact.newsletter}
              </h2>
              <NewsletterForm variant="contact" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

