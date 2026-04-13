import type { Language } from '@/i18n/translations';

export type LocalizedString = Record<Language, string>;
export type LocalizedParagraphs = Record<Language, string[]>;

export interface BlogPost {
  slug: string;
  /** ISO 8601 date (YYYY-MM-DD) */
  date: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedParagraphs;
}

/**
 * Entradas publicadas en /blog.
 * Añadid aquí vuestros posts (copiad un bloque de la plantilla de abajo y pegadlo dentro del array).
 */
export const blogPosts: BlogPost[] = [];

export const blogPostSlugs = blogPosts.map((p) => p.slug);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/*
 * =============================================================================
 * PLANTILLA — copiad este objeto (o varios) dentro de `blogPosts: BlogPost[]`
 * =============================================================================
 *
 * {
 *   slug: 'mi-entrada-en-url',
 *   date: '2026-04-15',
 *   title: {
 *     en: 'Title in English',
 *     es: 'Título en español',
 *     ca: 'Títol en català',
 *   },
 *   excerpt: {
 *     en: 'One or two sentences for the list and meta description.',
 *     es: 'Una o dos frases para el listado y la descripción breve.',
 *     ca: 'Una o dues frases per al llistat i la descripció curta.',
 *   },
 *   content: {
 *     en: ['First paragraph.', 'Second paragraph.'],
 *     es: ['Primer párrafo.', 'Segundo párrafo.'],
 *     ca: ['Primer paràgraf.', 'Segon paràgraf.'],
 *   },
 * },
 *
 * =============================================================================
 * EJEMPLOS DE REFERENCIA (solo documentación; no están publicados)
 * =============================================================================
 *
 * {
 *   slug: 'welcome-to-the-den-blog',
 *   date: '2026-04-01',
 *   title: {
 *     en: 'Welcome to the Den — our new blog',
 *     es: 'Bienvenidos al blog de la Guarida',
 *     ca: 'Benvinguts al blog de la Guarida',
 *   },
 *   excerpt: {
 *     en: 'A space for updates on HeartWeaver, the studio, and the stories we want to share with you.',
 *     es: 'Un espacio para novedades sobre HeartWeaver, el estudio y las historias que queremos compartir contigo.',
 *     ca: 'Un espai per a novetats sobre HeartWeaver, l’estudi i les històries que volem compartir amb tu.',
 *   },
 *   content: {
 *     en: [
 *       'We are opening this corner of the site as a simple blog: here we will post news, behind-the-scenes notes, and reflections on making an emotional, story-driven game.',
 *       'For this first version, articles live in the codebase — we can grow later into a CMS or newsletter digests if we need to.',
 *       'Thank you for following the Kraken’s journey. More posts soon.',
 *     ],
 *     es: [
 *       'Abrimos este rincón del sitio como un blog sencillo: aquí publicaremos notas, making-of y reflexiones sobre crear un juego narrativo y emocional.',
 *       'En esta primera versión, los artículos viven en el código del proyecto; más adelante podremos enlazar un CMS o resúmenes del boletín si lo necesitamos.',
 *       'Gracias por seguir el viaje del Kraken. Pronto habrá más entradas.',
 *     ],
 *     ca: [
 *       'Obrim aquest racó del lloc com a blog senzill: hi publicarem notes, darrere el teló i reflexions sobre fer un joc narratiu i emocional.',
 *       'En aquesta primera versió, els articles viuen al codi del projecte; més endavant podrem enllaçar un CMS o resums del butlletí si cal.',
 *       'Gràcies per seguir el viatge del Kraken. Aviat hi haurà més entrades.',
 *     ],
 *   },
 * },
 *
 * {
 *   slug: 'heartweaver-narrative-puzzle',
 *   date: '2026-04-10',
 *   title: {
 *     en: 'Why we call HeartWeaver a narrative puzzle game',
 *     es: 'Por qué llamamos a HeartWeaver un juego de puzzles narrativo',
 *     ca: 'Per què en diem HeartWeaver un joc de trencaclosques narratiu',
 *   },
 *   excerpt: {
 *     en: 'Puzzles, emotion, and story braid together — a quick note on what players can expect.',
 *     es: 'Puzles, emoción e historia entrelazados: una nota breve sobre qué pueden esperar las jugadoras.',
 *     ca: 'Trencaclosques, emoció i història entrellaçades: una nota breu sobre què poden esperar les jugadores.',
 *   },
 *   content: {
 *     en: [
 *       'HeartWeaver is built around feeling: Ace’s journey is both a story about emotion and a game where understanding yourself is part of the challenge.',
 *       'We lean into “narrative puzzle” because many beats ask you to read the world, connect clues, and make choices that resonate emotionally — not just reflex tests.',
 *       'Wishlist HeartWeaver if you want story-first indie games with a deep heart. We will keep sharing progress here.',
 *     ],
 *     es: [
 *       'HeartWeaver gira en torno al sentir: el viaje de Ace es a la vez una historia sobre la emoción y un juego en el que entenderte es parte del reto.',
 *       'Hablamos de “puzzle narrativo” porque muchos momentos piden leer el mundo, enlazar pistas y tomar decisiones con carga emocional, no solo pruebas de reflejos.',
 *       'Añade HeartWeaver a la lista de deseos si buscas indies con historia y corazón. Seguiremos contando avances por aquí.',
 *     ],
 *     ca: [
 *       'HeartWeaver gira al voltant del sentir: el viatge de l’Ace és alhora una història sobre l’emoció i un joc on entendre’t és part del repte.',
 *       'Diem “trencaclosques narratiu” perquè molts moments demanen llegir el món, enllaçar pistes i prendre decisions amb càrrega emocional, no només proves de reflexos.',
 *       'Afegeix HeartWeaver a la llista de desitjos si t’agraden indies amb història i cor. Continuarem explicant avanços aquí.',
 *     ],
 *   },
 * },
 */
