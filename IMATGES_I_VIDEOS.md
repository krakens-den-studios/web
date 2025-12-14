# Documentació d'Imatges i Videos per a la Web

Aquest document indica on posar les imatges i videos del joc HeartWeaver a la web.

## 📁 Estructura de Carpetes

Totes les imatges i videos han d'anar a la carpeta `/public/` del projecte.

## 🎮 Pàgina Root (`app/page.tsx`) - Landing Page ✅ MILLORADA

### Hero Section - Imatge/Video Principal
**Ubicació:** Hero section (part superior de la pàgina - pantalla completa)
**Fitxers:** 
- **Prioritari:** `/public/hero-heartweaver.jpg` (imatge de fons)
- **Opcional:** `/public/hero-heartweaver.mp4` (video de fons - descomentar al codi si s'afegeix)
**Recomanacions:**
- Si és imatge: Format JPG/WebP, resolució mínima 1920x1080px
- Si és video: Format MP4, durada 10-15 segons, loop, sense so, màxim 5MB
- Ha de mostrar el joc de forma atractiva (gameplay, personatges, món del joc)
- Ha de ser impactant i captar l'atenció immediatament
- **Fallback:** Si no existeix, usarà automàticament `/heartweaverCover.png`

### Screenshots del Joc - Gallery Grid ✅ IMPLEMENTAT
**Ubicació:** Secció de screenshots (després del hero)
**Fitxers:** 
- `/public/screenshot-1.jpg` ⚠️ **NECESSARI**
- `/public/screenshot-2.jpg` ⚠️ **NECESSARI**
- `/public/screenshot-3.jpg` ⚠️ **NECESSARI**
- `/public/screenshot-4.jpg` ⚠️ **NECESSARI`
**Recomanacions:**
- Format JPG/WebP, resolució 1920x1080px o similar (aspect ratio 16:9)
- Mostrar diferents aspectes del joc (combat, exploració, personatges, món)
- Es mostren en grid responsive (1 columna mòbil, 2 tablet, 4 desktop)
- Hover effect amb zoom i border glow
- Si una imatge no existeix, es amaga automàticament

## 🏠 Pàgina Home (`app/home/page.tsx`) ✅ MILLORADA

### Hero Section - Cover del Joc
**Ubicació:** Hero section (ja existeix)
**Fitxer actual:** `/public/heartweaverCover.png`
**Millores implementades:**
- ✅ Overlay gradient per millorar llegibilitat
- ✅ Video de fons opcional (codi preparat): `/public/hero-video.mp4`
  - Format MP4, durada 10-15 segons, loop, sense so, màxim 5MB
  - Descomentar el codi del video quan estigui disponible

### Carousel de Jocs - Millorat ✅
**Ubicació:** Secció de jocs (carousel)
**Fitxer actual:** `/public/heartweaverThumbnail.png`
**Millores implementades:**
- ✅ Transicions millorades (fade + scale en lloc de slide)
- ✅ Border amb hover effect
- ✅ Shadow per profunditat
- ✅ Indicadors de pàgina (dots) sota el carousel
- ✅ Transició més suau (500ms)

### Gallery de Screenshots - Nova Secció ✅ IMPLEMENTAT
**Ubicació:** Després del carousel (dins de la secció de jocs)
**Fitxers necessaris:**
- `/public/gallery-1.jpg` ⚠️ **NECESSARI**
- `/public/gallery-2.jpg` ⚠️ **NECESSARI**
- `/public/gallery-3.jpg` ⚠️ **NECESSARI`
- `/public/gallery-4.jpg` ⚠️ **NECESSARI`
- `/public/gallery-5.jpg` ⚠️ **NECESSARI`
- `/public/gallery-6.jpg` ⚠️ **NECESSARI`
**Recomanacions:**
- Format JPG/WebP, resolució 1920x1080px (aspect ratio 16:9)
- Mostrar diferents moments del joc (combat, exploració, personatges, món)
- Qualitat alta perquè es puguin veure en gran
- Es mostren en grid responsive (1 columna mòbil, 2 tablet, 3 desktop)
- Hover effects amb zoom i border glow
- Si una imatge no existeix, es amaga automàticament

## 🎮 Pàgina HeartWeaver (`app/games/heartweaver/page.tsx`) ✅ MILLORADA

### Hero Section ✅ MILLORAT
**Fitxer actual:** `/public/heartweaverCover.png`
**Millores implementades:**
- ✅ Overlay gradient per millorar llegibilitat
- ✅ Video de fons opcional (codi preparat): `/public/gameplay-hero.mp4`
  - Format MP4, durada 15-30 segons, loop, sense so, màxim 10MB
  - Descomentar el codi del video quan estigui disponible
- ✅ Text amb drop-shadow per millor llegibilitat
- ✅ Hover effects millorats a les fletxes

### Secció de Gameplay - GIFs del Joc ✅ NOVA SECCIÓ IMPLEMENTADA
**Ubicació:** Nova secció després del hero (abans de "Friends & Foes")
**Fitxers utilitzats (ja existeixen):**
- ✅ `/public/intro.gif` - Introducció del joc
- ✅ `/public/dialogue2d.gif` - Sistema de diàlegs
- ✅ `/public/map.png` - Mapa del món
- ✅ `/public/anger.gif` - Emoció: Ràbia
- ✅ `/public/fear.gif` - Emoció: Por
- ✅ `/public/sadness.gif` - Emoció: Tristesa
- ✅ `/public/pulse.gif` - Habilitat: Pols
- ✅ `/public/mark.gif` - Personatge: Mark

**Característiques:**
- Grid responsive (1 columna mòbil, 2 tablet, 3 desktop)
- Hover effects amb zoom i border glow
- Títols descriptius que apareixen en hover
- Cards amb shadow i border turquoise

### Seccions de Contingut ✅ MILLORADES
**Millores implementades:**
- ✅ Padding i spacing millorats
- ✅ Borders i shadows a les imatges
- ✅ Text amb millor llegibilitat (leading-relaxed)
- ✅ Seccions amb més espai vertical (py-12 md:py-16)

### Gallery de Screenshots Addicional ✅ NOVA SECCIÓ IMPLEMENTADA
**Ubicació:** Al final de la pàgina (després de "Decide Ace's Fate")
**Fitxers necessaris:**
- `/public/gameplay-screenshot-1.jpg` ⚠️ **OPCIONAL**
- `/public/gameplay-screenshot-2.jpg` ⚠️ **OPCIONAL**
- `/public/gameplay-screenshot-3.jpg` ⚠️ **OPCIONAL`
- `/public/gameplay-screenshot-4.jpg` ⚠️ **OPCIONAL`
- `/public/gameplay-screenshot-5.jpg` ⚠️ **OPCIONAL`
- `/public/gameplay-screenshot-6.jpg` ⚠️ **OPCIONAL`
**Recomanacions:**
- Format JPG/WebP, resolució 1920x1080px (aspect ratio 16:9)
- Mostrar diferents moments del gameplay
- Si una imatge no existeix, es amaga automàticament
- Grid responsive (1/2/3 columnes segons mida)

## 📋 Resum de Fitxers Necessaris

### Prioritat Alta (per començar):
1. `/public/hero-heartweaver.jpg` o `/public/hero-heartweaver.mp4` - Hero de la pàgina root
2. `/public/screenshot-1.jpg` a `/public/screenshot-4.jpg` - Screenshots per la pàgina root

### Prioritat Mitjana:
3. `/public/gameplay-1.jpg` a `/public/gameplay-3.jpg` - Per millorar el carousel
4. `/public/gallery-1.jpg` a `/public/gallery-6.jpg` - Per la nova gallery

### Prioritat Baixa (opcional):
5. `/public/hero-video.mp4` - Video de fons opcional per home
6. `/public/gameplay-hero.mp4` - Video hero per HeartWeaver

## 🎨 Recomanacions Generals

- **Format d'imatges:** WebP (millor compressió) amb fallback JPG/PNG
- **Format de videos:** MP4 (H.264) per compatibilitat
- **Mida de videos:** Màxim 5-10MB per video curtat
- **Resolució imatges:** Mínim 1920x1080px, òptim 2560x1440px
- **Optimització:** Comprimir abans d'afegir (usar tools com TinyPNG, ImageOptim)
- **Aspect Ratio:** 16:9 per la majoria d'imatges/videos
- **Noms de fitxers:** Descriptius i en minúscules amb guions

## 📝 Notes

- Tots els fitxers han d'anar a `/public/`
- Next.js servirà aquests fitxers automàticament
- Les imatges s'han d'usar amb el component `Image` de Next.js per optimització
- Els videos s'han d'usar amb l'element `<video>` natiu

