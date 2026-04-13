'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Route } from '@/shared/Route';
import { usePathname } from 'next/navigation';
import { RiInstagramFill, RiTwitterFill, RiTiktokFill, RiMailFill } from 'react-icons/ri';
import EmotionJourney from './EmotionJourney';
import NewsletterForm from './NewsletterForm';
import { useLanguage } from '@/contexts/LanguageContext';

const randomizeQuote = (copies: string[]) => {
  return copies[Math.floor(Math.random() * copies.length)]
}

const Footer = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [showJourney, setShowJourney] = useState(false);


  const [randomNewsletterCopy, setRandomNewsletterCopy] = useState('');

  useEffect(() => {
    setRandomNewsletterCopy(randomizeQuote(t.footer.newsletterCopies));
  }, [t.footer.newsletterCopies]);

  const socialLinks = (
    <div className="h-full flex items-center w-full justify-evenly">
      <a href="https://www.instagram.com/krakensdenstudios/" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiInstagramFill className="h-8 w-8" />
      </a>

      <a href="mailto:help@krakensdenstudios.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiMailFill className="h-8 w-8" />
      </a>

      <a href="https://twitter.com/krakensdenstd" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTwitterFill className="h-8 w-8" />
      </a>

      <a href="https://tiktok.com/@krakensdenstudios" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTiktokFill className="h-8 w-8" />
      </a>
    </div>
  );

  return (
    <>
      {showJourney && <EmotionJourney onComplete={() => setShowJourney(false)} />}
      <footer className="w-full">
        <div className="relative w-full flex flex-col md:flex-row items-center justify-center pt-10 pb-1 bg-footer-mobile bg-no-repeat bg-bottom md:bg-footer-large md:bg-bottom md:bg-contain md:bg-repeat-x">
          <div className="md:w-1/2">
            <h1 className="text-gray text-center">
              <p className="text-4xl md:text-5xl lg:text-6xl font-lora">{t.footer.letTheKraken} <span className="font-bold">Kraken</span></p>
              <p className="text-4xl md:text-5xl lg:text-6xl mt-1 md:mt-0 font-lora">{t.footer.catchYou} <span className="font-bold">{t.footer.you}</span></p>
            </h1>
            <div className="xl:h-96 lg:h-48 md:h-48"></div>
            <div className="lg:h-48"></div>
          </div>

          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center" id="newsletter">
            <NewsletterForm variant="footer" />
            <div className="xl:h-96 lg:h-48 md:h-36 py-10 px-10">
              <p className="text-center">🐙 {randomNewsletterCopy}</p>
            </div>
            <div className="h-48 md:hidden"></div>
            <div className="lg:h-48 h-24 flex flex-col justify-bottom items-bottom">
              <div className="gap-8 items-end flex flex-wrap justify-center justify-bottom pt-3 md:pt-10">
                <Link href={Route.HOME}>
                  <p
                    className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${pathname === Route.HOME ? 'text-turquoise-400' : ''
                      }`}
                  >
                    {t.header.home}
                  </p>
                </Link>

                <Link href={Route.TEAM}>
                  <p
                    className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${pathname === Route.TEAM ? 'text-turquoise-400' : ''
                      }`}
                  >
                    {t.header.aboutUs}
                  </p>
                </Link>

                <Link href={Route.HEART_WEAVER}>
                  <p
                    className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${pathname === Route.HEART_WEAVER ? 'text-turquoise-400' : ''
                      }`}
                  >
                    {t.header.games}
                  </p>
                </Link>

                <Link href={Route.BLOG}>
                  <p
                    className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${pathname === Route.BLOG || pathname.startsWith(`${Route.BLOG}/`) ? 'text-turquoise-400' : ''
                      }`}
                  >
                    {t.header.blog}
                  </p>
                </Link>

                <Link href={Route.CONTACT}>
                  <p
                    className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${pathname === Route.CONTACT ? 'text-turquoise-400' : ''
                      }`}
                  >
                    {t.header.contact}
                  </p>
                </Link>
              </div>
              {socialLinks}
            </div>
          </div>
        </div>
        <div className="p-4 text-center">
          <p>{t.footer.copyright}</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
