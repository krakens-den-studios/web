import { Route } from './Route';

interface Game {
  name: string;
  imageSrc: string;
  videoSrc?: string;
  link: Route | string;
  steamLink?: string;
  kickstarterLink?: string;
}

export const games: Game[] = [
  {
    name: 'HeartWeaver',
    imageSrc: '/heartweaverThumbnail.png',
    videoSrc: '/hero-heartweaver.mp4',
    link: Route.HEART_WEAVER,
    steamLink: 'https://store.steampowered.com/app/3114600/HeartWeaver/',
    kickstarterLink: 'https://www.kickstarter.com/projects/krakensdenstudios/heartweaver-an-emotional-journey-3d-narrative-adventure'
  }
];
