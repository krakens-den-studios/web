'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Route } from '@/shared/Route';
import { usePathname } from 'next/navigation';
import { RiInstagramFill, RiTwitterFill, RiTiktokFill, RiMailFill, RiLockLine } from 'react-icons/ri';
import { useUnlockedPages } from '@/hooks/useUnlockedPages';
import EmotionJourney from './EmotionJourney';

const newsletterCopies = [
  "Dive into the Kraken's Lair – our newsletter is the only sea monster approved source of gaming fun!",
  "Subscribe now and let the Kraken whisper gaming secrets directly into your inbox!",
  "Join the Kraken's Den inner circle – where gamers unite and tentacles type!",
  "Get kraken-lackin'! Sign up for updates that'll make you wave goodbye to boredom.",
  "Unleash the kraken... of gaming news! Subscribe today and let the adventure begin.",
  "Don't miss out on legendary updates – subscribe and let the kraken of knowledge enlighten you!",
  "Ready to level up your inbox? Let the Kraken's Den be your guide!",
  "Subscribe now – because even a kraken can't keep secrets as well as our newsletter!",
  "Warning: Our newsletter might contain traces of kraken-induced laughter and gaming awesomeness.",
  "Give your inbox a splash of excitement – join the Kraken's Den crew for a tidal wave of gaming updates!",
  "Join the Kraken's Den fan club – we promise, our tentacles are just for typing!",
  "Don't be a landlubber! Subscribe now and ride the waves of gaming greatness.",
  "Subscribe for updates hotter than a kraken's coffee!",
  "Because krakens know best: Subscribing equals leveling up in life!",
  "Sign up and let the kraken handle your daily dose of gaming awesomeness.",
  "Swim with the kraken – in a sea of gaming news and giggles!",
  "Our newsletter is kraken-tastic! Subscribe now and let the laughter ensue.",
  "Sail into the world of epic gaming – one kraken-powered newsletter at a time.",
  "Release the kraken... of gaming updates! Subscribe and let the fun flow in.",
  "Because life's too short not to have a kraken-approved newsletter in your inbox!",
  "Why fear the unknown when you can embrace the kraken-approved gaming future?",
  "Turn your inbox into a playground of gaming joy – thanks to the Kraken's Den crew!",
  "Subscribe now – our kraken's special power? Making gaming awesome!",
  "Join the Kraken's Den and make your inbox the envy of all sea creatures.",
  "Don't krak your head over missing out – hit subscribe and let the fun begin!",
  "Our newsletter is kraken-loved and gamer-approved – what more could you want?",
  "No krakens were harmed in the making of this newsletter, but tons of fun was added!",
  "Beware of shark attacks – subscribe to the Kraken's Den newsletter for a safer gaming experience.",
  "Subscribe now – krakens and puns, the two things we don't hold back on!",
  "Ever heard a kraken tell a joke? Now you will – subscribe for your daily chuckle!",
  "Become a Kraken Whisperer – subscribe and let the gaming magic flow!",
  "Unleash the kraken's wisdom upon your inbox – subscribe for enlightenment!",
  "Prepare to be kraken-ed up – our newsletter is fin-tastic and tentacle-riffic!",
  "Why did the gamer cross the ocean? To subscribe and get kraken with us!",
  "Subscribe for the kraken's version of a treasure map – it leads straight to gaming bliss!",
  "Wave goodbye to boredom – krakens insist on a daily dose of our newsletter!",
  "Sign up now and let the kraken tickle your funny bone... and your gaming senses!",
  "We've got the kraken's seal of approval – subscribe and ride the gaming waves!",
  "Keep calm and let the kraken do the talking – subscribe now for a splash of fun!",
  "Subscribe and let the kraken sing tales of legendary games into your ears.",
  "If you were a kraken, you'd totally subscribe – just saying!",
  "An octopus has eight arms, but a kraken-approved newsletter has infinite fun – subscribe today!",
  "Because even krakens can't resist the allure of our gaming-packed newsletter!",
  "Our newsletter: Where krakens and gamers unite in harmonious hilarity!",
  "Kraken's Den: Where gaming dreams come true – one subscribe button at a time!",
  "Unleash the kraken and unleash your gaming potential – hit subscribe now!",
  "Subscribe and make the kraken proud – it's a tentacular choice!",
  "Tired of ordinary? Subscribe and let the kraken add some extraordinary to your inbox!",
  "Because a kraken-approved newsletter is like a power-up for your inbox – subscribe!",
  "No krakens were harmed in the creation of this newsletter, but we did share some laughs!",
  "Ready to krak up? Subscribe now and join the Kraken's Den party!",
  "Kraken's Den: The only place where tentacles and gaming news get along swimmingly!",
  "Subscribe and let the kraken guide you through the gaming seas of wonder!",
  "Why settle for fishy tales when you can have kraken-approved gaming stories?",
  "We can't promise you a pet kraken, but we can promise you a whale of a good time – subscribe now!",
  "Become a kraken connoisseur – of gaming updates! Subscribe today.",
  "Kraken's Den: Where laughter, gaming, and tentacles intertwine – subscribe for the full experience!",
  "Subscribe now and let the kraken weave its magic tapestry of gaming goodness!",
  "Kraken's Den: The ultimate destination for gamers who love a good splash – subscribe and dive in!"
];

