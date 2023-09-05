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

      <section className="relative w-full h-fit bg-purple flex items-center justify-center" id="game">
        <div className="relative w-full max-w-[100rem] h-fit gap-4 grid md:grid-areas-left md:grid-cols-left items-center justify-items-center pt-8 md:pt-0">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit">
            <Title title="A Story Begins..." />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              HeartWeaver is an emotional story-driven, action adventure with a dynamic ability system.
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              Loss and guilt have made Ace wish they could never feel anything again...
            </p>
          </div>

          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <Image src="/heartweaverAce.png" className="object-contain object-bottom" fill alt="HeartWeaver Ace" />
          </div>
        </div>
      </section>

      <section className="relative w-full h-fit flex items-center justify-center">
        <div className="relative w-full h-fit gap-4 grid md:grid-areas-right md:grid-cols-right items-center justify-items-center pt-8 md:pt-0">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit md:pl-16">
            <Title title="Friends & Foes" />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              Embark on a captivating journey through this twisted realm ensnared by the imbalance of Ace&apos;s
              emotions.
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              Help Ace embrace their emotions again and team up with Mark and their loved ones.
            </p>
          </div>

          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <Image src="/heartweaverMark.png" className="object-contain object-bottom" fill alt="HeartWeaver Mark" />
          </div>
        </div>
      </section>

      <section className="relative w-full h-fit bg-purple flex items-center justify-center" id="game">
        <div className="relative w-full max-w-[100rem] h-fit gap-4 grid md:grid-areas-left md:grid-cols-left items-center justify-items-center pt-8 md:pt-0">
          <div className="relative flex flex-col gap-6 items-center md:items-start md:grid-in-story w-fit">
            <Title title="Decide Ace's Fate" />

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              Hold the power to either restore Ace&apos;s emotions to their rightful harmony or let them fade forever...
            </p>

            <p className="text-xl md:text-2xl w-11/12 max-w-3xl text-center md:text-left opacity-80">
              ... Ace&apos;s future rests in your hands.
            </p>
          </div>
          <div className="relative h-[40vh] lg:h-[50vh] xl:h-[60vh] w-full md:grid-in-image">
            <Image
              src="/heartweaverMark2.png"
              className="object-contain object-center p-8 xl:p-16 2xl:p-24"
              fill
              alt="HeartWeaver book"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
