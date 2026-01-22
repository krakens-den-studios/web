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
import { SiSteam, SiKickstarter } from 'react-icons/si';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [showJourney, setShowJourney] = useState(false);
  const [currentGame, setCurrentGame] = useState(0);
  const { unlockedPages, isLoading } = useUnlockedPages();
  const isScrolled = useIsScrolled();

  const onScrollClick = () => {
    window?.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };


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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
        >
          <source src="/hero-heartweaver.mp4" type="video/mp4" />
        </video>

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
            {true ? (
              <Link
                href={Route.HEART_WEAVER}
              >
                <Button label={t.home.explore} />
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
            <Link href={Route.CONTACT}>
              <Button label={t.home.subscribe} />
            </Link>
          </div>

          <TiArrowSortedDown
            onClick={onScrollClick}
            className={`text-white duration-300 transition-opacity ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
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

        <Link
          href={Route.TEAM}
        >
          <Button label={t.home.meetUs} />
        </Link>
      </section>

      <section id="games-section" className="relative w-full flex flex-col items-center h-fit gap-6 sm:gap-8 bg-turquoise-800 py-16 sm:py-20">
        {/* <Points>
          <h2 className="font-lora text-4xl balanced">{t.home.krakensGames}</h2>
        </Points> */}

        {/* Carousel millorat */}
        <div className="relative w-full min-h-[800px] sm:min-h-[900px] flex items-center justify-center overflow-visible px-2 py-8">
          <TiArrowSortedDown
            onClick={prevGame}
            className={`absolute z-20 left-0 rotate-90 text-black w-16 h-16 min-w-16 min-h-16 cursor-pointer hover:text-turquoise-400 transition-opacity duration-300 ${currentGame === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
              }`}
          />

          {games.map(({ name, link, videoSrc, steamLink, kickstarterLink }, i) => (
            <div
              key={`${name}_${i}`}
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 sm:gap-8 transition-all duration-500 py-8 ${currentGame === i
                ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
              {/* Game Name */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-lora font-bold text-white text-center">
                {name}
              </h3>

              {/* Video */}
              {videoSrc ? (
                <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border-2 border-turquoise-400/30 shadow-2xl bg-black/40">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : null}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <Link href={link} className="w-fit">
                  <Button label={t.home.learnMore} />
                </Link>
                {steamLink && (
                  <a
                    href={steamLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit"
                  >
                    <button className="bg-[#171a21] hover:bg-[#1b2838] w-14 h-14 rounded-2xl border-none select-none flex items-center justify-center outline-none transition-colors duration-200">
                      <SiSteam className="w-8 h-8 text-white" />
                    </button>
                  </a>
                )}
                {kickstarterLink && (
                  <a
                    href={kickstarterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit"
                  >
                    <button className="bg-[#2bde73] hover:bg-[#25c865] w-14 h-14 rounded-2xl border-none select-none flex items-center justify-center outline-none transition-colors duration-200">
                      <SiKickstarter className="w-8 h-8 text-white" />
                    </button>
                  </a>
                )}
              </div>
            </div>
          ))}

          <TiArrowSortedDown
            onClick={nextGame}
            className={`absolute z-20 right-0 -rotate-90 text-black w-16 h-16 min-w-16 min-h-16 cursor-pointer hover:text-turquoise-400 transition-opacity duration-300 ${currentGame === games.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
              }`}
          />
        </div>

        {/* Indicadors del carousel */}
        {games.length > 1 && (
          <div className="flex gap-2 justify-center items-center mt-8">
            {games.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentGame(i)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${currentGame === i
                  ? 'bg-turquoise-400 w-8 sm:w-10'
                  : 'bg-turquoise-400/40 hover:bg-turquoise-400/60'
                  }`}
                aria-label={`Go to game ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

