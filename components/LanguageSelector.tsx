'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';
import { useAudio } from '@/hooks/useAudio';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { playButtonClick } = useAudio();

  const handleLanguageChange = (lang: Language) => {
    playButtonClick();
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-turquoise-400 text-black'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
        aria-label="English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          language === 'es'
            ? 'bg-turquoise-400 text-black'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
        aria-label="Español"
      >
        ES
      </button>
      <button
        onClick={() => handleLanguageChange('ca')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          language === 'ca'
            ? 'bg-turquoise-400 text-black'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
        aria-label="Català"
      >
        CA
      </button>
    </div>
  );
}

