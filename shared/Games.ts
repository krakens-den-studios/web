import { Route } from './Route';

interface Game {
  name: string;
  imageSrc: string;
  link: Route | string;
}

export const games: Game[] = [
  {
    name: 'HeartWeaver',
    imageSrc: '/heartweaverThumbnail.png',
    link: Route.HEART_WEAVER
  }
];
