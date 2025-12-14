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
      
      <section id="welcome" className="relative w-full h-screen md:h-[80vh] lg:h-[66vh] flex flex-col items-center overflow-hidden">
        {/* Video de fons opcional - descomentar quan hi hagi video */}
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video> */}
        
        {/* Fons de color mentre la imatge carrega */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/50 to-black z-0" />
        
        {/* Imatge de fons - carrega darrere del contingut */}
        <div className="relative w-full h-1/2 lg:h-full z-0">
          <Image
            src="/heartweaverCover.png"
            className="object-cover lg:object-[24vw] 3xl:object-contain 3xl:object-[38vw] select-none"
            alt="Heart Weaver cover"
            fill
            priority
          />
          {/* Overlay per millorar llegibilitat del text */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 lg:via-transparent lg:to-black/40" />
        </div>

        {/* Contingut (logo i botons) - es mostra primer */}
        <div className="absolute bottom-0 left-0 right-0 lg:right-1/3 h-2/3 flex flex-col items-center gap-8 z-20">
          <div className="relative w-2/3 h-2/5">
            <Image src="/heartweaver.svg" className="max-w-sm m-auto select-none" fill alt="Heart Weaver title" />
          </div>

          <div className="relative w-fit flex flex-col items-center gap-8 lg:flex-row">
            {unlockedPages.games ? (
              <Link 
                href={Route.HEART_WEAVER}
              >
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
          <Link 
            href={Route.TEAM}
          >
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

        {/* Carousel millorat */}
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
              className={`absolute h-fit w-11/12 max-w-4xl grid grid-cols-1 grid-rows-[min-content_auto] gap-4 sm:gap-6 transition-all duration-500 ${
                currentGame === i
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="w-full justify-center flex relative pointer-events-none px-2 sm:px-6">
                <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-black/30 border-2 border-turquoise-400/30 hover:border-turquoise-400/60 transition-all min-h-[16rem] sm:min-h-[18rem] shadow-2xl">
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
                  <Link 
                    href={link} 
                    className="w-fit"
                  >
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

        {/* Indicadors del carousel */}
        {games.length > 1 && (
          <div className="flex gap-2 justify-center items-center">
            {games.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentGame(i)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  currentGame === i
                    ? 'bg-turquoise-400 w-8 sm:w-10'
                    : 'bg-turquoise-400/40 hover:bg-turquoise-400/60'
                }`}
                aria-label={`Go to game ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Gallery de Screenshots del Joc */}
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <h3 className="text-2xl sm:text-3xl font-lora font-bold text-center text-white mb-6 sm:mb-8">
            Explora el Món de HeartWeaver
          </h3>
          
          {/* Screenshots - placeholder amb imatges existents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              '/heartweaverCover.png',
              '/heartweaverThumbnail.png',
              '/heartweaverAce.png',
              '/heartweaverMark.png',
              '/heartweaverMark2.png',
              '/heartweaverMainImage.png'
            ].map((src, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer border-2 border-turquoise-400/20 hover:border-turquoise-400 transition-all hover:scale-105 bg-black/40"
              >
                <Image
                  src={src}
                  alt={`HeartWeaver Screenshot ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

