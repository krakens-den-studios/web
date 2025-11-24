'use client';

import Title from '@/components/Title';
import EmotionJourney from '@/components/EmotionJourney';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { scroller } from 'react-scroll';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '@/shared/Route';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeartWeaver() {
  const { t } = useLanguage();
  const [showJourney, setShowJourney] = useState(false);
  const { isPageUnlocked, isLoading } = useUnlockedPages();
  const router = useRouter();
  const isScrolled = useIsScrolled();

  // If page is not unlocked, redirect to home (wait for loading to complete)
  useEffect(() => {
    if (!isLoading && !isPageUnlocked(Route.HEART_WEAVER)) {
      router.push(Route.HOME);
    }
  }, [isLoading, isPageUnlocked, router]);

  const scrollToGame = () => {
    if (window) {
      scroller.scrollTo('game', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      });
    }
  };

  // Don't render anything while loading or if not unlocked (while redirecting)
  if (isLoading || !isPageUnlocked(Route.HEART_WEAVER)) {
    return null;
  }

  return (
    <main className="w-full">
      {showJourney && <EmotionJourney onComplete={() => setShowJourney(false)} />}
      <section className="relative w-full h-screen md:h-[90vh] flex flex-col items-center">
        <div className="relative w-full h-1/2 md:h-2/3">
          <Image
            src="/heartweaverCover.png"
            className="object-cover lg:object-contain object-top select-none"
            alt={t.heartWeaver.coverAlt}
            fill
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2/3 md:h-1/2 flex flex-col items-center justify-center gap-8 md:gap-4">
          <div className="relative w-2/3 h-2/5">
            <Image src="/heartweaver.svg" className="max-w-sm m-auto select-none" fill alt={t.heartWeaver.titleAlt} />
          </div>

          <p className="text-2xl w-4/5 max-w-3xl text-center opacity-80 balanced">
            {t.heartWeaver.introText}
          </p>

          <p className="text-4xl w-4/5 max-w-3xl font-bold text-center balanced">{t.heartWeaver.mainTitle}</p>

          <TiArrowSortedDown
            onClick={scrollToGame}
            className={`text-white duration-300 transition-opacity ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            } w-16 h-16 cursor-pointer hover:text-turquoise-400`}
          />
        </div>
      </section>

      <section className="relative w-full h-fit bg-purple flex items-center justify-center" id="game">
        <div className="relative w-full max-w-[100rem] h-fit gap-4 grid md:grid-areas-left md:grid-cols-left items-center justify-items-center pt-8 md:pt-0">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit">
            <Title title={t.heartWeaver.storyBegins} />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left text-white">
              {t.heartWeaver.storyDescription1}
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left text-white">
              {t.heartWeaver.storyDescription2}
            </p>
          </div>

          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <Image src="/heartweaverAce.png" className="object-contain object-bottom" fill alt={t.heartWeaver.aceAlt} />
          </div>
        </div>
      </section>

      <section className="relative w-full h-fit flex items-center justify-center">
        <div className="relative w-full h-fit gap-4 grid md:grid-areas-right md:grid-cols-right items-center justify-items-center pt-8 md:pt-0">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit md:pl-16">
            <Title title={t.heartWeaver.friendsAndFoes} />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              {t.heartWeaver.friendsDescription1}
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              {t.heartWeaver.friendsDescription2}
            </p>
          </div>

          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <Image src="/heartweaverMark.png" className="object-contain object-bottom" fill alt={t.heartWeaver.markAlt} />
          </div>
        </div>
      </section>

      <section className="relative w-full h-fit bg-purple flex items-center justify-center" id="game">
        <div className="relative w-full max-w-[100rem] h-fit gap-4 grid md:grid-areas-left md:grid-cols-left items-center justify-items-center pt-8 md:pt-0">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit">
            <Title title={t.heartWeaver.decideFate} />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              {t.heartWeaver.fateDescription1}
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              {t.heartWeaver.fateDescription2}
            </p>
          </div>
          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <Image
              src="/heartweaverMark2.png"
              className="object-contain object-center p-8 xl:p-16 2xl:p-24"
              fill
              alt={t.heartWeaver.bookAlt}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
