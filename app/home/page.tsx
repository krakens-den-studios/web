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
import { useState } from 'react';
import { TiArrowSortedDown } from 'react-icons/ti';
import { scroller } from 'react-scroll';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showJourney, setShowJourney] = useState(false);
  const [currentGame, setCurrentGame] = useState(0);
  const { unlockedPages, isPageUnlocked } = useUnlockedPages();
  const router = useRouter();
  const isScrolled = useIsScrolled();

  // If page is not unlocked, redirect to root
  if (typeof window !== 'undefined' && !isPageUnlocked(Route.HOME)) {
    router.push('/');
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
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 lg:right-1/3 h-2/3 flex flex-col items-center gap-8">
          <div className="relative w-2/3 h-2/5">
            <Image src="/heartweaver.svg" className="max-w-sm m-auto select-none" fill alt="Heart Weaver title" />
          </div>

          <div className="relative w-fit flex flex-col items-center gap-8 lg:flex-row">
            {unlockedPages.games ? (
              <Link href={Route.HEART_WEAVER}>
                <Button label="EXPLORE"/>
              </Link>
            ) : (
              <div className="relative group">
                <button
                  disabled
                  className="bg-gray-600 relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl opacity-60 cursor-not-allowed"
                >
                  <p className="whitespace-nowrap text-xl font-lora font-bold text-white">EXPLORE 🔒</p>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Locked. Get &quot;Games Page&quot; in The Kraken&apos;s Treasure (500 Krakenlings) to access all therapies and experiences in one place.
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                </div>
              </div>
            )}
            {unlockedPages.newsletter ? (
              <Button label="SUBSCRIBE" onClick={scrollToNewsletter} />
            ) : (
              <div className="relative group">
                <button
                  disabled
                  className="bg-gray-600 relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl opacity-60 cursor-not-allowed"
                >
                  <p className="whitespace-nowrap text-xl font-lora font-bold text-white">SUBSCRIBE 🔒</p>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Locked. Get &quot;Newsletter&quot; in The Kraken&apos;s Treasure (2000 Krakenlings) to receive soft, story-driven updates.
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

        <h2 className="font-lora text-4xl w-4/5 max-w-3xl text-center balanced">Welcome to the Heart of the Den</h2>

        <p className="text-2xl w-4/5 max-w-3xl text-center text-white balanced">
        You’re deep under the surface now – in a place where stories, emotions, and games are all tangled together like drifting seaweed.
        </p>

        <p className="text-2xl w-4/5 max-w-3xl text-center text-white balanced">
        Explore the site, collect wandering Krakenlings, and spend them in The Kraken’s Treasure to unlock new pages, therapies, and helpers. The more you dare to play, the more the den reveals itself to you.
        </p>

        <p className="text-2xl w-4/5 max-w-3xl text-center text-white balanced">
        There is no rush and no “right way” to play here. This den is meant to be a soft place to land when your feelings feel too big, too messy, or too heavy to carry alone.
        </p>

        {unlockedPages.team ? (
          <Link href={Route.TEAM}>
            <Button label="MEET US!" />
          </Link>
        ) : (
          <div className="relative group">
            <button
              disabled
              className="bg-gray-600 relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl opacity-60 cursor-not-allowed"
            >
              <p className="whitespace-nowrap text-xl font-lora font-bold text-white">MEET US! 🔒</p>
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Locked. Get &quot;About Us&quot; in The Kraken&apos;s Treasure (1000 Krakenlings) to meet the team.
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
            </div>
          </div>
        )}
      </section>

      <section id="games-section" className="relative w-full flex flex-col items-center h-fit gap-8 bg-turquoise-800 py-20">
        <Points>
          <h2 className="font-lora text-4xl balanced">{"Kraken's Games"}</h2>
        </Points>

        <div className="relative w-full h-screen max-h-[30rem] flex items-center justify-center overflow-hidden">
          <TiArrowSortedDown
            onClick={prevGame}
            className={`absolute z-20 left-0 rotate-90 text-black w-16 h-16 min-w-16 min-h-16 cursor-pointer hover:text-turquoise-400 mb-10 transition-opacity duration-300 ${
              currentGame === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            }`}
          />

          {games.map(({ name, link, imageSrc }, i) => (
            <div
              key={`${name}_${i}`}
              className={`absolute h-fit w-4/5 max-w-4/5 grid grid-cols-1 grid-rows-[min-content_4rem] gap-8 transition-all duration-300 ${
                currentGame === i
                  ? 'opacity-100 delay-200 z-10'
                  : currentGame > i
                  ? '-translate-x-36 opacity-0 pointer-events-none'
                  : 'translate-x-36 opacity-0 pointer-events-none'
              }`}
            >
              <div className="w-full justify-center flex relative h-full pointer-events-none">
                <Image
                  src={imageSrc}
                  className="select-none object-contain max-h-[24rem]"
                  alt={`${name} cover`}
                  height={252}
                  width={451}
                />
              </div>

              <div className="w-full h-fit relative flex items-center justify-center">
                {unlockedPages.games ? (
                  <Link href={link} className="w-fit">
                    <Button label={name} />
                  </Link>
                ) : (
                  <div className="relative group">
                    <button
                      disabled
                      className="bg-gray-600 relative w-56 py-4 px-6 border-none select-none flex items-center justify-center h-fit outline-none rounded-2xl opacity-60 cursor-not-allowed"
                    >
                      <p className="whitespace-nowrap text-xl font-lora font-bold text-white">{name} 🔒</p>
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Locked. Get &quot;Games Page&quot; in The Kraken&apos;s Treasure (500 Krakenlings) to access all therapies and experiences in one place.
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

