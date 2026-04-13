/**
 * Frases clave (inglés) para SEO, fichas de tienda y metadatos.
 * Mantener alineado con copys visibles en i18n cuando aplique.
 */
export const HEART_WEAVER_KEY_PHRASES = {
  storyDrivenPuzzleGame: 'story driven puzzle game',
  indieGameWithDeepStory: 'indie game with deep story',
  emotionalIndieGame: 'emotional indie game',
  narrativePuzzleGame: 'narrative puzzle game',
  gameAboutEmotion: 'game about emotion',
} as const;

export const HEART_WEAVER_KEY_PHRASES_LIST = Object.values(HEART_WEAVER_KEY_PHRASES);

/** Descripción larga para meta / Open Graph (inglés). */
export const HEART_WEAVER_META_DESCRIPTION =
  "HeartWeaver is an emotional indie game and narrative puzzle adventure—a story-driven puzzle game about emotion, with a deep story. From Kraken's Den Studios.";

export const HEART_WEAVER_META_KEYWORDS: string[] = [
  ...HEART_WEAVER_KEY_PHRASES_LIST,
  'HeartWeaver',
  'Heart Weaver',
  "Kraken's Den Studios",
  'Krakens Den Studios',
];
