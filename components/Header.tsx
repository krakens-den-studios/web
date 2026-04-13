'use client';

import { useIsScrolled } from '@/hooks/useIsScrolled';
import { useKrakenlingsToggle } from '@/hooks/useKrakenlingsToggle';
import { Route } from '@/shared/Route';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiMenu, HiOutlineX } from 'react-icons/hi';
import { RiDiscordFill, RiInstagramFill, RiMailFill, RiTiktokFill, RiTwitterFill, RiShoppingBagLine, RiVolumeMuteLine, RiVolumeUpLine, RiToggleLine, RiToggleFill } from 'react-icons/ri';
import { DISCORD_INVITE_URL } from '@/shared/social';
import Dialog from './Dialog';
import KrakenTreasure from './KrakenTreasure';
import OctopusCollector from './OctopusCollector';
import KrakenlingsTutorialModal from './KrakenlingsTutorialModal';
import { useOctopuses } from '@/hooks/useOctopuses';
import { formatNumber } from '@/utils/formatNumber';
import { useAudio } from '@/hooks/useAudio';
import { useUnclaimedMissions } from '@/hooks/useUnclaimedMissions';
import { useMissionChecker } from '@/hooks/useMissionChecker';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAvailablePurchases } from '@/hooks/useAvailablePurchases';
import KrakenlingIcon from './KrakenlingIcon';
import { cookieStorage } from '@/utils/cookieStorage';
import FloatingNewsletterBanner from './FloatingNewsletterBanner';