const randomizeQuote = () => {
  return newsletterCopies[Math.floor(Math.random() * newsletterCopies.length)]
}

const Footer = () => {
  const pathname = usePathname();
  const { isPageUnlocked } = useUnlockedPages();
  const [showJourney, setShowJourney] = useState(false);

  const [email, setEmail] = useState('');

  const [randomNewsletterCopy, setRandomNewsletterCopy] = useState('');

  useEffect(() => {
    setRandomNewsletterCopy(randomizeQuote());
  }, []);

  const handleChange = (event: any) => {
    setEmail(event.target.value);
  };

  const addContact = async () => {
    const options = {
      method: 'POST',
      url: 'https://api.brevo.com/v3/contacts',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY
      },
      data: {
        email: email,
        emailBlacklisted: false,
        smsBlacklisted: false,
        listIds: [3],
        updateEnabled: false,
      }
    };

    try {
      await axios.request(options);
      toast.success('Thanks for subscribing to our newsletter!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response.data.message || 'An error occurred.');
    }
  }

  const socialLinks = (
    <div className="h-full flex items-center w-full justify-evenly">
      <a href="https://www.instagram.com/krakensdenstudios/" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiInstagramFill className="h-8 w-8" />
      </a>

      <a href="mailto:krakensdenstudios@gmail.com" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiMailFill className="h-8 w-8" />
      </a>

      <a href="https://twitter.com/krakensdenstd" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTwitterFill className="h-8 w-8" />
      </a>

      <a href="https://tiktok.com/@krakensdenstudios" className="p-2 text-white hover:text-turquoise-400" target="_blank">
        <RiTiktokFill className="h-8 w-8" />
      </a>
    </div>
  );

  return (
    <footer className="w-full">
      {showJourney && <EmotionJourney onComplete={() => setShowJourney(false)} />}
      <div className="relative w-full flex flex-col md:flex-row items-center justify-center pt-10 pb-1 bg-footer-mobile bg-no-repeat bg-bottom md:bg-footer-large md:bg-bottom md:bg-contain md:bg-repeat-x">
        <div className="md:w-1/2">
          <h1 className="text-gray text-center">
            <p className="text-4xl md:text-5xl lg:text-6xl font-lora">Let the <span className="font-bold">Kraken</span></p>
            <p className="text-4xl md:text-5xl lg:text-6xl mt-1 md:mt-0 font-lora">catch <span className="font-bold">YOU</span></p>
          </h1>
          <div className="xl:h-96 lg:h-48 md:h-48"></div>
          <div className="lg:h-48"></div>
        </div>

        <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center" id="newsletter">
          {isPageUnlocked('newsletter') ? (
            <>
              <div className="w-3/4 md:w-1/2">
                <h2 className="text-white text-4xl text-center">
                  Newsletter
                </h2>
                <input type="email" value={email} onChange={handleChange} className="rounded-[0.75rem] text-center mt-3 px-4 py-3 bg-gray text-gray-100 w-full" placeholder="Introduce email adress" />
                <button onClick={addContact} disabled={email==''} className="rounded-[0.75rem] bg-turquoise-400 text-black text-3xl mt-5 px-4 py-3 w-full font-semibold">
                  Sign Up!
                </button>
              </div>
              <div className="xl:h-96 lg:h-48 md:h-36 py-10 px-10">
                <p className="text-center">🐙 {randomNewsletterCopy}</p>
              </div>
            </>
          ) : (
            <div className="w-3/4 md:w-1/2 flex flex-col items-center gap-6">
              <div className="relative group">
                <h2 className="text-gray-300 text-4xl text-center flex items-center justify-center gap-3">
                  Newsletter <RiLockLine className="w-8 h-8" />
                </h2>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Complete the Healing therapy in the Emotional Journey to unlock
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                </div>
              </div>
              <div className="w-full rounded-[0.75rem] bg-gray bg-opacity-30 text-center mt-3 px-4 py-8 border-2 border-gray-500 border-dashed">
                <p className="text-white text-lg mb-2">
                  The newsletter is locked
                </p>
                <p className="text-gray-200 text-sm">
                  Locked. Get "Newsletter" in The Kraken's Treasure (2000 Krakenlings) to receive soft, story-driven updates.
                </p>
              </div>
              <div className="xl:h-96 lg:h-48 md:h-36 py-10 px-10">
                <p className="text-center text-gray-400">🐙 Healing is a continuous journey. Join our community by unlocking the newsletter in The Kraken's Treasure.</p>
              </div>
            </div>
          )}
          <div className="h-48 md:hidden"></div>
          <div className="lg:h-48 h-24 flex flex-col justify-bottom items-bottom">
            <div className="gap-8 items-end flex justify-bottom pt-3 md:pt-10">
              {isPageUnlocked(Route.HOME) ? (
                <Link href={Route.HOME}>
                  <p
                    className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${
                      pathname === Route.HOME ? 'text-turquoise-400' : ''
                    }`}
                  >
                    Home
                  </p>
                </Link>
              ) : (
                <div className="relative group">
                  <span className="text-gray-300 text-md md:text-xl font-light md:font-medium flex items-center gap-2 cursor-not-allowed">
                    Home <RiLockLine className="w-4 h-4" />
                  </span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Locked. Get "Home Page" in The Kraken's Treasure (200 Krakenlings) to unlock this part of the den.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                  </div>
                </div>
              )}

              {isPageUnlocked(Route.TEAM) ? (
                <Link href={Route.TEAM}>
                  <p
                    className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${
                      pathname === Route.TEAM ? 'text-turquoise-400' : ''
                    }`}
                  >
                    About Us
                  </p>
                </Link>
              ) : (
                <div className="relative group">
                  <span className="text-gray-300 text-md md:text-xl font-light md:font-medium flex items-center gap-2 cursor-not-allowed">
                    About Us <RiLockLine className="w-4 h-4" />
                  </span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Locked. Get "About Us" in The Kraken's Treasure (1000 Krakenlings) to meet the team.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                  </div>
                </div>
              )}

              {isPageUnlocked(Route.HEART_WEAVER) ? (
                <Link href={Route.HEART_WEAVER}>
                  <p
                    className={`text-white text-md md:text-xl font-light md:font-medium hover:text-turquoise-400 ${
                      pathname === Route.HEART_WEAVER ? 'text-turquoise-400' : ''
                    }`}
                  >
                    Games
                  </p>
                </Link>
              ) : (
                <div className="relative group">
                  <span className="text-gray-300 text-md md:text-xl font-light md:font-medium flex items-center gap-2 cursor-not-allowed">
                    Games <RiLockLine className="w-4 h-4" />
                  </span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black bg-opacity-90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Locked. Get "Games Page" in The Kraken's Treasure (500 Krakenlings) to access all therapies and experiences in one place.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black border-t-opacity-90"></div>
                  </div>
                </div>
              )}
            </div>
            {socialLinks}
          </div>
        </div>
      </div>
      <div className="p-4 text-center">
        <p>@ Kraken&apos;s Den Studios 2023</p>
      </div>
    </footer>
  );
};

export default Footer;
