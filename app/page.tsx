'use client';

import Button from '@/components/Button';
import Points from '@/components/Points';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import { games } from '@/shared/Games';
import { Route } from '@/shared/Route';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { TiArrowSortedDown } from 'react-icons/ti';

export default function Home() {
  const onScrollClick = () => {
    window?.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  const isScrolled = useIsScrolled();

  const [currentGame, setCurrentGame] = useState(0);

  const nextGame = () => {
    setCurrentGame(currentGame === games.length - 1 ? 0 : currentGame + 1);
  };

  const prevGame = () => {
    setCurrentGame(currentGame === 0 ? games.length - 1 : currentGame - 1);
  };

  return (
    <main className="relative w-full h-fit">
      <section className="relative w-full h-2/3 flex flex-col items-center">
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
            <Image src="/heartweaver.svg" className="max-w-sm m-auto select-none" fill alt="Heart Weaver title " />
          </div>

          <div className="relative w-fit flex flex-col items-center gap-8 lg:flex-row">
            <Button label="EXPLORE" />
            <Button label="SUBSCRIBE" />
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

        <h2 className="font-lora text-4xl w-4/5 max-w-3xl text-center balanced">Welcome to our Den</h2>

        <p className="text-2xl w-4/5 max-w-3xl text-center opacity-80 balanced">
          You are in the depths of the ocean, where the Kraken unveils the most immersive and thrilling tales.
        </p>

        <p className="text-2xl w-4/5 max-w-3xl text-center opacity-80 balanced">
          Dive into realms of fantasy that transcend the limits of your imagination and let yourself be captivated.
        </p>

        <Link href={Route.TEAM}>
          <Button label="MEET US!" />
        </Link>
      </section>

      <section className="relative w-full flex flex-col items-center h-fit gap-8 bg-turquoise-800 py-20">
        <Points>
          <h2 className="font-lora text-4xl balanced">{"Kraken's Games"}</h2>
        </Points>

        <div className="relative w-full h-screen max-h-[30rem] flex items-center justify-center overflow-hidden">
          <TiArrowSortedDown
            onClick={prevGame}
            className={`absolute left-0 rotate-90 text-black w-16 h-16 min-w-16 min-h-16 cursor-pointer hover:text-turquoise-400 mb-10 transition-opacity duration-300 ${
              currentGame === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            }`}
          />

          {games.map(({ name, link, imageSrc }, i) => (
            <div
              key={`${name}_${i}`}
              className={`absolute h-fit w-4/5 max-w-4/5 grid grid-cols-1 grid-rows-[min-content_4rem] gap-8 transition-all duration-300 pointer-events-none ${
                currentGame === i
                  ? 'opacity-100 delay-200'
                  : currentGame > i
                  ? '-translate-x-36 opacity-0'
                  : 'translate-x-36 opacity-0'
              }`}
            >
              <div className="w-full justify-center flex relative h-full">
                <Image
                  src={imageSrc}
                  className="select-none object-contain max-h-[24rem]"
                  alt={`${name} cover`}
                  height={252}
                  width={451}
                />
              </div>

              <div className="w-full h-fit relative flex items-center justify-center">
                <Link href={link} className="w-fit">
                  <Button label={name} />
                </Link>
              </div>
            </div>
          ))}

          <TiArrowSortedDown
            onClick={nextGame}
            className={`absolute right-0 -rotate-90 text-black w-16 h-16 min-w-16 min-h-16 cursor-pointer hover:text-turquoise-400 mb-10 transition-opacity duration-300 ${
              currentGame === games.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-all'
            }`}
          />
        </div>
      </section>
    </main>
  );
}
