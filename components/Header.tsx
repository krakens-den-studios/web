'use client';

import { useIsScrolled } from '@/hooks/useIsScrolled';
import { Route } from '@/shared/Route';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { RiCloseLine, RiDiscordFill, RiInstagramFill, RiMailFill, RiTiktokFill, RiTwitterFill } from 'react-icons/ri';
import Dialog from './Dialog';

const Header = () => {
  const pathname = usePathname();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsDialogOpen(false);
  }, [pathname]);

  const isScrolled = useIsScrolled();

  const socialLinks = (
    <div className="h-full flex items-center">
      <a href="https://example.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiDiscordFill className="h-8 w-8" />
      </a>

      <a href="https://example.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiInstagramFill className="h-8 w-8" />
      </a>

      <a href="https://example.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiMailFill className="h-8 w-8" />
      </a>

      <a href="https://example.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTwitterFill className="h-8 w-8" />
      </a>

      <a href="https://example.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTiktokFill className="h-8 w-8" />
      </a>
    </div>
  );

  return (
    <header className="w-full fixed z-10 flex justify-center">
      <div
        className={`duration-300 pointer-events-none user-select-none transition-opacity opacity-0 ${
          isScrolled ? 'opacity-100' : ''
        } z-10 absolute left-0 right-0 top-0 bottom-[-5rem] bg-gradient-to-b from-black to-transparent`}
      />

      <div className="flex w-full justify-between p-3 items-center z-20 max-w-7xl">
        <Link href={Route.HOME}>
          <Image
            src="/logoWhite.png"
            alt="Kraken's Den Logo"
            width={96}
            height={96}
            className="object-contain select-none cursor-pointer"
          />
        </Link>

        <HiMenu
          className="text-white h-14 w-14 lg:hidden cursor-pointer hover:text-turquoise-400"
          onClick={() => setIsDialogOpen(true)}
        />

        <div className="h-14 gap-8 items-center hidden lg:flex">
          <Link href={Route.HOME}>
            <p
              className={`text-white text-xl font-medium hover:text-turquoise-400 ${
                pathname === Route.HOME ? 'text-turquoise-400' : ''
              }`}
            >
              Home
            </p>
          </Link>

          <Link href={Route.TEAM}>
            <p
              className={`text-white text-xl font-medium hover:text-turquoise-400 ${
                pathname === Route.TEAM ? 'text-turquoise-400' : ''
              }`}
            >
              About Us
            </p>
          </Link>

          <Link href={Route.HEART_WEAVER}>
            <p
              className={`text-white text-xl font-medium hover:text-turquoise-400 ${
                pathname === Route.HEART_WEAVER ? 'text-turquoise-400' : ''
              }`}
            >
              Games
            </p>
          </Link>

          <Link href={Route.HOME}>
            <p
              className={`text-white text-xl font-medium hover:text-turquoise-400 ${
                pathname === 'TODO' ? 'text-turquoise-400' : ''
              }`}
            >
              Contact
            </p>
          </Link>

          {socialLinks}
        </div>

        <div className="absolute lg:hidden">
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <div className="relative flex w-full flex-col items-end px-3 py-5 gap-4">
              <RiCloseLine
                className="text-white h-14 w-14 cursor-pointer hover:text-turquoise-400"
                onClick={() => setIsDialogOpen(false)}
              />

              <div className="relative flex w-full flex-col items-center p-6 gap-4">
                <Link href={Route.HOME} className="outline-none w-full p-4">
                  <p
                    className={`font-lora text-white text-2xl font-medium select-none text-center hover:text-turquoise-400 ${
                      pathname === Route.HOME ? 'text-turquoise-400' : ''
                    }`}
                  >
                    HOME
                  </p>
                </Link>

                <Link href={Route.TEAM} className="outline-none w-full p-4">
                  <p
                    className={`font-lora text-white text-2xl font-medium select-none text-center hover:text-turquoise-400 ${
                      pathname === Route.TEAM ? 'text-turquoise-400' : ''
                    }`}
                  >
                    ABOUT US
                  </p>
                </Link>

                <Link href={Route.HEART_WEAVER} className="outline-none w-full p-4">
                  <p
                    className={`font-lora text-white text-2xl font-medium select-none text-center hover:text-turquoise-400 ${
                      pathname === Route.HEART_WEAVER ? 'text-turquoise-400' : ''
                    }`}
                  >
                    GAMES
                  </p>
                </Link>

                <Link href={Route.HOME} className="outline-none w-full p-4">
                  <p
                    className={`font-lora text-white text-2xl font-medium select-none text-center hover:text-turquoise-400 ${
                      pathname === 'TODO' ? 'text-turquoise-400' : ''
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
