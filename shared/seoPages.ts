import { HEART_WEAVER_KEY_PHRASES_LIST } from '@/shared/seoHeartWeaver';

/** Por defecto (raíz `/` y rutas sin layout propio). Inglés para crawlers. */
export const SITE_DEFAULT_META_DESCRIPTION =
  "Kraken's Den Studios — indie games with heart. Enter the den, collect Krakenlings, and explore The Kraken's Treasure. HeartWeaver: a story-driven narrative puzzle game about emotion and a deep story.";

export const SITE_DEFAULT_META_KEYWORDS = [
  "Kraken's Den Studios",
  'indie games',
  'HeartWeaver',
  ...HEART_WEAVER_KEY_PHRASES_LIST,
] as const;

export const PAGE_HOME_META_DESCRIPTION =
  "Welcome to the Kraken's Den — where emotions find their home. Collect Krakenlings, unlock therapies, discover treasures, and explore HeartWeaver from Kraken's Den Studios.";

export const PAGE_TEAM_META_DESCRIPTION =
  "Meet the team behind Kraken's Den Studios — the people making emotional indie games and deep stories like HeartWeaver.";

export const PAGE_CONTACT_META_DESCRIPTION =
  "Contact Kraken's Den Studios: email us or subscribe to the newsletter for news on HeartWeaver and our indie games.";

export const PAGE_BLOG_META_DESCRIPTION =
  "News and dev updates from Kraken's Den Studios — HeartWeaver, indie game development, and life in the den.";
