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
    <main className="w-full">
      <section className="w-full flex flex-col bg-heartweaver-cover-mobile md:bg-heartweaver-cover bg-no-repeat bg-contain md:bg-contain">
          <div className="mt-[50vh] md:mt-[80vh] mx-auto px-10">
            <Image src="/heartweaver.svg"
            width={650}
            height={650}
            alt="Heart Weaver title" />
          </div>

          <div className="text-center w-full my-10">
            <p className="text-2xl px-4 md:px-0 md:w-1/2 md:mx-auto">When the self shatters into a thousand pieces, when you can no longer be yourself, embark on an adventure, feel again...</p>
            <p className="text-4xl font-bold mt-10">Let the HeartWeaver mend your heart</p>
          </div>
          

          <TiArrowSortedDown
            onClick={scrollToGame}
            className="text-white h-14 w-14 lg:hidden cursor-pointer hover:text-turquoise-400 mx-auto"
          />
      </section>

      <section className="relative w-full flex flex-col md:flex-row items-center h-fit gap-8 pt-10 bg-purple text-center" id="game">
        <div className="md:order-2 md:relative md:w-1/2">
          <p className="text-3xl text-center w-full font-bold">A Story Begins...</p>
          <Image
            src="/decoratorLeft.svg"
            className="absolute left-3 top-10 md:m-auto md:left-0 md:right-32 md:top-1"
            width={256}
            height={256}
            alt="Decorator left"
          />
          <Image
            src="/decorator.svg"
            className="absolute right-3 top-10 md:m-auto md:left-32 md:right-0 md:top-1"
            width={256}
            height={256}
            alt="Decorator right"
          />
        </div>

        <div className="mt-10 text-xl font-light md:order-1">
          <p className="px-10">HeartWeaver is an emotional story-driven, action adventure with a dynamic ability system.</p>
          <p className="mt-10 px-10">Loss and guilt have made Ace wish they could never feel anything again...</p>
        </div>

        <Image
            src="/heartweaverAce.png"
            className="relative bottom-0 md:left-10"
            width={256}
            height={256}
            alt="HeartWeaver Ace"
          />
      </section>

      <section className="relative w-full flex flex-col md:flex-row items-center h-fit gap-8 pt-10 text-center" id="game">
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
          <p className="px-10">Hold the power to either restore Ace&apos;s emotions to their rightful harmony or let them fade forever...</p>
          <p className="mt-10 px-10">... Ace&apos;s future rests in your hands.</p>
        </div>

        <Image
            src="/heartweaverMark2.png"
            className="relative bottom-0 md:left-10"
            width={256}
            height={256}
            alt="HeartWeaver Mark"
          />
      </section>
    </main>
  );
}
