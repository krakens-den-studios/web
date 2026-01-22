'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Route } from '@/shared/Route';
import { usePathname } from 'next/navigation';
import { RiInstagramFill, RiTwitterFill, RiTiktokFill, RiMailFill, RiLockLine } from 'react-icons/ri';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import EmotionJourney from './EmotionJourney';
import NewsletterForm from './NewsletterForm';
import { useLanguage } from '@/contexts/LanguageContext';

const randomizeQuote = (copies: string[]) => {
  return copies[Math.floor(Math.random() * copies.length)]
}

const Footer = () => {
  const pathname = usePathname();
  const { isPageUnlocked } = useUnlockedPages();
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
              <div className="gap-8 items-end flex justify-bottom pt-3 md:pt-10">
                {isPageUnlocked(Route.HOME) ? (
                  <Link
                    href={Route.HOME}
                  >
                    <p
                      className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${pathname === Route.HOME ? 'text-turquoise-400' : ''
                        }`}
                    >
                      {t.header.home}
                    </p>
                  </Link>
                ) : (
                  <div className="relative group">
                    <span className="text-gray-300 text-md md:text-xl font-light md:font-medium flex items-center gap-2 cursor-not-allowed">
                      {t.header.home} <RiLockLine className="w-4 h-4" />
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {t.header.lockedHome}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                    </div>
                  </div>
                )}

                {isPageUnlocked(Route.TEAM) ? (
                  <Link
                    href={Route.TEAM}
                  >
                    <p
                      className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${pathname === Route.TEAM ? 'text-turquoise-400' : ''
                        }`}
                    >
                      {t.header.aboutUs}
                    </p>
                  </Link>
                ) : (
                  <div className="relative group">
                    <span className="text-gray-300 text-md md:text-xl font-light md:font-medium flex items-center gap-2 cursor-not-allowed">
                      {t.header.aboutUs} <RiLockLine className="w-4 h-4" />
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {t.header.lockedTeam}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                    </div>
                  </div>
                )}

                {isPageUnlocked(Route.HEART_WEAVER) ? (
                  <Link
                    href={Route.HEART_WEAVER}
                  >
                    <p
                      className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${pathname === Route.HEART_WEAVER ? 'text-turquoise-400' : ''
                        }`}
                    >
                      {t.header.games}
                    </p>
                  </Link>
                ) : (
                  <div className="relative group">
                    <span className="text-gray-300 text-md md:text-xl font-light md:font-medium flex items-center gap-2 cursor-not-allowed">
                      {t.header.games} <RiLockLine className="w-4 h-4" />
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {t.header.lockedGames}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                    </div>
                  </div>
                )}
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
