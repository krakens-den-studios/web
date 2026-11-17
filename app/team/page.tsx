'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';


export default function Team() {
  const { t } = useLanguage();

  return (
    <main className="relative w-full h-fit">
      <section className="relative w-full h-fit pt-32 md:pt-40 pb-0">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
          <div className="text-center mb-12">
            <h1 className="font-lora text-5xl md:text-6xl font-bold text-turquoise-400 mb-6">
              {t.team.title}
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto">
              {t.team.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="relative w-full h-fit bg-turquoise-800 pb-20">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-12 pt-8">
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-turquoise-400 mb-12 md:mb-16">
            <Image
              src="/team/team.jpg"
              alt={t.team.photoAlt}
              width={1436}
              height={1021}
              className="w-full h-auto"
              sizes="(max-width: 1280px) 100vw, 1152px"
              priority
            />
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {t.team.members.map((member) => (
              <div
                key={member.image}
                className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] bg-black bg-opacity-40 rounded-2xl p-6 md:p-8 border-2 border-turquoise-400 hover:border-turquoise-300 transition-all flex flex-col items-center text-center"
              >
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-turquoise-400 mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="144px"
                  />
                </div>

                <h3 className="font-lora text-xl md:text-2xl font-bold text-white mb-2">
                  {member.name}
                </h3>

                {member.role ? (
                  <p className="text-turquoise-300 text-base md:text-lg font-semibold mb-4">
                    {member.role}
                  </p>
                ) : null}

                {member.description ? (
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                    {member.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
