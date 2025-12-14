'use client';

import Title from '@/components/Title';
import EmotionJourney from '@/components/EmotionJourney';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '@/shared/Route';
import { useLanguage } from '@/contexts/LanguageContext';

import AngerGif from '@/public/anger.gif';
import FearGif from '@/public/fear.gif';
import SadnessGif from '@/public/sadness.gif';
import IntroGif from '@/public/intro.gif';
import Dialogue2dGif from '@/public/dialogue2d.gif';
import MapImg from '@/public/map.png';
import PulseGif from '@/public/pulse.gif';
import MarkGif from '@/public/mark.gif';

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
    if (typeof window === 'undefined') return;
    const section = document.getElementById('game');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Don't render anything while loading or if not unlocked (while redirecting)
  if (isLoading || !isPageUnlocked(Route.HEART_WEAVER)) {
    return null;
  }

  return (
    <main className="w-full">
      {showJourney && <EmotionJourney onComplete={() => setShowJourney(false)} />}
      <section className="relative w-full h-screen md:h-[90vh] flex flex-col items-center overflow-hidden">
        {/* Video de fons opcional - descomentar quan hi hagi video */}
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        >
          <source src="/gameplay-hero.mp4" type="video/mp4" />
        </video> */}
        
        <div className="relative w-full h-1/2 md:h-2/3 z-10">
          <Image
            src="/heartweaverCover.png"
            className="object-cover lg:object-contain object-top select-none"
            alt={t.heartWeaver.coverAlt}
            fill
            priority
          />
          {/* Overlay per millorar llegibilitat */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2/3 md:h-1/2 flex flex-col items-center justify-center gap-6 md:gap-4 z-20">
          <div className="relative w-2/3 h-2/5">
            <Image src="/heartweaver.svg" className="max-w-sm m-auto select-none" fill alt={t.heartWeaver.titleAlt} />
          </div>

          <p className="text-xl sm:text-2xl w-4/5 max-w-3xl text-center text-white/90 balanced drop-shadow-lg">
            {t.heartWeaver.introText}
          </p>

          <p className="text-3xl sm:text-4xl w-4/5 max-w-3xl font-bold text-center text-white balanced drop-shadow-lg">{t.heartWeaver.mainTitle}</p>

          <TiArrowSortedDown
            onClick={scrollToGame}
            className={`text-white duration-300 transition-opacity ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            } w-16 h-16 cursor-pointer hover:text-turquoise-400 hover:scale-110 transition-transform`}
          />
        </div>
      </section>

      <section className="relative w-full h-fit bg-purple flex items-center justify-center py-12 md:py-16" id="game">
        <div className="relative w-full max-w-[100rem] h-fit gap-8 md:gap-12 grid md:grid-areas-left md:grid-cols-left items-center justify-items-center pt-8 md:pt-0 px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit">
            <Title title={t.heartWeaver.storyBegins} />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left text-white leading-relaxed">
              {t.heartWeaver.storyDescription1}
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left text-white leading-relaxed">
              {t.heartWeaver.storyDescription2}
            </p>
          </div>

          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-turquoise-400/30 shadow-2xl">
              <Image src="/heartweaverAce.png" className="object-contain object-bottom" fill alt={t.heartWeaver.aceAlt} />
            </div>
          </div>
        </div>
      </section>

      {/* Secció de Gameplay - GIFs del joc */}
      <section className="relative w-full h-fit bg-black/40 flex items-center justify-center py-12 md:py-16">
        <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-lora font-bold text-center text-turquoise-400 mb-8 sm:mb-12">
            Experiència el Joc
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Intro GIF */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105 shadow-xl bg-black/40">
              <Image
                src={IntroGif}
                alt="HeartWeaver Intro"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-lora font-semibold text-lg">Introducció</p>
              </div>
            </div>

            {/* Dialogue 2D GIF */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105 shadow-xl bg-black/40">
              <Image
                src={Dialogue2dGif}
                alt="HeartWeaver Dialogue"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-lora font-semibold text-lg">Diàlegs</p>
              </div>
            </div>

            {/* Map */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105 shadow-xl bg-black/40">
              <Image
                src={MapImg}
                alt="HeartWeaver Map"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-lora font-semibold text-lg">Món</p>
              </div>
            </div>

            {/* Anger GIF */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105 shadow-xl bg-black/40">
              <Image
                src={AngerGif}
                alt="Anger Emotion"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-lora font-semibold text-lg">Emoció: Ràbia</p>
              </div>
            </div>

            {/* Fear GIF */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105 shadow-xl bg-black/40">
              <Image
                src={FearGif}
                alt="Fear Emotion"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-lora font-semibold text-lg">Emoció: Por</p>
              </div>
            </div>

            {/* Sadness GIF */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105 shadow-xl bg-black/40">
              <Image
                src={SadnessGif}
                alt="Sadness Emotion"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-lora font-semibold text-lg">Emoció: Tristesa</p>
              </div>
            </div>

            {/* Pulse GIF */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105 shadow-xl bg-black/40">
              <Image
                src={PulseGif}
                alt="Pulse Ability"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-lora font-semibold text-lg">Habilitat: Pols</p>
              </div>
            </div>

            {/* Mark GIF */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-turquoise-400/30 hover:border-turquoise-400 transition-all hover:scale-105 shadow-xl bg-black/40">
              <Image
                src={MarkGif}
                alt="Mark Character"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-lora font-semibold text-lg">Personatge: Mark</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full h-fit flex items-center justify-center py-12 md:py-16">
        <div className="relative w-full h-fit gap-8 md:gap-12 grid md:grid-areas-right md:grid-cols-right items-center justify-items-center pt-8 md:pt-0 px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit md:pl-16">
            <Title title={t.heartWeaver.friendsAndFoes} />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left text-white leading-relaxed">
              {t.heartWeaver.friendsDescription1}
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left text-white leading-relaxed">
              {t.heartWeaver.friendsDescription2}
            </p>
          </div>

          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-turquoise-400/30 shadow-2xl">
              <Image src="/heartweaverMark.png" className="object-contain object-bottom" fill alt={t.heartWeaver.markAlt} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full h-fit bg-purple flex items-center justify-center py-12 md:py-16" id="game-details">
        <div className="relative w-full max-w-[100rem] h-fit gap-8 md:gap-12 grid md:grid-areas-left md:grid-cols-left items-center justify-items-center pt-8 md:pt-0 px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit">
            <Title title={t.heartWeaver.decideFate} />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left text-white leading-relaxed">
              {t.heartWeaver.fateDescription1}
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left text-white leading-relaxed">
              {t.heartWeaver.fateDescription2}
            </p>
          </div>
          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-turquoise-400/30 shadow-2xl">
              <Image
                src="/heartweaverMark2.png"
                className="object-contain object-center p-8 xl:p-16 2xl:p-24"
                fill
                alt={t.heartWeaver.bookAlt}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery de Screenshots addicional (opcional) */}
      <section className="relative w-full h-fit bg-black/60 flex items-center justify-center py-12 md:py-16">
        <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-lora font-bold text-center text-turquoise-400 mb-8 sm:mb-12">
            Més Screenshots
          </h2>
          
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
                  alt={`HeartWeaver Gameplay ${index + 1}`}
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
