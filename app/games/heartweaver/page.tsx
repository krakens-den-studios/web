'use client';

import Title from '@/components/Title';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { scroller } from 'react-scroll';

export default function HeartWeaver() {
  const scrollToGame = () => {
    if (window) {
      scroller.scrollTo('game', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      });
    }
  };

  const isScrolled = useIsScrolled();

  return (
    <main className="w-full">
      <section className="relative w-full h-screen md:h-[90vh] flex flex-col items-center">
        <div className="relative w-full h-1/2 md:h-2/3">
          <Image
            src="/heartweaverCover.png"
            className="object-cover lg:object-contain object-top select-none"
            alt="Heart Weaver cover"
            fill
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2/3 md:h-1/2 flex flex-col items-center justify-center gap-8 md:gap-4">
          <div className="relative w-2/3 h-2/5">
            <Image src="/heartweaver.svg" className="max-w-sm m-auto select-none" fill alt="Heart Weaver title" />
          </div>

          <p className="text-2xl w-4/5 max-w-3xl text-center opacity-80 balanced">
            When the self shatters into a thousand pieces, when you can no longer be yourself, embark on an adventure,
            feel again...
          </p>

          <p className="text-4xl w-4/5 max-w-3xl font-bold text-center balanced">Let the HeartWeaver mend your heart</p>

          <TiArrowSortedDown
            onClick={scrollToGame}
            className={`text-white duration-300 transition-opacity ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            } w-16 h-16 cursor-pointer hover:text-turquoise-400`}
          />
        </div>
      </section>

      <section className="relative w-full h-fit gap-4 bg-purple grid md:grid-areas-left md:grid-cols-left" id="game">
        <div className="relative flex flex-col gap-6 items-center md:items-start pt-8 md:grid-in-story">
          <Title title="A Story Begins..." />

          <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
            HeartWeaver is an emotional story-driven, action adventure with a dynamic ability system.
          </p>

          <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
            Loss and guilt have made Ace wish they could never feel anything again...
          </p>
        </div>

        <div className="relative h-[40vh] md:h-[60vh] w-full md:grid-in-image">
          <Image src="/heartweaverAce.png" className="object-contain object-bottom" fill alt="HeartWeaver Ace" />
        </div>
      </section>

      {/* 
      <section
        className="relative w-full flex flex-col md:flex-row items-center h-fit gap-8 pt-10 text-center"
        id="game"
      >
        <div className="md:relative md:w-1/2">
          <p className="text-3xl text-center w-full font-bold">Friends & Foes</p>
          <Image
            src="/decoratorLeft.svg"
            className="absolute left-3 md:m-auto md:left-0 md:right-28 md:top-1"
            width={256}
            height={256}
            alt="Decorator left"
          />
          <Image
            src="/decorator.svg"
            className="absolute right-3 md:m-auto md:left-28 md:right-0 md:top-1"
            width={256}
            height={256}
            alt="Decorator right"
          />
        </div>

        <div className="mt-10 text-xl font-light">
          <p className="px-10">
            Embark on a captivating journey through this twisted realm ensnared by the imbalance of Ace&apos;s emotions.
          </p>
          <p className="mt-10 px-10">
            Help Ace embrace their emotions again and team up with Mark and their loved ones.
          </p>
        </div>
        <Image src="/heartweaverMark.png" width={600} height={600} alt="HeartWeaver Mark" />
      </section>

      <section
        className="relative w-full flex flex-col md:flex-row items-center h-fit gap-8 py-10 bg-purple text-center"
        id="game"
      >
        <div className="md:order-2 md:relative md:w-1/2">
          <p className="text-3xl text-center w-full font-bold md:pr-10">Decide Ace&apos;s Fate</p>
          <Image
            src="/decoratorLeft.svg"
            className="absolute left-3 top-10 md:m-auto md:left-0 md:right-44 md:top-1"
            width={256}
            height={256}
            alt="Decorator left"
          />
          <Image
            src="/decorator.svg"
            className="absolute right-3 top-10 md:m-auto md:left-28 md:right-0 md:top-1"
            width={256}
            height={256}
            alt="Decorator right"
          />
        </div>

        <div className="mt-10 text-xl font-light md:order-1">
          <p className="px-10">
            Hold the power to either restore Ace&apos;s emotions to their rightful harmony or let them fade forever...
          </p>
          <p className="mt-10 px-10">... Ace&apos;s future rests in your hands.</p>
        </div>

        <Image
          src="/heartweaverMark2.png"
          className="relative bottom-0 md:left-10"
          width={256}
          height={256}
          alt="HeartWeaver Mark"
        />
      </section> */}
    </main>
  );
}
