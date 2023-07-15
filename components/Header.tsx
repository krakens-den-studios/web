'use client';

import { Route } from '@/shared/Route';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu } from 'react-icons/hi';
import { RiDiscordFill, RiInstagramFill, RiMailFill, RiTiktokFill, RiTwitterFill } from 'react-icons/ri';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex w-full justify-between p-3 items-center fixed z-10 max-w-7xl">
      <Image src="/logoWhite.png" alt="Kraken's Den Logo" width={96} height={96} className="object-contain" />
      <HiMenu className="text-white h-14 w-14 lg:hidden" />

      <div className="h-14 gap-8 items-center hidden lg:flex">
        <Link href={Route.HOME}>
          <p
            className={`text-white text-xl font-medium hover:text-turquoise ${
              pathname === Route.HOME ? 'text-turquoise' : ''
            }`}
          >
            Home
          </p>
        </Link>

        <Link href={Route.TEAM}>
          <p
            className={`text-white text-xl font-medium hover:text-turquoise ${
              pathname === Route.TEAM ? 'text-turquoise' : ''
            }`}
          >
            About Us
          </p>
        </Link>

        <Link href={Route.HEART_WEAVER}>
          <p
            className={`text-white text-xl font-medium hover:text-turquoise ${
              pathname === Route.HEART_WEAVER ? 'text-turquoise' : ''
            }`}
          >
            Games
          </p>
        </Link>

        <div className="h-full flex gap-3 items-center">
          <a href="https://example.com" className="" target="_blank">
            <RiDiscordFill className="text-white h-6 w-6 hover:text-turquoise" />
          </a>

          <a href="https://example.com" className="" target="_blank">
            <RiInstagramFill className="text-white h-6 w-6 hover:text-turquoise" />
          </a>

          <a href="https://example.com" className="" target="_blank">
            <RiMailFill className="text-white h-6 w-6 hover:text-turquoise" />
          </a>

          <a href="https://example.com" className="" target="_blank">
            <RiTwitterFill className="text-white h-6 w-6 hover:text-turquoise" />
          </a>

          <a href="https://example.com" className="" target="_blank">
            <RiTiktokFill className="text-white h-6 w-6 hover:text-turquoise" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
