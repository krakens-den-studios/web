'use client';

import { Route } from '@/shared/Route';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';


export default function Team() {
  const { isPageUnlocked, isLoading } = useUnlockedPages();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // If page is not unlocked, redirect to root (wait for loading to complete)
    if (!isLoading && !isPageUnlocked(Route.TEAM)) {
      router.push('/');
    }
  }, [isLoading, isPageUnlocked, router]);

  // If page is not unlocked, don't show content
  if (isLoading || !isPageUnlocked(Route.TEAM)) {
    return null;
  }

  return (
    <main className="relative w-full h-fit">
      {/* First section: title and subtitle with black background */}
      <section className="relative w-full h-fit pt-32 md:pt-40 pb-0">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
          <div className="text-center mb-16">
            <h1 className="font-lora text-5xl md:text-6xl font-bold text-turquoise-400 mb-6">
              {t.team.title}
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto">
              {t.team.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Second section: team members with turquoise-800 background */}
      <section className="relative w-full h-fit bg-turquoise-800 pb-20">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {t.team.members.slice(0, 3).map((member, index) => (
              <div
                key={index}
                className="bg-black bg-opacity-40 rounded-2xl p-6 md:p-8 border-2 border-turquoise-400 hover:border-turquoise-300 transition-all flex flex-col items-center text-center min-h-[400px]"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-turquoise-400 bg-opacity-20 border-2 border-turquoise-400 flex items-center justify-center mb-6">
                  <span className="text-4xl md:text-5xl">🐙</span>
                </div>
                
                <h3 className="font-lora text-xl md:text-2xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                
                <p className="text-turquoise-300 text-base md:text-lg font-semibold mb-4">
                  {member.role}
                </p>
                
                <p className="text-gray-200 text-sm md:text-base leading-relaxed flex-grow">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Third section: last members with turquoise-800 background */}
      <section className="relative w-full h-fit bg-turquoise-800 py-20">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
          {/* Last members in the second section */}
          {t.team.members.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
              {t.team.members.slice(3).map((member, index) => (
                <div
                  key={index + 3}
                  className="bg-black bg-opacity-40 rounded-2xl p-6 md:p-8 border-2 border-turquoise-400 hover:border-turquoise-300 transition-all flex flex-col items-center text-center min-h-[400px]"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-turquoise-400 bg-opacity-20 border-2 border-turquoise-400 flex items-center justify-center mb-6">
                    <span className="text-4xl md:text-5xl">🐙</span>
                  </div>
                  
                  <h3 className="font-lora text-xl md:text-2xl font-bold text-white mb-2">
                    {member.name}
                  </h3>
                  
                  <p className="text-turquoise-300 text-base md:text-lg font-semibold mb-4">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed flex-grow">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
              {t.team.finalText}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
