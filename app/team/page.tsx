'use client';

import { Route } from '@/shared/Route';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeamMember {
  name: string;
  role: string;
  roleEn: string;
  description: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Game Designer',
    role: 'Game Designer',
    roleEn: 'Game Designer',
    description: 'Creates the mechanics, systems and experiences that make our games unique and memorable.'
  },
  {
    name: 'Level Designer',
    role: 'Level Designer',
    roleEn: 'Level Designer',
    description: 'Builds the worlds and spaces where our stories unfold, guiding the player through immersive experiences.'
  },
  {
    name: 'Narrative Designer',
    role: 'Narrative Designer',
    roleEn: 'Narrative Designer',
    description: 'Weaves the stories and dialogues that give emotional depth to our games, connecting with the player&apos;s heart.'
  },
  {
    name: 'Animator',
    role: 'Animator',
    roleEn: 'Animator',
    description: 'Gives movement and expression to our characters, creating fluid animations that connect with emotions.'
  },
  {
    name: '3D Artist',
    role: '3D Artist',
    roleEn: '3D Artist',
    description: 'Gives shape and life to worlds and characters in three dimensions, creating models and textures that immerse the player in immersive visual experiences.'
  },
  {
    name: 'Programmer',
    role: 'Programmer',
    roleEn: 'Programmer',
    description: 'Responsible for bringing game mechanics and systems to life, transforming ideas into functional code.'
  }
];

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
              Meet the people behind Kraken&apos;s Den Studios
            </p>
          </div>
        </div>
      </section>

      {/* Second section: team members with turquoise-800 background */}
      <section className="relative w-full h-fit bg-turquoise-800 pb-20">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {teamMembers.slice(0, 3).map((member, index) => (
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
                  {member.roleEn}
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
          {teamMembers.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
              {teamMembers.slice(3).map((member, index) => (
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
                    {member.roleEn}
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
              United by the passion to create experiences that heal and transform, we work together to bring stories to life that resonate in the heart.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
