'use client';

import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { scroller } from 'react-scroll';
import Points from '@/components/Points';

export default function HeartWeaver() {

  const scrollToGame = () => {
    if (window) {
      scroller.scrollTo('game', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      })
    }
  }


  return (
    <main className="relative w-full h-fit">
      <section className="relative w-full h-screen md:h-[80vh] lg:h-[66vh] flex flex-col items-center">
        <div className="relative w-full h-1/2 lg:h-full">
          <Image
            src="/heartweaverCover.png"
            className="object-cover lg:object-[24vw] 3xl:object-contain 3xl:object-[38vw] select-none"
            alt="Heart Weaver cover"
            fill
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 lg:right-1/3 h-2/3 flex flex-col gap-8 items-center">
          <div className="relative w-2/3 h-2/5">
            <Image src="/heartweaver.svg" className="max-w-sm m-auto select-none" fill alt="Heart Weaver title" />
          </div>

          <div className="relative w-fit flex flex-col gap-8 lg:flex-row text-center px-10">
            <p>When the self shatters into a thousand pieces, when you can no longer be yourself, embark on an adventure, feel again...</p>
            <p>Let the HeartWeaver mend your heart</p>
          </div>

          <TiArrowSortedDown
            onClick={scrollToGame}
            className="text-white h-14 w-14 lg:hidden cursor-pointer hover:text-turquoise-400"
          />
        </div>
      </section>

      <section className="relative w-full flex flex-col items-center h-fit gap-8 pt-10 bg-purple text-center" id="game">
        <Points>
          <p className="text-3xl text-center w-full font-bold">A Story Begins...</p>
          <Image
            src="/decoratorLeft.svg"
            className="absolute left-3"
            width={256}
            height={256}
            alt="Decorator left"
          />
          <Image
            src="/decorator.svg"
            className="absolute right-3"
            width={256}
            height={256}
            alt="Decorator right"
          />
        </Points>

        <div className="mt-10 text-xl font-light">
          <p className="px-10">HeartWeaver is an emotional story-driven, action adventure with a dynamic ability system.</p>
          <p className="mt-10 px-10">Loss and guilt have made Ace wish they could never feel anything again...</p>
        </div>

        <Image
            src="/heartweaverAce.png"
            className="bottom-0"
            width={256}
            height={256}
            alt="HeartWeaver Ace"
          />
      </section>

      <section className="relative w-full flex flex-col items-center h-fit gap-8 pt-10 text-center" id="game">
        <Points>
          <p className="text-3xl text-center w-full font-bold">Friends & Foes</p>
          <Image
            src="/decoratorLeft.svg"
            className="absolute left-3"
            width={256}
            height={256}
            alt="Decorator left"
          />
          <Image
            src="/decorator.svg"
            className="absolute right-3"
            width={256}
            height={256}
            alt="Decorator right"
          />
        </Points>

        <div className="mt-10 text-xl font-light">
          <p className="px-10">Embark on a captivating journey through this twisted realm ensnared by the imbalance of Ace&apos;s emotions.</p>
          <p className="mt-10 px-10">Help Ace embrace their emotions again and team up with Mark and their loved ones.</p>
        </div>
        <Image
            src="/heartweaverMark.png"
            width={600}
            height={600}
            alt="HeartWeaver Mark"
          />
      </section>

      <section className="relative w-full flex flex-col md:flex-row items-center h-fit gap-8 py-10 bg-purple text-center" id="game">
        <div className="md:order-2 md:relative md:w-1/2">
          <p className="text-3xl text-center w-full font-bold pr-10">Decide Ace&apos;s Fate</p>
          <Image
            src="/decoratorLeft.svg"
            className="absolute left-3 top-10 md:hidden"
            width={256}
            height={256}
            alt="Decorator left"
          />
          <Image
            src="/decorator.svg"
            className="absolute right-3 top-10 md:top-0"
            width={256}
            height={256}
            alt="Decorator right"
          />
        </div>

        <div className="mt-10 text-xl font-light md:order-1">
          <p className="px-10">Hold the power to either restore Ace&apos;s emotions to their rightful harmony or let them fade forever...</p>
          <p className="mt-10 px-10">... Ace&apos;s future rests in your hands.</p>
        </div>

        <Image
            src="/heartweaverMark2.png"
            className="bottom-0"
            width={256}
            height={256}
            alt="HeartWeaver Mark"
          />
      </section>
    </main>
  );
}
