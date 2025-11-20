'use client';

import { useIsScrolled } from '@/hooks/useIsScrolled';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import { Route } from '@/shared/Route';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiMenu, HiOutlineX } from 'react-icons/hi';
import { RiDiscordFill, RiInstagramFill, RiMailFill, RiTiktokFill, RiTwitterFill, RiLockLine, RiEmotionLine } from 'react-icons/ri';
import Dialog from './Dialog';
import KrakenTreasure from './KrakenTreasure';
import OctopusCollector from './OctopusCollector';
import { useOctopuses } from '@/hooks/useOctopuses';
import { formatNumber } from '@/utils/formatNumber';
import { useAudio } from '@/hooks/useAudio';

const Header = () => {
  const pathname = usePathname();
  const { isPageUnlocked } = useUnlockedPages();
  const [showTreasure, setShowTreasure] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { octopusCount, collectedOctopuses, updateOctopusCount, collectOctopus } = useOctopuses();
  const { playButtonClick } = useAudio();

  useEffect(() => {
    setIsDialogOpen(false);
  }, [pathname]);

  // Listen for custom event to open treasure
  useEffect(() => {
    const handleOpenTreasure = () => {
      setShowTreasure(true);
      // Dispatch event when shop opens
      window.dispatchEvent(new CustomEvent('shopOpened'));
    };
    window.addEventListener('openTreasure', handleOpenTreasure);
    return () => {
      window.removeEventListener('openTreasure', handleOpenTreasure);
    };
  }, []);

  const isScrolled = useIsScrolled();

  const socialLinks = (
    <div className="h-full flex items-center">
      {/* <a href="https://example.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiDiscordFill className="h-8 w-8" />
      </a> */}

      <a href="https://www.instagram.com/krakensdenstudios/" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiInstagramFill className="h-8 w-8" />
      </a>

      <a href="mailto:krakensdenstudios@gmail.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiMailFill className="h-8 w-8" />
      </a>

      <a href="https://twitter.com/krakensdenstd" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTwitterFill className="h-8 w-8" />
      </a>

      <a href="https://tiktok.com/@krakensdenstudios" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTiktokFill className="h-8 w-8" />
      </a>
    </div>
  );

  return (
    <header className="w-full fixed z-30 flex justify-center">
      {/* Collectable krakenlings on all pages - only show when treasure is closed */}
      {!showTreasure && (
        <OctopusCollector
          onCollect={collectOctopus}
          collectedOctopuses={collectedOctopuses}
        />
      )}
      
      {showTreasure && (
        <KrakenTreasure
          collectedOctopuses={octopusCount}
          onOctopusChange={updateOctopusCount}
          onClose={() => {
            setShowTreasure(false);
            // Dispatch event when shop closes
            window.dispatchEvent(new CustomEvent('shopClosed'));
          }}
        />
      )}
      <div
        className={`duration-300 pointer-events-none user-select-none transition-opacity opacity-0 ${isScrolled ? 'opacity-100' : ''
          } z-10 absolute left-0 right-0 top-0 bottom-[-5rem] bg-gradient-to-b from-black to-transparent`}
      />

      <div className="flex w-full justify-between py-4 px-6 md:px-8 items-center z-20 max-w-7xl">
        <Link href={Route.ROOT} className="flex items-center">
          <Image
            src="/logoWhite.png"
            alt="Kraken's Den Logo"
            width={96}
            height={96}
            className="object-contain select-none cursor-pointer"
          />
        </Link>

        {/* krakenlings counter on mobile */}
        <div className="flex items-center gap-2 text-white lg:hidden whitespace-nowrap">
          <RiEmotionLine className="text-turquoise-400 text-xl flex-shrink-0" />
          <span className="font-bold">{formatNumber(octopusCount)}</span>
        </div>

        <HiMenu
          className="text-white h-14 w-14 lg:hidden cursor-pointer hover:text-turquoise-400"
          onClick={() => {
            playButtonClick();
            setIsDialogOpen(true);
          }}
        />

        <div className="h-14 gap-8 items-center hidden lg:flex">
          {isPageUnlocked(Route.HOME) ? (
            <Link href={Route.HOME}>
              <p
                className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${pathname === Route.HOME ? 'text-turquoise-400' : ''
                  }`}
              >
                Home
              </p>
            </Link>
          ) : (
            <div className="relative group">
              <span className="text-gray-300 text-xl font-medium flex items-center gap-2 cursor-not-allowed whitespace-nowrap">
                Home <RiLockLine className="w-4 h-4" />
              </span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Locked. Get "Home Page" in The Kraken's Treasure (200 Krakenlings) to unlock this part of the den.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
              </div>
            </div>
          )}

          {isPageUnlocked(Route.TEAM) ? (
            <Link href={Route.TEAM}>
              <p
                className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${
                  pathname === Route.TEAM ? 'text-turquoise-400' : ''
                }`}
              >
                About Us
              </p>
            </Link>
          ) : (
            <div className="relative group">
              <span className="text-gray-300 text-xl font-medium flex items-center gap-2 cursor-not-allowed whitespace-nowrap">
                About Us <RiLockLine className="w-4 h-4" />
              </span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Locked. Get "About Us" in The Kraken's Treasure (1000 Krakenlings) to meet the team.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
              </div>
            </div>
          )}

          {isPageUnlocked(Route.HEART_WEAVER) ? (
            <Link href={Route.HEART_WEAVER}>
              <p
                className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${pathname === Route.HEART_WEAVER ? 'text-turquoise-400' : ''
                  }`}
              >
                Games
              </p>
            </Link>
          ) : (
            <div className="relative group">
              <span className="text-gray-300 text-xl font-medium flex items-center gap-2 cursor-not-allowed whitespace-nowrap">
                Games <RiLockLine className="w-4 h-4" />
              </span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Locked. Get "Games Page" in The Kraken's Treasure (500 Krakenlings) to access all therapies and experiences in one place.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
              </div>
            </div>
          )}

          {isPageUnlocked('newsletter') ? (
            <Link href={Route.HOME}>
              <p
                className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${pathname === Route.HOME ? 'text-turquoise-400' : ''
                  }`}
              >
                Contact
              </p>
            </Link>
          ) : (
            <div className="relative group">
              <span className="text-gray-300 text-xl font-medium flex items-center gap-2 cursor-not-allowed whitespace-nowrap">
                Contact <RiLockLine className="w-4 h-4" />
              </span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Locked. Get "Home Page" in The Kraken's Treasure (200 Krakenlings) to unlock this part of the den.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
              </div>
            </div>
          )}

          {/* krakenlings counter on desktop */}
          <div className="flex items-center gap-2 text-white whitespace-nowrap">
            <RiEmotionLine className="text-turquoise-400 text-xl flex-shrink-0" />
            <span className="font-bold">{formatNumber(octopusCount)}</span>
          </div>
          <button
            onClick={() => {
              playButtonClick();
              setShowTreasure(true);
              // Dispatch event when shop opens
              window.dispatchEvent(new CustomEvent('shopOpened'));
            }}
            className="bg-turquoise-400 hover:bg-turquoise-300 rounded-xl px-4 py-2 shadow-lg transition-all flex items-center gap-2 group whitespace-nowrap font-lora font-bold text-black text-xl"
            title="Open Treasure"
          >
            Open Treasure
          </button>

          {socialLinks}
        </div>

        <div className="absolute lg:hidden">
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <div className="relative flex w-full flex-col items-end px-3 py-5 gap-4">
              <HiOutlineX
                className="text-white h-14 w-14 cursor-pointer hover:text-turquoise-400"
                onClick={() => {
                  playButtonClick();
                  setIsDialogOpen(false);
                }}
              />

              <div className="relative flex w-full flex-col items-center p-6 gap-4">
                <Link href={Route.HOME} className="outline-none w-full p-4">
                  <p
                    className={`font-lora text-white text-2xl font-medium select-none text-center hover:text-turquoise-400 ${pathname === Route.HOME ? 'text-turquoise-400' : ''
                      }`}
                  >
                    HOME
                  </p>
                </Link>

                <Link href={Route.TEAM} className="outline-none w-full p-4">
                  <p
                    className={`font-lora text-white text-2xl font-medium select-none text-center hover:text-turquoise-400 ${pathname === Route.TEAM ? 'text-turquoise-400' : ''
                      }`}
                  >
                    ABOUT US
                  </p>
                </Link>

                <Link href={Route.HEART_WEAVER} className="outline-none w-full p-4">
                  <p
                    className={`font-lora text-white text-2xl font-medium select-none text-center hover:text-turquoise-400 ${pathname === Route.HEART_WEAVER ? 'text-turquoise-400' : ''
                      }`}
                  >
                    GAMES
                  </p>
                </Link>

                <Link href={Route.HOME} className="outline-none w-full p-4">
                  <p
                    className={`font-lora text-white text-2xl font-medium select-none text-center hover:text-turquoise-400 ${pathname === 'TODO' ? 'text-turquoise-400' : ''
                      }`}
                  >
                    CONTACT
                  </p>
                </Link>
              </div>

              <div className="w-full h-fit px-2">{socialLinks}</div>
            </div>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