const Header = () => {
  const pathname = usePathname();
  const [showTreasure, setShowTreasure] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const { octopusCount, collectedOctopuses, updateOctopusCount, collectOctopus } = useOctopuses();
  const { playButtonClick, toggleAllAudio, isAudioEnabled, hasAudioUnlock } = useAudio();
  const unclaimedMissionsCount = useUnclaimedMissions();
  const availablePurchasesCount = useAvailablePurchases();
  const { t } = useLanguage();
  const { isEnabled: isKrakenlingsEnabled, toggle: toggleKrakenlings } = useKrakenlingsToggle();
  useMissionChecker(); // Check missions even when shop is closed

  const renderMobileNavItem = (route: Route, label: string, activeOverride?: boolean) => {
    const commonClasses =
      'font-lora text-white text-lg sm:text-xl md:text-2xl font-medium select-none text-center transition-colors';
    const isActive = activeOverride ?? pathname === route;

    return (
      <Link
        href={route}
        className="outline-none w-full p-4"
        onClick={() => setIsDialogOpen(false)}
      >
        <p className={`${commonClasses} hover:text-turquoise-400 ${isActive ? 'text-turquoise-400' : ''}`}>
          {label.toUpperCase()}
        </p>
      </Link>
    );
  };

  const isBlogPath = pathname === Route.BLOG || pathname.startsWith(`${Route.BLOG}/`);

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

  // Listen for first krakenling collected event
  useEffect(() => {
    const handleFirstKrakenlingCollected = () => {
      // Check if tutorial has already been shown
      if (typeof window !== 'undefined') {
        const hasSeenTutorial = cookieStorage.getItem('has-seen-krakenlings-tutorial');
        if (!hasSeenTutorial) {
          setShowTutorial(true);
        }
      }
    };

    window.addEventListener('firstKrakenlingCollected', handleFirstKrakenlingCollected);
    return () => {
      window.removeEventListener('firstKrakenlingCollected', handleFirstKrakenlingCollected);
    };
  }, []);

  const isScrolled = useIsScrolled();

  const socialLinks = (
    <div className="h-full flex items-center justify-center w-full gap-2">
      <a href="https://www.instagram.com/krakensdenstudios/" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiInstagramFill className="h-8 w-8" />
      </a>

      <a href="mailto:help@krakensdenstudios.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiMailFill className="h-8 w-8" />
      </a>

      <a href="https://twitter.com/krakensdenstd" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTwitterFill className="h-8 w-8" />
      </a>

      <a href="https://tiktok.com/@krakensdenstudios" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTiktokFill className="h-8 w-8" />
      </a>

      <a href={DISCORD_INVITE_URL} className="p-2 text-white hover:text-turquoise-400" target="_blank" rel="noopener noreferrer">
        <RiDiscordFill className="h-8 w-8" />
      </a>
    </div>
  );

  return (
    <>
      {showTutorial && (
        <KrakenlingsTutorialModal onClose={() => setShowTutorial(false)} />
      )}
      <div className="w-full fixed z-30 top-0 left-0">
        <header className="w-full flex justify-center">
          {/* Collectable krakenlings on all pages - only show when treasure is closed and enabled */}
          {!showTreasure && isKrakenlingsEnabled && (
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
          <div className="pointer-events-none absolute inset-0 bg-black/70 backdrop-blur border-b border-white/10" />
          <div
            className={`duration-300 pointer-events-none user-select-none transition-opacity opacity-0 ${isScrolled ? 'opacity-100' : ''
              } z-10 absolute left-0 right-0 top-0 bottom-[-5rem] bg-gradient-to-b from-black to-transparent`}
          />

          <div className="flex w-full max-w-7xl justify-between py-4 px-6 md:px-8 items-center z-20">
            <Link
              href={Route.ROOT}
              className="flex items-center"
            >
              <div className="relative w-28 h-12">
                <Image
                  src="/logoWhite.png"
                  alt="Kraken's Den Logo"
                  fill
                  className="object-contain select-none cursor-pointer"
                />
              </div>
            </Link>

            {/* Mobile: Audio toggle, Krakenlings toggle, Krakenlings counter & menu button */}
            <div className="flex items-center gap-3 lg:hidden">
              {hasAudioUnlock && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAllAudio();
                  }}
                  className="p-2 text-white hover:text-turquoise-400 transition-colors"
                  title={isAudioEnabled ? 'Desactivar sons' : 'Activar sons'}
                  aria-label={isAudioEnabled ? 'Desactivar sons' : 'Activar sons'}
                >
                  {isAudioEnabled ? (
                    <RiVolumeUpLine className="h-6 w-6" />
                  ) : (
                    <RiVolumeMuteLine className="h-6 w-6" />
                  )}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playButtonClick();
                  toggleKrakenlings();
                }}
                className="p-2 text-white hover:text-turquoise-400 transition-colors"
                title={isKrakenlingsEnabled ? t.header.disableKrakenlings : t.header.enableKrakenlings}
                aria-label={isKrakenlingsEnabled ? t.header.disableKrakenlings : t.header.enableKrakenlings}
              >
                {isKrakenlingsEnabled ? (
                  <RiToggleFill className="h-6 w-6 text-turquoise-400" />
                ) : (
                  <RiToggleLine className="h-6 w-6" />
                )}
              </button>
              <button
                className="flex items-center gap-2 text-white whitespace-nowrap px-3 py-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors relative"
                onClick={() => {
                  playButtonClick();
                  setShowTreasure(true);
                  window.dispatchEvent(new CustomEvent('shopOpened'));
                }}
              >
                <KrakenlingIcon size={24} background="total" className="flex-shrink-0" />
                <span className="font-bold">{formatNumber(octopusCount)}</span>
                {unclaimedMissionsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-turquoise-400 text-black text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center z-10">
                    {unclaimedMissionsCount}
                  </span>
                )}
                {availablePurchasesCount > 0 && (
                  <span className="absolute -top-2 -left-1 bg-amber-500 text-black text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center border border-amber-600 z-10">
                    {availablePurchasesCount}
                  </span>
                )}
              </button>

              <div
                className="p-2 text-white hover:text-turquoise-400 transition-colors"
                title="Open navigation"
                aria-label="Open navigation"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  playButtonClick();
                  setIsDialogOpen(true);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playButtonClick();
                    setIsDialogOpen(true);
                  }
                }}
              >
                <HiMenu className="h-9 w-9" />
              </div>
            </div>

            <div className="h-14 gap-8 items-center hidden lg:flex">
              <Link
                href={Route.HOME}
              >
                <p
                  className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${pathname === Route.HOME ? 'text-turquoise-400' : ''
                    }`}
                >
                  {t.header.home}
                </p>
              </Link>

              <Link
                href={Route.TEAM}
              >
                <p
                  className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${pathname === Route.TEAM ? 'text-turquoise-400' : ''
                    }`}
                >
                  {t.header.team}
                </p>
              </Link>

              <Link
                href={Route.HEART_WEAVER}
              >
                <p
                  className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${pathname === Route.HEART_WEAVER ? 'text-turquoise-400' : ''
                    }`}
                >
                  {t.header.games}
                </p>
              </Link>

              <Link href={Route.BLOG}>
                <p
                  className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${isBlogPath ? 'text-turquoise-400' : ''
                    }`}
                >
                  {t.header.blog}
                </p>
              </Link>

              <Link
                href={Route.CONTACT}
              >
                <p
                  className={`text-white text-xl font-medium hover:text-turquoise-400 whitespace-nowrap ${pathname === Route.CONTACT ? 'text-turquoise-400' : ''
                    }`}
                >
                  {t.header.contact}
                </p>
              </Link>

              {/* Audio toggle button on desktop */}
              {hasAudioUnlock && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAllAudio();
                  }}
                  className="p-2 text-white hover:text-turquoise-400 transition-colors"
                  title={isAudioEnabled ? 'Desactivar sons' : 'Activar sons'}
                  aria-label={isAudioEnabled ? 'Desactivar sons' : 'Activar sons'}
                >
                  {isAudioEnabled ? (
                    <RiVolumeUpLine className="h-6 w-6" />
                  ) : (
                    <RiVolumeMuteLine className="h-6 w-6" />
                  )}
                </button>
              )}

              {/* Krakenlings toggle button on desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playButtonClick();
                  toggleKrakenlings();
                }}
                className="p-2 text-white hover:text-turquoise-400 transition-colors"
                title={isKrakenlingsEnabled ? t.header.disableKrakenlings : t.header.enableKrakenlings}
                aria-label={isKrakenlingsEnabled ? t.header.disableKrakenlings : t.header.enableKrakenlings}
              >
                {isKrakenlingsEnabled ? (
                  <RiToggleFill className="h-6 w-6 text-turquoise-400" />
                ) : (
                  <RiToggleLine className="h-6 w-6" />
                )}
              </button>

              {/* krakenlings counter on desktop */}
              <button
                onClick={() => {
                  playButtonClick();
                  setShowTreasure(true);
                  window.dispatchEvent(new CustomEvent('shopOpened'));
                }}
                className="flex items-center gap-3 text-black font-lora font-bold whitespace-nowrap bg-turquoise-400 hover:bg-turquoise-300 rounded-xl px-4 py-2 shadow-lg transition-all relative"
                title={t.header.openTreasure}
              >
                <div className="flex items-center gap-2 text-white whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <KrakenlingIcon size={32} tint="total" background="total" className="flex-shrink-0" />
                    <span
                      className="font-bold text-white tabular-nums tracking-wide"
                      style={{ minWidth: '5ch', textAlign: 'right' }}
                    >
                      {formatNumber(octopusCount)}
                    </span>
                  </div>
                </div>
                <span className="text-black text-base lg:text-lg">{t.header.openTreasure}</span>
                {unclaimedMissionsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-turquoise-400 text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center border-2 border-turquoise-400 z-10">
                    {unclaimedMissionsCount}
                  </span>
                )}
                {availablePurchasesCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-amber-500 text-black text-xs font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center border-2 border-amber-600 z-10">
                    {availablePurchasesCount}
                  </span>
                )}
              </button>

              {socialLinks}
            </div>

            <div className="lg:hidden">
              <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <div className="relative flex w-full flex-col items-end px-3 py-5 gap-4">
                  <HiOutlineX
                    className="text-white h-14 w-14 cursor-pointer hover:text-turquoise-400"
                    onClick={() => {
                      playButtonClick();
                      setIsDialogOpen(false);
                    }}
                  />

                  <div className="relative flex w-full flex-col items-center p-6 gap-2">
                    {renderMobileNavItem(Route.HOME, t.header.home)}
                    {renderMobileNavItem(Route.TEAM, t.header.aboutUs)}
                    {renderMobileNavItem(Route.HEART_WEAVER, t.header.games)}
                    {renderMobileNavItem(Route.BLOG, t.header.blog, isBlogPath)}
                    {renderMobileNavItem(Route.CONTACT, t.header.contact)}
                  </div>

                  <div className="w-full h-fit px-2">{socialLinks}</div>
                </div>
              </Dialog>
            </div>
          </div>

        </header>
        <FloatingNewsletterBanner />
      </div>
    </>
  );
};

export default Header;
