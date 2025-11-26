'use client';

import Button from '@/components/Button';
import Points from '@/components/Points';
import EmotionJourney from '@/components/EmotionJourney';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import { games } from '@/shared/Games';
import { Route } from '@/shared/Route';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TiArrowSortedDown } from 'react-icons/ti';
import { scroller } from 'react-scroll';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [showJourney, setShowJourney] = useState(false);
  const [currentGame, setCurrentGame] = useState(0);
  const { unlockedPages, isPageUnlocked, isLoading } = useUnlockedPages();
  const router = useRouter();
  const isScrolled = useIsScrolled();

  // Wait for loading to complete before checking unlock status
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined' && !isPageUnlocked(Route.HOME)) {
      router.push('/');
    }
  }, [isLoading, isPageUnlocked, router]);

  // Don't render anything while loading or if not unlocked
  if (isLoading || (typeof window !== 'undefined' && !isPageUnlocked(Route.HOME))) {
    return null;
  }

  const onScrollClick = () => {
    window?.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  const scrollToNewsletter = () => {
    if (window) {
      scroller.scrollTo('newsletter', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      })
    }
  }

  const nextGame = () => {
    setCurrentGame(currentGame === games.length - 1 ? 0 : currentGame + 1);
  };

  const prevGame = () => {
    setCurrentGame(currentGame === 0 ? games.length - 1 : currentGame - 1);
  };

  return (
    <main className="relative w-full h-fit">
      {showJourney && <EmotionJourney onComplete={() => setShowJourney(false)} />}
      
      <section id="welcome" className="relative w-full h-screen md:h-[80vh] lg:h-[66vh] flex flex-col items-center">
        <div className="relative w-full h-1/2 lg:h-full">
          <Image
            src="/heartweaverCover.png"
            className="object-cover lg:object-[24vw] 3xl:object-contain 3xl:object-[38vw] select-none"
            alt="Heart Weaver cover"
            fill
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 lg:right-1/3 h-2/3 flex flex-col items-center gap-8">
          <div className="relative w-2/3 h-2/5">
            <Image src="/heartweaver.svg" className="max-w-sm m-auto select-none" fill alt="Heart Weaver title" />
          </div>

          <div className="relative w-fit flex flex-col items-center gap-8 lg:flex-row">
            {unlockedPages.games ? (
              <Link href={Route.HEART_WEAVER}>
                <Button label={t.home.explore}/>
              </Link>
            ) : (
              <div className="relative group">
                <button
                  disabled
                  className="bg-gray-600 relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl opacity-60 cursor-not-allowed"
                >
                  <p className="whitespace-nowrap text-xl font-lora font-bold text-white">{t.home.exploreLocked}</p>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {t.header.lockedGames}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                </div>
              </div>
            )}
            {unlockedPages.newsletter ? (
              <Button label={t.home.subscribe} onClick={scrollToNewsletter} />
            ) : (
              <div className="relative group">
                <button
                  disabled
                  className="bg-gray-600 relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl opacity-60 cursor-not-allowed"
                >
                  <p className="whitespace-nowrap text-xl font-lora font-bold text-white">{t.home.subscribeLocked}</p>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {t.footer.lockedNewsletterDesc}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                </div>
              </div>
            )}
          </div>

          <TiArrowSortedDown
            onClick={onScrollClick}
            className={`text-white duration-300 transition-opacity ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            } w-16 h-16 lg:hidden cursor-pointer hover:text-turquoise-400`}
          />
        </div>
      </section>

      <section className="relative w-full flex flex-col items-center h-fit gap-8 pb-20">
        <Points>
          <Image
            src="/logoColor.png"
            className="max-w-[50%] w-48"
            width={256}
            height={256}
            alt="Kraken's Den Studios logo "
          />
        </Points>

        <h2 className="font-lora text-4xl w-4/5 max-w-3xl text-center balanced">{t.home.welcomeHeart}</h2>

        <p className="text-2xl w-4/5 max-w-3xl text-center text-white balanced">
        {t.home.descriptionFull}
        </p>

        {unlockedPages.team ? (
          <Link href={Route.TEAM}>
            <Button label={t.home.meetUs} />
          </Link>
        ) : (
          <div className="relative group">
            <button
              disabled
              className="bg-gray-600 relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl opacity-60 cursor-not-allowed"
            >
              <p className="whitespace-nowrap text-xl font-lora font-bold text-white">{t.home.meetUsLocked}</p>
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {t.header.lockedTeam}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
            </div>
          </div>
        )}
      </section>

      <section id="games-section" className="relative w-full flex flex-col items-center h-fit gap-6 sm:gap-8 bg-turquoise-800 py-16 sm:py-20">
        <Points>
          <h2 className="font-lora text-4xl balanced">{t.home.krakensGames}</h2>
        </Points>

        <div className="relative w-full h-[24rem] sm:h-[28rem] flex items-center justify-center overflow-hidden px-2">
          <TiArrowSortedDown
            onClick={prevGame}
            className={`absolute z-20 left-0 rotate-90 text-black w-16 h-16 min-w-16 min-h-16 cursor-pointer hover:text-turquoise-400 mb-10 transition-opacity duration-300 ${
              currentGame === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            }`}
          />

          {games.map(({ name, link, imageSrc }, i) => (
            <div
              key={`${name}_${i}`}
              className={`absolute h-fit w-11/12 max-w-4xl grid grid-cols-1 grid-rows-[min-content_auto] gap-4 sm:gap-6 transition-all duration-300 ${
                currentGame === i
                  ? 'opacity-100 delay-200 z-10'
                  : currentGame > i
                  ? '-translate-x-36 opacity-0 pointer-events-none'
                  : 'translate-x-36 opacity-0 pointer-events-none'
              }`}
            >
              <div className="w-full justify-center flex relative pointer-events-none px-2 sm:px-6">
                <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-black/20 border border-white/10 min-h-[16rem] sm:min-h-[18rem]">
                  <Image
                    src={imageSrc}
                    className="select-none object-contain"
                    alt={`${name} cover`}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 50vw"
                    style={{ padding: '1rem' }}
                  />
                </div>
              </div>

              <div className="w-full h-fit relative flex items-center justify-center">
                {unlockedPages.games ? (
                  <Link href={link} className="w-fit">
                    <Button label={name} compact />
                  </Link>
                ) : (
                  <div className="relative group">
                    <button
                      disabled
                      className="bg-gray-600 relative w-48 py-3 px-4 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl opacity-60 cursor-not-allowed"
                    >
                      <p className="whitespace-nowrap text-xl font-lora font-bold text-white">{name} 🔒</p>
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {t.header.lockedGames}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <TiArrowSortedDown
            onClick={nextGame}
            className={`absolute z-20 right-0 -rotate-90 text-black w-16 h-16 min-w-16 min-h-16 cursor-pointer hover:text-turquoise-400 mb-10 transition-opacity duration-300 ${
              currentGame === games.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            }`}
          />
        </div>
      </section>
    </main>
  );
}

