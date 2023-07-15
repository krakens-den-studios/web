'use client';

import Button from '@/components/Button';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';

export default function Home() {
  const onScrollClick = () => {
    window?.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  const isScrolled = useIsScrolled();

  return (
    <main className="relative w-screen h-fit">
      <section className="relative w-full h-screen lg:h-2/3 flex flex-col items-center">
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

      <section className="relative w-full flex flex-col items-center h-screen">
        <Image
          src="/logoColor.png"
          className="max-w-[50%] w-48"
          width={256}
          height={256}
          alt="Kraken's Den Studios logo "
        />
      </section>
    </main>
  );
}
