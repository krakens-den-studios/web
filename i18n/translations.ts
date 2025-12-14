export type Language = 'en' | 'es' | 'ca';

export interface Translations {
  // Common
  common: {
    close: string;
    loading: string;
    error: string;
    success: string;
  };
  
  // Header
  header: {
    home: string;
    team: string;
    games: string;
    contact: string;
    openTreasure: string;
    aboutUs: string;
    lockedHome: string;
    lockedTeam: string;
    lockedGames: string;
    lockedContact: string;
  };
  
  // Footer
  footer: {
    newsletter: string;
    subscribe: string;
    emailPlaceholder: string;
    subscribed: string;
    socialMedia: string;
    letTheKraken: string;
    catchYou: string;
    you: string;
    signUp: string;
    lockedNewsletter: string;
    lockedNewsletterDesc: string;
    healingJourney: string;
    copyright: string;
    subscribeSuccess: string;
    subscribeError: string;
    newsletterCopies: string[];
  };
  
  // Home page
  home: {
    title: string;
    subtitle: string;
    description: string;
    openTreasure: string;
    enterDen: string;
    welcomeHeart: string;
    descriptionFull: string;
    explore: string;
    exploreLocked: string;
    subscribe: string;
    subscribeLocked: string;
    meetUs: string;
    meetUsLocked: string;
    krakensGames: string;
  };

  // First visit modal
  firstVisit: {
    title: string;
    subtitle: string;
    action: string;
    instruction: string;
  };
  
  // Kraken Treasure
  treasure: {
    title: string;
    description: string;
    krakenlings: string;
    saved: string;
    perSecond: string;
    missions: string;
    therapies: string;
    helpers: string;
    treasures: string;
    upgrades: string;
    get: string;
    owned: string;
    unlocked: string;
    requires: string;
    reward: string;
    claim: string;
    claimed: string;
    readyToClaim: string;
    completed: string;
    go: string;
    buy: string;
    missionsDescription: string;
    helpersDescription: string;
    helperPerHelper: string;
    helperTotalProduction: string;
    helperUpgradeBonus: string;
    missionRequiredLabel: string;
    missionUnlockHint: string;
    tapToPlay: string;
      clickNow: string;
      wait: string;
      tryAgain: string;
      followRhythm: string;
      now: string;
      hold: string;
      holdButton: string;
      progress: string;
      correctClicks: string;
      incorrectOrder: string;
      formed: string;
      established: string;
      play: string;
      therapyNeedsTime: string;
      finalTreasureMessage: string;
  };
  
  // Missions
  missions: {
    visitHome: string;
    visitGames: string;
    visitTeam: string;
    visitContact: string;
    buyFirstHelper: string;
    collect10: string;
    collect50: string;
    collect100: string;
    collect750: string;
    collect1500: string;
    collect3000: string;
    collect6000: string;
    reach100: string;
    reach500: string;
    reach1000: string;
    reach5000: string;
    reach10000: string;
    reach50000: string;
    reach100000: string;
    reach500000: string;
    reach1000000: string;
    reach10Kps: string;
    reach50Kps: string;
    reach100Kps: string;
    reach200Kps: string;
    reach400Kps: string;
    reach800Kps: string;
    reach1600Kps: string;
    hope1: string;
    hope2: string;
    hope3: string;
    hope4: string;
    courage1: string;
    courage2: string;
    courage3: string;
    courage4: string;
    connection1: string;
    connection2: string;
    connection3: string;
    connection4: string;
    healing1: string;
    healing2: string;
    healing3: string;
    healing4: string;
    own3Helpers: string;
  };
  
  // Minigames
  minigames: {
    hope: string;
    courage: string;
    connection: string;
    healing: string;
    completed: string;
    followLight: string;
    shownCourage: string;
    formedWord: string;
    foundRhythm: string;
  };
  
  // Contact
  contact: {
    title: string;
    subtitle: string;
    email: string;
    newsletter: string;
    subscribe: string;
    subscribed: string;
    subscribing: string;
    enterEmail: string;
    thankYou: string;
    locked: string;
    lockedDesc: string;
  };
  
  // Team
  team: {
    title: string;
    subtitle: string;
    members: Array<{
      name: string;
      role: string;
      description: string;
    }>;
    finalText: string;
  };
  
  // HeartWeaver
  heartWeaver: {
    coverAlt: string;
    titleAlt: string;
    introText: string;
    mainTitle: string;
    storyBegins: string;
    storyDescription1: string;
    storyDescription2: string;
    aceAlt: string;
    friendsAndFoes: string;
    friendsDescription1: string;
    friendsDescription2: string;
    markAlt: string;
    decideFate: string;
    fateDescription1: string;
    fateDescription2: string;
    bookAlt: string;
    mendHeartTitle: string;
    mendHeartAlt: string;
    cleanseThoughtsTitle: string;
    cleanseThoughtsAlt: string;
    charismaticCompanionTitle: string;
    charismaticCompanionAlt: string;
    immersiveWorldTitle: string;
    immersiveWorldAlt: string;
    powerEmotionsTitle: string;
    powerEmotionsGifAlts: string[];
    powerEmotionsCenterAlt: string;
  };
  
  // Minigames additional
  minigamesExtra: {
    holdMouse: string;
    holdAndMove: string;
    enterEmail: string;
  };
  
  // Game Data Translations
  gameData: {
    agents: Record<string, { name: string; description: string }>;
    unlockables: Record<string, { name: string; description: string }>;
    minigames: Record<string, { name: string; description: string }>;
    missions: Record<string, { name: string; description: string }>;
    connectionWords: string[];
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success'
    },
    header: {
      home: 'Home',
      team: 'Team',
      games: 'Games',
      contact: 'Contact',
      openTreasure: "Open Treasure",
      aboutUs: 'About Us',
      lockedHome: 'Locked. Get "Home Page" in The Kraken\'s Treasure to unlock this part of the den.',
      lockedTeam: 'Locked. Get "About Us" in The Kraken\'s Treasure to meet the team.',
      lockedGames: 'Locked. Get "Games Page" in The Kraken\'s Treasure to check our games.',
      lockedContact: 'Locked. Get "Contact" in The Kraken\'s Treasure to unlock this part of the den.'
    },
    footer: {
      newsletter: 'Newsletter',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Your email',
      subscribed: 'Subscribed!',
      socialMedia: 'Follow us',
      letTheKraken: 'Let the',
      catchYou: 'catch',
      you: 'YOU',
      signUp: 'Sign Up!',
      lockedNewsletter: 'Complete the Healing therapy in the Emotional Journey to unlock',
      lockedNewsletterDesc: 'Locked. Get "Newsletter" in The Kraken\'s Treasure to receive soft, story-driven updates.',
      healingJourney: 'Healing is a continuous journey. Join our community by unlocking the newsletter in The Kraken\'s Treasure.',
      copyright: '@ Kraken\'s Den Studios 2025',
      subscribeSuccess: 'Thanks for subscribing to our newsletter!',
      subscribeError: 'An error occurred.',
      newsletterCopies: [
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
      ]
    },
    home: {
      title: "Welcome to the Kraken's Den",
      subtitle: 'A place where emotions find their home',
      description: 'Collect Krakenlings, unlock therapies, and discover treasures.',
      openTreasure: "Open Treasure",
      enterDen: 'ENTER THE DEN',
      welcomeHeart: 'Welcome to the Heart of the Den',
      descriptionFull: 'Collect Krakenlings, unlock therapies, and discover treasures. Play at your own pace.',
      explore: 'EXPLORE',
      exploreLocked: 'EXPLORE 🔒',
      subscribe: 'SUBSCRIBE',
      subscribeLocked: 'SUBSCRIBE 🔒',
      meetUs: 'MEET US!',
      meetUsLocked: 'MEET US! 🔒',
      krakensGames: "Kraken's Games"
    },
    firstVisit: {
      title: 'Welcome to the Den',
      subtitle: 'A Krakenling has found you.',
      action: 'Save it',
      instruction: 'Click on the Krakenling to save it'
    },
    treasure: {
      title: "The Kraken's Treasure",
      description: 'Trade Krakenlings for helpers, treasures, and therapies.',
      krakenlings: 'krakenlings',
      saved: 'personally saved',
      perSecond: 'krakenlings/second',
      missions: 'Missions',
      therapies: 'Therapies',
      helpers: 'Helpers',
      treasures: 'Treasures',
      upgrades: 'Upgrades',
      get: 'GET',
      owned: 'owned',
      unlocked: 'UNLOCKED',
      requires: 'Requires:',
      reward: 'Reward:',
      claim: 'Claim',
      claimed: 'Claimed',
      readyToClaim: 'ready to claim',
      completed: 'Completed!',
      go: 'GO',
      buy: 'Buy',
      missionsDescription: 'Complete missions to unlock new helpers, treasures, and upgrades.',
      helpersDescription: 'Hire helpers that automatically collect Krakenlings for you. The more you have, the more they gather.',
      helperPerHelper: 'per helper',
      helperTotalProduction: 'total production',
      helperUpgradeBonus: 'from upgrades',
      missionRequiredLabel: 'Mission required:',
      missionUnlockHint: 'Complete this mission to unlock',
      tapToPlay: 'Tap anywhere to play',
      clickNow: 'Click now',
      wait: 'Wait...',
      tryAgain: 'Try again',
      followRhythm: 'Follow the rhythm...',
      now: 'Now!',
      hold: 'Hold',
      holdButton: 'Hold...',
      progress: 'Progress:',
      correctClicks: 'Correct clicks:',
      incorrectOrder: 'Incorrect order. Try again.',
      formed: 'You formed:',
      established: 'You have established the connection',
      play: 'START',
      therapyNeedsTime: 'The therapy needs time to settle. Return in',
      finalTreasureMessage: 'You\'ve reached the deepest part of the den.\n\nYou\'ve collected Krakenlings, unlocked pages, and completed therapies – but none of that matters more than this:\n\nYou showed up. You played. You felt.\n\nThe Kraken\'s Den was never about finding something outside of you.\nIt was about noticing the courage, tenderness, and resilience you already carry.\n\nThank you for giving your emotions a place to breathe.'
    },
    missions: {
      visitHome: 'Welcome to the Den',
      visitGames: 'Visit Games',
      visitTeam: 'Visit Team',
      visitContact: 'Visit Contact',
      buyFirstHelper: 'Buy First Helper',
      collect10: 'Collect 10 Krakenlings',
      collect50: 'Collect 50 Krakenlings',
      collect100: 'Collect 100 Krakenlings',
      collect750: 'Collect 750 Krakenlings',
      collect1500: 'Collect 1500 Krakenlings',
      collect3000: 'Collect 3000 Krakenlings',
      collect6000: 'Collect 6000 Krakenlings',
      reach100: 'Reach 100 Krakenlings',
      reach500: 'Reach 500 Krakenlings',
      reach1000: 'Reach 1000 Krakenlings',
      reach5000: 'Reach 5000 Krakenlings',
      reach10000: 'Reach 10000 Krakenlings',
      reach50000: 'Reach 50000 Krakenlings',
      reach100000: 'Reach 100000 Krakenlings',
      reach500000: 'Reach 500000 Krakenlings',
      reach1000000: 'Reach 1000000 Krakenlings',
      reach10Kps: 'Reach 10 KPS',
      reach50Kps: 'Reach 50 KPS',
      reach100Kps: 'Reach 100 KPS',
      reach200Kps: 'Reach 200 KPS',
      reach400Kps: 'Reach 400 KPS',
      reach800Kps: 'Reach 800 KPS',
      reach1600Kps: 'Reach 1600 KPS',
      hope1: 'Hope I',
      hope2: 'Hope II',
      hope3: 'Hope III',
      hope4: 'Hope IV',
      courage1: 'Courage I',
      courage2: 'Courage II',
      courage3: 'Courage III',
      courage4: 'Courage IV',
      connection1: 'Connection I',
      connection2: 'Connection II',
      connection3: 'Connection III',
      connection4: 'Connection IV',
      healing1: 'Healing I',
      healing2: 'Healing II',
      healing3: 'Healing III',
      healing4: 'Healing IV',
      own3Helpers: 'Own 3 Helpers'
    },
    minigames: {
      hope: 'Hope',
      courage: 'Courage',
      connection: 'Connection',
      healing: 'Healing',
      completed: 'Completed!',
      followLight: 'You have followed the light of hope',
      shownCourage: 'You have shown courage',
      formedWord: 'You formed:',
      foundRhythm: 'You have found your healing rhythm'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Reach out to us or stay connected through our newsletter',
      email: 'Email',
      newsletter: 'Newsletter',
      subscribe: 'Subscribe',
      subscribed: 'Subscribed!',
      subscribing: 'Subscribing...',
      enterEmail: 'Enter your email',
      thankYou: 'Thank you for subscribing!',
      locked: 'Newsletter is locked',
      lockedDesc: 'Unlock the Newsletter in The Kraken\'s Treasure to subscribe.'
    },
    team: {
      title: 'Our Team',
      subtitle: 'Meet the people behind the Kraken\'s Den',
      members: [
        {
          name: 'Carlos Martínez',
          role: 'Game Designer',
          description: 'The face of the team, present wherever being sociable and friendly is needed. He is also responsible for making sure the game is not just a walking simulator.'
        },
        {
          name: 'David Tàrrega',
          role: 'Level Designer',
          description: 'He started as a student and someday he will become a master. He could totally show up in that volleyball anime series.'
        },
        {
          name: 'Meritxell',
          role: 'Narrative Designer',
          description: 'In charge of the stories and texts that—ideally—make everyone laugh, cry, and feel moved. She likes turquoise and cats.'
        },
        {
          name: 'José Manuel Correa',
          role: 'Animator',
          description: 'Responsible for bringing characters to life. He also helps with modeling and with whatever else is needed.'
        },
        {
          name: 'Ergoni',
          role: '3D Artist',
          description: 'The one to blame for our 3D models being so beautiful.'
        },
        {
          name: 'Enric',
          role: 'Many',
          description: 'Team management, code, production, programming... Whatever it takes. I am required to write that no one told me to write that I have not been forced to work extra hours in order to buy my dog and 2 cats more toys and food.'
        }
      ],
      finalText: 'Just some people trying to make a positive impact in some other people\'s lives while living out of it.'
    },
    heartWeaver: {
      coverAlt: 'Heart Weaver cover',
      titleAlt: 'Heart Weaver title',
      introText: 'When the self shatters into a thousand pieces, when you can no longer be yourself, embark on an adventure, feel again...',
      mainTitle: 'Let the HeartWeaver mend your heart',
      storyBegins: 'A Story Begins...',
      storyDescription1: 'HeartWeaver is an emotional story-driven, action adventure with a dynamic ability system.',
      storyDescription2: 'Loss and guilt have made Ace wish they could never feel anything again...',
      aceAlt: 'HeartWeaver Ace',
      friendsAndFoes: 'Friends & Foes',
      friendsDescription1: 'Embark on a captivating journey through this twisted realm ensnared by the imbalance of Ace\'s emotions.',
      friendsDescription2: 'Help Ace embrace their emotions again and team up with Mark and their loved ones.',
      markAlt: 'HeartWeaver Mark',
      decideFate: 'Decide Ace\'s Fate',
      fateDescription1: 'Hold the power to either restore Ace\'s emotions to their rightful harmony or let them fade forever...',
      fateDescription2: '... Ace\'s future rests in your hands.',
      bookAlt: 'HeartWeaver book',
      mendHeartTitle: 'Let the Heart Weaver mend your heart',
      mendHeartAlt: 'Heart Weaver weaving light around a heart',
      cleanseThoughtsTitle: 'Use Ace\'s emotions to cleanse her intrusive thoughts',
      cleanseThoughtsAlt: 'Ace channeling emotions to clear intrusive thoughts',
      charismaticCompanionTitle: 'Charismatic and unique companion',
      charismaticCompanionAlt: 'Charismatic companion smiling with confidence',
      immersiveWorldTitle: 'Dive deep into a fantasy immersive world',
      immersiveWorldAlt: 'Heart Weaver fantasy world map',
      powerEmotionsTitle: 'Use the power of emotions',
      powerEmotionsGifAlts: [
        'Hope ability preview',
        'Courage ability preview',
        'Connection ability preview'
      ],
      powerEmotionsCenterAlt: 'Transparent Heart Weaver emblem'
    },
    minigamesExtra: {
      holdMouse: 'Hold your mouse button to start',
      holdAndMove: 'Hold and move to the points',
      enterEmail: 'Introduce email address'
    },
    gameData: {
      agents: {
        'baby-kraken': { name: 'Baby Kraken – Tiny Scout', description: 'Collects 1 Krakenling per second.' },
        'young-kraken': { name: 'Young Kraken – Steady Guardian', description: 'Collects 5 Krakenlings per second.' },
        'adult-kraken': { name: 'Adult Kraken – Deep Tide Keeper', description: 'Collects 20 Krakenlings per second.' },
        'elder-kraken': { name: 'Elder Kraken – Ancient Current', description: 'Collects 50 Krakenlings per second.' },
        'guardian-kraken': { name: 'Guardian Kraken', description: 'Collects 100 Krakenlings per second.' },
        'tide-master': { name: 'Tide Master', description: 'Flow with the tide.' },
        'den-keeper': { name: 'Den Keeper', description: 'Keeps the den safe.' },
        'the-player': { name: 'You', description: 'You are the treasure.' }
      },
      unlockables: {
        'home': { name: 'Home Page', description: 'Unlock main page.' },
        'games': { name: 'Games Page', description: 'Unlock games page.' },
        'team': { name: 'About Us', description: 'Unlock team page.' },
        'contact': { name: 'Contact', description: 'Unlock contact page.' },
        'newsletter': { name: 'Newsletter', description: 'Unlock newsletter.' },
        'courage-minigame': { name: 'Therapy: Courage', description: 'Unlock Courage.' },
        'connection-minigame': { name: 'Therapy: Connection', description: 'Unlock Connection.' },
        'healing-minigame': { name: 'Therapy: Healing', description: 'Unlock Healing.' },
        'true-heart': { name: 'True Heart of the Den', description: 'Final treasure.' },
        'passive-collection-1': { name: 'Gentle Currents', description: '+10% passive rate.' },
        'passive-collection-2': { name: 'Flowing Tides', description: '+25% passive rate.' },
        'passive-collection-3': { name: 'Deep Resonance', description: '+50% passive rate.' },
        'baby-multiplier-1': { name: 'Baby Kraken Boost I', description: '2x Baby Kraken.' },
        'young-multiplier-1': { name: 'Young Kraken Boost I', description: '2x Young Kraken.' },
        'adult-multiplier-1': { name: 'Adult Kraken Boost I', description: '2x Adult Kraken.' },
        'elder-multiplier-1': { name: 'Elder Kraken Boost I', description: '2x Elder Kraken.' },
        'guardian-multiplier-1': { name: 'Guardian Kraken Boost I', description: '2x Guardian Kraken.' },
        'tide-multiplier-1': { name: 'Tide Master Boost I', description: '2x Tide Master.' },
        'den-multiplier-1': { name: 'Den Keeper Boost I', description: '2x Den Keeper.' },
        'player-multiplier-1': { name: 'Your Boost I', description: '2x your rate.' },
        'hope-cooldown-1': { name: 'Hope Cooldown I', description: '-25% Hope cooldown.' },
        'courage-cooldown-1': { name: 'Courage Cooldown I', description: '-25% Courage cooldown.' },
        'connection-cooldown-1': { name: 'Connection Cooldown I', description: '-25% Connection cooldown.' },
        'healing-cooldown-1': { name: 'Healing Cooldown I', description: '-25% Healing cooldown.' },
        'hope-reward-1': { name: 'Hope Boost I', description: '2x Hope rewards.' },
        'hope-reward-2': { name: 'Hope Boost II', description: '3x Hope rewards.' },
        'courage-reward-1': { name: 'Courage Boost I', description: '2x Courage rewards.' },
        'courage-reward-2': { name: 'Courage Boost II', description: '3x Courage rewards.' },
        'connection-reward-1': { name: 'Connection Boost I', description: '2x Connection rewards.' },
        'connection-reward-2': { name: 'Connection Boost II', description: '3x Connection rewards.' },
        'healing-reward-1': { name: 'Healing Boost I', description: '2x Healing rewards.' },
        'healing-reward-2': { name: 'Healing Boost II', description: '3x Healing rewards.' },
        'all-therapies-reward-1': { name: 'Therapies Boost I', description: '+50% all rewards.' },
        'all-therapies-reward-2': { name: 'Therapies Boost II', description: '2x all rewards.' },
        'sound-button-click': { name: 'Sound Effects: Clicks & Collects', description: 'Unlock click sounds.' },
        'sound-minigame-hope': { name: 'Sound Effects: Hope Therapy', description: 'Unlock Hope sounds.' },
        'sound-minigame-courage': { name: 'Sound Effects: Courage Therapy', description: 'Unlock Courage sounds.' },
        'sound-minigame-connection': { name: 'Sound Effects: Connection Therapy', description: 'Unlock Connection sounds.' },
        'sound-minigame-healing': { name: 'Sound Effects: Healing Therapy', description: 'Unlock Healing sounds.' },
        'sound-music': { name: 'Background Music', description: 'Unlock background music.' },
        'collect-multiplier-10': { name: 'Collect Surge: 10', description: 'Manual collect gives 10 Krakenlings.' },
        'collect-multiplier-100': { name: 'Collect Surge: 100', description: 'Manual collect gives 100 Krakenlings.' },
        'collect-multiplier-500': { name: 'Collect Surge: 1000', description: 'Manual collect gives 1000 Krakenlings.' },
        'collect-percent-1': { name: 'Collect Flow: 1% KPS', description: 'Manual collect gives 1% of your total KPS.' },
        'collect-percent-2': { name: 'Collect Flow: 2% KPS', description: 'Manual collect gives 2% of your total KPS.' },
        'collect-all': { name: 'Collect All', description: 'When collecting a Krakenling, collect all Krakenlings on the page.' }
      },
      minigames: {
        'hope': { name: 'Hope – Follow the Light', description: 'Follow the light. Focus on one step at a time.' },
        'courage': { name: 'Courage – Hold the Pressure', description: 'Hold the button. Stay with discomfort a little longer.' },
        'connection': { name: 'Connection – Connect the Dots', description: 'Connect the letters. Build the word.' },
        'healing': { name: 'Healing – Breathing Rhythm', description: 'Tap with the rhythm. Notice your breath.' }
      },
      missions: {
        'visit-home': { name: 'Welcome to the Den', description: 'Visit the home page.' },
        'visit-games': { name: 'Discover the game', description: 'Learn about our games.' },
        'visit-team': { name: 'Meet the team', description: 'Meet the people behind the studio.' },
        'visit-contact': { name: 'Contact us', description: 'Visit the contact page.' },
        'hope-1': { name: 'Hope I', description: 'Complete Hope therapy for the first time.' },
        'hope-2': { name: 'Hope II', description: 'Complete Hope therapy 2 times.' },
        'hope-3': { name: 'Hope III', description: 'Complete Hope therapy 5 times.' },
        'hope-4': { name: 'Hope IV', description: 'Complete Hope therapy 10 times.' },
        'courage-1': { name: 'Courage I', description: 'Complete Courage therapy for the first time.' },
        'courage-2': { name: 'Courage II', description: 'Complete Courage therapy 2 times.' },
        'courage-3': { name: 'Courage III', description: 'Complete Courage therapy 5 times.' },
        'courage-4': { name: 'Courage IV', description: 'Complete Courage therapy 10 times.' },
        'connection-1': { name: 'Connection I', description: 'Complete Connection therapy for the first time.' },
        'connection-2': { name: 'Connection II', description: 'Complete Connection therapy 2 times.' },
        'connection-3': { name: 'Connection III', description: 'Complete Connection therapy 5 times.' },
        'connection-4': { name: 'Connection IV', description: 'Complete Connection therapy 10 times.' },
        'healing-1': { name: 'Healing I', description: 'Complete Healing therapy for the first time.' },
        'healing-2': { name: 'Healing II', description: 'Complete Healing therapy 2 times.' },
        'healing-3': { name: 'Healing III', description: 'Complete Healing therapy 5 times.' },
        'healing-4': { name: 'Healing IV', description: 'Complete Healing therapy 10 times.' },
        'buy-first-helper': { name: 'Ask for help', description: 'Get your first helper' },
        'own-3-helpers': { name: 'Initial Team', description: 'Get 3 different helpers working at the same time.' },
        'own-5-helpers': { name: 'Growing Team', description: 'Get 5 different helpers working at the same time.' },
        'own-10-helpers': { name: 'Full Team', description: 'Get 10 different helpers working at the same time.' },
        'collect-10': { name: 'Collector I', description: 'Save 10 Krakenlings.' },
        'collect-50': { name: 'Collector II', description: 'Save 50 Krakenlings.' },
        'collect-100': { name: 'Collector III', description: 'Save 100 Krakenlings.' },
        'collect-500': { name: 'Collector IV', description: 'Save 500 Krakenlings.' },
        'collect-1000': { name: 'Collector V', description: 'Save 1000 Krakenlings.' },
        'reach-5000': { name: 'Abundance I', description: 'Reach 5000 total Krakenlings.' },
        'reach-20000': { name: 'Abundance II', description: 'Reach 20000 total Krakenlings.' },
        'reach-50000': { name: 'Abundance III', description: 'Reach 50000 total Krakenlings.' },
        'reach-100000': { name: 'Abundance IV', description: 'Reach 100000 total Krakenlings.' },
        'reach-500000': { name: 'Abundance V', description: 'Reach 500000 total Krakenlings.' },
        'reach-1000000': { name: 'Abundance VI', description: 'Reach 1000000 total Krakenlings.' },
        'reach-2000000': { name: 'Abundance VII', description: 'Reach 2000000 total Krakenlings.' },
        'reach-50-kps': { name: 'Master I', description: 'Reach 50 Krakenlings per second.' },
        'reach-100-kps': { name: 'Master II', description: 'Reach 100 Krakenlings per second.' },
        'reach-200-kps': { name: 'Master III', description: 'Reach 200 Krakenlings per second.' },
        'reach-400-kps': { name: 'Master IV', description: 'Reach 400 Krakenlings per second.' },
        'reach-800-kps': { name: 'Master V', description: 'Reach 800 Krakenlings per second.' },
        'reach-1600-kps': { name: 'Master VI', description: 'Reach 1600 Krakenlings per second.' },
        'reach-3000-kps': { name: 'Master VII', description: 'Reach 3000 Krakenlings per second.' }
      },
      connectionWords: [
        'HOPE', 'LOVE', 'CALM', 'KIND', 'WARM', 'SAFE', 'HEAL', 'JOY', 'PEACE', 'TRUST',
        'GROW', 'OPEN', 'CARE', 'SOFT', 'GENTLE', 'BRAVE', 'STRONG', 'TRUE', 'REAL', 'FREE',
        'LIGHT', 'DEEP', 'QUIET', 'STILL', 'EASE', 'REST', 'GLOW', 'FLOW', 'RISE', 'BEAM'
      ]
    }
  },
  es: {
    common: {
      close: 'Cerrar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito'
    },
    header: {
      home: 'Inicio',
      team: 'Equipo',
      games: 'Juegos',
      contact: 'Contacto',
      openTreasure: 'Abrir Tesoro',
      aboutUs: 'Sobre Nosotros',
      lockedHome: 'Bloqueado. Obtén "Página de Inicio" en El Tesoro del Kraken para desbloquear esta parte de la guarida.',
      lockedTeam: 'Bloqueado. Obtén "Sobre Nosotros" en El Tesoro del Kraken para conocer al equipo.',
      lockedGames: 'Bloqueado. Obtén "Página de Juegos" en El Tesoro del Kraken para ver nuestros juegos.',
      lockedContact: 'Bloqueado. Obtén "Contacto" en El Tesoro del Kraken para desbloquear esta parte de la guarida.'
    },
    footer: {
      newsletter: 'Boletín',
      subscribe: 'Suscribirse',
      emailPlaceholder: 'Tu email',
      subscribed: '¡Suscrito!',
      socialMedia: 'Síguenos',
      letTheKraken: 'Deja que el',
      catchYou: 'te atrape',
      you: 'A TI',
      signUp: '¡Suscríbete!',
      lockedNewsletter: 'Completa la terapia de Sanación en el Viaje Emocional para desbloquear',
      lockedNewsletterDesc: 'Bloqueado. Obtén "Boletín" en El Tesoro del Kraken para recibir actualizaciones suaves y narrativas.',
      healingJourney: 'La sanación es un viaje continuo. Únete a nuestra comunidad desbloqueando el boletín en El Tesoro del Kraken.',
      copyright: '@ Kraken\'s Den Studios 2025',
      subscribeSuccess: '¡Gracias por suscribirte a nuestro boletín!',
      subscribeError: 'Ha ocurrido un error.',
      newsletterCopies: [
        "Sumérgete en la Guarida del Kraken – ¡nuestro boletín es la única fuente de diversión gaming aprobada por monstruos marinos!",
        "¡Suscríbete ahora y deja que el Kraken susurre secretos de gaming directamente en tu bandeja de entrada!",
        "Únete al círculo íntimo de la Guarida del Kraken – ¡donde los gamers se unen y los tentáculos escriben!",
        "¡No te quedes sin kraken! Regístrate para recibir actualizaciones que harán que le digas adiós al aburrimiento.",
        "¡Libera al kraken... de noticias gaming! Suscríbete hoy y que comience la aventura.",
        "No te pierdas actualizaciones legendarias – ¡suscríbete y deja que el kraken del conocimiento te ilumine!",
        "¿Listo para subir de nivel tu bandeja de entrada? ¡Deja que la Guarida del Kraken sea tu guía!",
        "Suscríbete ahora – ¡porque ni siquiera un kraken puede guardar secretos tan bien como nuestro boletín!",
        "Advertencia: Nuestro boletín podría contener rastros de risas inducidas por kraken y genialidad gaming.",
        "Dale un toque de emoción a tu bandeja de entrada – ¡únete a la tripulación de la Guarida del Kraken para una ola de actualizaciones gaming!",
        "Únete al club de fans de la Guarida del Kraken – ¡prometemos que nuestros tentáculos solo son para escribir!",
        "¡No seas un terrestre! Suscríbete ahora y surfea las olas de la grandeza gaming.",
        "¡Suscríbete para recibir actualizaciones más calientes que el café de un kraken!",
        "Porque los kraken saben mejor: ¡Suscribirse es igual a subir de nivel en la vida!",
        "Regístrate y deja que el kraken maneje tu dosis diaria de genialidad gaming.",
        "Nada con el kraken – ¡en un mar de noticias gaming y risas!",
        "¡Nuestro boletín es kraken-tástico! Suscríbete ahora y deja que comience la risa.",
        "Navega hacia el mundo del gaming épico – un boletín impulsado por kraken a la vez.",
        "¡Libera al kraken... de actualizaciones gaming! Suscríbete y deja que la diversión fluya.",
        "¡Porque la vida es demasiado corta para no tener un boletín aprobado por kraken en tu bandeja de entrada!",
        "¿Por qué temer lo desconocido cuando puedes abrazar el futuro gaming aprobado por kraken?",
        "Convierte tu bandeja de entrada en un parque de diversiones de alegría gaming – ¡gracias a la tripulación de la Guarida del Kraken!",
        "Suscríbete ahora – ¿el poder especial de nuestro kraken? ¡Hacer el gaming increíble!",
        "Únete a la Guarida del Kraken y haz que tu bandeja de entrada sea la envidia de todas las criaturas marinas.",
        "¡No te krak la cabeza por perderte algo – presiona suscribirse y que comience la diversión!",
        "Nuestro boletín es amado por kraken y aprobado por gamers – ¿qué más podrías querer?",
        "¡No se dañaron kraken en la creación de este boletín, pero se añadió mucha diversión!",
        "Cuidado con los ataques de tiburones – suscríbete al boletín de la Guarida del Kraken para una experiencia gaming más segura.",
        "Suscríbete ahora – ¡kraken y juegos de palabras, las dos cosas en las que no nos contenemos!",
        "¿Alguna vez escuchaste a un kraken contar un chiste? Ahora lo harás – ¡suscríbete para tu risa diaria!",
        "Conviértete en un Susurrador de Kraken – ¡suscríbete y deja que la magia gaming fluya!",
        "¡Libera la sabiduría del kraken en tu bandeja de entrada – suscríbete para la iluminación!",
        "Prepárate para ser kraken-eado – ¡nuestro boletín es aleta-tástico y tentáculo-rífico!",
        "¿Por qué el gamer cruzó el océano? ¡Para suscribirse y ponerse kraken con nosotros!",
        "¡Suscríbete para la versión del kraken de un mapa del tesoro – te lleva directo a la felicidad gaming!",
        "Dile adiós al aburrimiento – ¡los kraken insisten en una dosis diaria de nuestro boletín!",
        "¡Regístrate ahora y deja que el kraken te haga cosquillas en el hueso de la risa... y tus sentidos gaming!",
        "Tenemos el sello de aprobación del kraken – ¡suscríbete y surfea las olas gaming!",
        "Mantén la calma y deja que el kraken hable – ¡suscríbete ahora para un toque de diversión!",
        "Suscríbete y deja que el kraken cante historias de juegos legendarios en tus oídos.",
        "Si fueras un kraken, definitivamente te suscribirías – ¡solo digo!",
        "Un pulpo tiene ocho brazos, pero un boletín aprobado por kraken tiene diversión infinita – ¡suscríbete hoy!",
        "¡Porque incluso los kraken no pueden resistir el atractivo de nuestro boletín lleno de gaming!",
        "Nuestro boletín: ¡Donde los kraken y los gamers se unen en hilaridad armoniosa!",
        "Guarida del Kraken: ¡Donde los sueños gaming se hacen realidad – un botón de suscripción a la vez!",
        "¡Libera al kraken y libera tu potencial gaming – presiona suscribirse ahora!",
        "Suscríbete y haz que el kraken esté orgulloso – ¡es una elección tentacular!",
        "¿Cansado de lo ordinario? Suscríbete y deja que el kraken añada algo extraordinario a tu bandeja de entrada.",
        "¡Porque un boletín aprobado por kraken es como un power-up para tu bandeja de entrada – suscríbete!",
        "¡No se dañaron kraken en la creación de este boletín, pero compartimos algunas risas!",
        "¿Listo para krakear? ¡Suscríbete ahora y únete a la fiesta de la Guarida del Kraken!",
        "Guarida del Kraken: ¡El único lugar donde los tentáculos y las noticias gaming se llevan a la perfección!",
        "¡Suscríbete y deja que el kraken te guíe a través de los mares gaming de maravilla!",
        "¿Por qué conformarse con historias sospechosas cuando puedes tener historias gaming aprobadas por kraken?",
        "No podemos prometerte una mascota kraken, pero podemos prometerte un tiempo increíble – ¡suscríbete ahora!",
        "¡Conviértete en un conocedor de kraken – de actualizaciones gaming! Suscríbete hoy.",
        "Guarida del Kraken: ¡Donde la risa, el gaming y los tentáculos se entrelazan – suscríbete para la experiencia completa!",
        "¡Suscríbete ahora y deja que el kraken teja su tapiz mágico de bondad gaming!",
        "Guarida del Kraken: ¡El destino definitivo para gamers que aman un buen chapuzón – suscríbete y sumérgete!"
      ]
    },
    home: {
      title: 'Bienvenido a la Guarida del Kraken',
      subtitle: 'Un lugar donde las emociones encuentran su hogar',
      description: 'Recolecta Krakensitos, desbloquea terapias y encuentra tesoros.',
      openTreasure: 'Abrir Tesoro',
      enterDen: 'Acceder a la Guarida',
      welcomeHeart: 'Bienvenido al Corazón de la Guarida',
      descriptionFull: 'Recolecta Krakensitos, desbloquea terapias y encuentra tesoros. Juega a tu propio ritmo.',
      explore: 'EXPLORAR',
      exploreLocked: 'EXPLORAR 🔒',
      subscribe: 'SUSCRIBIRSE',
      subscribeLocked: 'SUSCRIBIRSE 🔒',
      meetUs: '¡CONÓCENOS!',
      meetUsLocked: '¡CONÓCENOS! 🔒',
      krakensGames: 'Nuestros Juegos'
    },
    firstVisit: {
      title: 'Bienvenido a la Guarida',
      subtitle: 'Un Krakenling te ha encontrado.',
      action: 'Sálvalo',
      instruction: 'Haz clic sobre el Krakenling para salvarlo'
    },
    treasure: {
      title: 'El Tesoro del Kraken',
      description: 'Intercambia Krakensitos por ayudantes, tesoros y terapias.',
      krakenlings: 'krakensitos',
      saved: 'salvados personalmente',
      perSecond: 'krakensitos/segundo',
      missions: 'Misiones',
      therapies: 'Terapias',
      helpers: 'Ayudantes',
      treasures: 'Tesoros',
      upgrades: 'Mejoras',
      get: 'OBTENER',
      owned: 'poseídos',
      unlocked: 'DESBLOQUEADO',
      requires: 'Requiere:',
      reward: 'Recompensa:',
      claim: 'Reclamar',
      claimed: 'Reclamado',
      readyToClaim: 'listas para reclamar',
      completed: '¡Completado!',
      go: 'IR',
      buy: 'Comprar',
      missionsDescription: 'Completa misiones para desbloquear nuevos ayudantes, tesoros y mejoras.',
      helpersDescription: 'Contrata ayudantes que automáticamente recolectan Krakensitos por ti. Cuantos más tengas, más recolectan.',
      helperPerHelper: 'por ayudante',
      helperTotalProduction: 'producción total',
      helperUpgradeBonus: 'por mejoras',
      missionRequiredLabel: 'Misión requerida:',
      missionUnlockHint: 'Completa esta misión para desbloquear',
      tapToPlay: 'Toca en cualquier lugar para jugar',
      clickNow: 'Haz clic ahora',
      wait: 'Espera...',
      tryAgain: 'Intenta de nuevo',
      followRhythm: 'Sigue el ritmo...',
      now: '¡Ahora!',
      hold: 'Mantén',
      holdButton: 'Mantén...',
      progress: 'Progreso:',
      correctClicks: 'Clics correctos:',
      incorrectOrder: 'Orden incorrecto. Intenta de nuevo.',
      formed: 'Formaste:',
      established: 'Has establecido la conexión',
      play: 'COMENZAR',
      therapyNeedsTime: 'La terapia necesita tiempo para asentarse. Vuelve en',
      finalTreasureMessage: 'Has llegado a la parte más profunda de la guarida.\n\nHas recolectado Krakenlings, desbloqueado páginas y completado terapias – pero nada de eso importa más que esto:\n\nTe presentaste. Jugaste. Sentiste.\n\nLa Guarida del Kraken nunca fue sobre encontrar algo fuera de ti.\nFue sobre notar el coraje, la ternura y la resiliencia que ya llevas contigo.\n\nGracias por darle a tus emociones un lugar para respirar.'
    },
    missions: {
      visitHome: 'Bienvenida',
      visitGames: 'Visitar Juegos',
      visitTeam: 'Visitar Equipo',
      visitContact: 'Visitar Contacto',
      buyFirstHelper: 'Comprar Primer Ayudante',
      collect10: 'Recolecta 10 Krakensitos',
      collect50: 'Recolecta 50 Krakensitos',
      collect100: 'Recolecta 100 Krakensitos',
      collect750: 'Recolecta 750 Krakensitos',
      collect1500: 'Recolecta 1500 Krakensitos',
      collect3000: 'Recolecta 3000 Krakensitos',
      collect6000: 'Recolecta 6000 Krakensitos',
      reach100: 'Alcanza 100 Krakensitos',
      reach500: 'Alcanza 500 Krakensitos',
      reach1000: 'Alcanza 1000 Krakensitos',
      reach5000: 'Alcanza 5000 Krakensitos',
      reach10000: 'Alcanza 10000 Krakensitos',
      reach50000: 'Alcanza 50000 Krakensitos',
      reach100000: 'Alcanza 100000 Krakensitos',
      reach500000: 'Alcanza 500000 Krakensitos',
      reach1000000: 'Alcanza 1000000 Krakensitos',
      reach10Kps: 'Alcanza 10 KPS',
      reach50Kps: 'Alcanza 50 KPS',
      reach100Kps: 'Alcanza 100 KPS',
      reach200Kps: 'Alcanza 200 KPS',
      reach400Kps: 'Alcanza 400 KPS',
      reach800Kps: 'Alcanza 800 KPS',
      reach1600Kps: 'Alcanza 1600 KPS',
      hope1: 'Esperanza I',
      hope2: 'Esperanza II',
      hope3: 'Esperanza III',
      hope4: 'Esperanza IV',
      courage1: 'Valor I',
      courage2: 'Valor II',
      courage3: 'Valor III',
      courage4: 'Valor IV',
      connection1: 'Conexión I',
      connection2: 'Conexión II',
      connection3: 'Conexión III',
      connection4: 'Conexión IV',
      healing1: 'Sanación I',
      healing2: 'Sanación II',
      healing3: 'Sanación III',
      healing4: 'Sanación IV',
      own3Helpers: 'Poseer 3 Ayudantes'
    },
    minigames: {
      hope: 'Esperanza',
      courage: 'Valor',
      connection: 'Conexión',
      healing: 'Sanación',
      completed: '¡Completado!',
      followLight: 'Has seguido la luz de la esperanza',
      shownCourage: 'Has mostrado valor',
      formedWord: 'Formaste:',
      foundRhythm: 'Has encontrado tu ritmo de sanación'
    },
    contact: {
      title: 'Contáctanos',
      subtitle: 'Ponte en contacto con nosotros o mantente conectado a través de nuestro boletín',
      email: 'Email',
      newsletter: 'Boletín',
      subscribe: 'Suscribirse',
      subscribed: '¡Suscrito!',
      subscribing: 'Suscribiendo...',
      enterEmail: 'Ingresa tu email',
      thankYou: '¡Gracias por suscribirte!',
      locked: 'El boletín está bloqueado',
      lockedDesc: 'Desbloquea el Boletín en El Tesoro del Kraken para suscribirte.'
    },
    team: {
      title: 'Nuestro Equipo',
      subtitle: 'Conoce a las personas detrás de la Guarida del Kraken',
      members: [
        {
          name: 'Carlos Martínez',
          role: 'Diseñador de Juegos',
          description: 'La cara del equipo, está presente donde haga falta ser sociable y amable. También es el responsable de que el juego no sea un simulador de caminar.'
        },
        {
          name: 'David Tàrrega',
          role: 'Diseñador de Niveles',
          description: 'Empezó como estudiante y algún día se convertirá en maestro. Podría aparecer en la serie de anime de voleibol.'
        },
        {
          name: 'Meritxell',
          role: 'Diseñadora Narrativa',
          description: 'Encargada de las historias y de los textos con los que, idealmente, todo el mundo reirá, llorará y se emocionará. Le gusta el color turquesa y los gatos.'
        },
        {
          name: 'José Manuel Correa',
          role: 'Animador',
          description: 'Encargado de dar vida a los personajes. También ayuda a modelar y en lo que sea necesario.'
        },
        {
          name: 'Ergoni',
          role: 'Artista 3D',
          description: 'El culpable de que tengamos modelos 3D tan bonitos.'
        },
        {
          name: 'Enric',
          role: 'Muchos',
          description: 'Gestión del equipo, del código, de la producción, de la programación... Lo que haga falta. Me obligan a escribir que nadie me ha dicho que no me están obligando a hacer horas extra para comprarle más juguetes y comida a mi perro y a mis dos gatos.'
        }
      ],
      finalText: 'Unidos por la pasión de crear experiencias que sanan y transforman, trabajamos juntos para dar vida a historias que resuenan en el corazón.'
    },
    heartWeaver: {
      coverAlt: 'Portada de Heart Weaver',
      titleAlt: 'Título de Heart Weaver',
      introText: 'Cuando el yo se rompe en mil pedazos, cuando ya no puedes ser tú mismo, embárcate en una aventura, siente de nuevo...',
      mainTitle: 'Deja que HeartWeaver repare tu corazón',
      storyBegins: 'Una Historia Comienza...',
      storyDescription1: 'HeartWeaver es una aventura de acción emocional y narrativa con un sistema de habilidades dinámico.',
      storyDescription2: 'La pérdida y la culpa han hecho que Ace desee nunca volver a sentir nada...',
      aceAlt: 'Ace de HeartWeaver',
      friendsAndFoes: 'Amigos y Enemigos',
      friendsDescription1: 'Embárcate en un viaje cautivador a través de este reino retorcido atrapado por el desequilibrio de las emociones de Ace.',
      friendsDescription2: 'Ayuda a Ace a abrazar sus emociones de nuevo y únete a Mark y sus seres queridos.',
      markAlt: 'Mark de HeartWeaver',
      decideFate: 'Decide el Destino de Ace',
      fateDescription1: 'Tienes el poder de restaurar las emociones de Ace a su armonía legítima o dejarlas desvanecerse para siempre...',
      fateDescription2: '... El futuro de Ace descansa en tus manos.',
      bookAlt: 'Libro de HeartWeaver',
      mendHeartTitle: 'Deja que la Heart Weaver sane tu corazón',
      mendHeartAlt: 'Heart Weaver envolviendo un corazón con luz sanadora',
      cleanseThoughtsTitle: 'Usa las emociones de Ace para limpiar sus pensamientos intrusivos',
      cleanseThoughtsAlt: 'Ace canalizando emociones para purificar sus pensamientos',
      charismaticCompanionTitle: 'Compañera carismática y única',
      charismaticCompanionAlt: 'Compañera carismática sonriendo con confianza',
      immersiveWorldTitle: 'Sumérgete en un mundo de fantasía inmersivo',
      immersiveWorldAlt: 'Mapa fantástico del mundo de Heart Weaver',
      powerEmotionsTitle: 'Utiliza el poder de las emociones',
      powerEmotionsGifAlts: [
        'Vista previa de la habilidad de esperanza',
        'Vista previa de la habilidad de valor',
        'Vista previa de la habilidad de conexión'
      ],
      powerEmotionsCenterAlt: 'Emblema transparente de Heart Weaver'
    },
    minigamesExtra: {
      holdMouse: 'Presiona el botón del ratón para empezar',
      holdAndMove: 'Haz click y mantén pulsado mientras te mueves a los puntos',
      enterEmail: 'Introduce tu email'
    },
    gameData: {
      agents: {
        'baby-kraken': { name: 'Bebé Kraken – Pequeño Explorador', description: 'Recolecta 1 Krakenling por segundo.' },
        'young-kraken': { name: 'Kraken Joven – Guardián Constante', description: 'Recolecta 5 Krakenlings por segundo.' },
        'adult-kraken': { name: 'Kraken Adulto – Guardián de la Marea Profunda', description: 'Recolecta 20 Krakenlings por segundo.' },
        'elder-kraken': { name: 'Kraken Anciano – Corriente Antigua', description: 'Recolecta 50 Krakenlings por segundo.' },
        'guardian-kraken': { name: 'Kraken Guardián', description: 'Recolecta 100 Krakenlings por segundo.' },
        'tide-master': { name: 'Maestro de la Marea', description: 'Fluye con la marea.' },
        'den-keeper': { name: 'Guardián de la Guarida', description: 'Mantiene la guarida segura.' },
        'the-player': { name: 'Tú', description: 'Tú eres el tesoro.' }
      },
      unlockables: {
        'home': { name: 'Página de Inicio', description: 'Desbloquea la página principal.' },
        'games': { name: 'Página de Juegos', description: 'Desbloquea la página de juegos.' },
        'team': { name: 'Sobre Nosotros', description: 'Desbloquea la página del equipo.' },
        'contact': { name: 'Contacto', description: 'Desbloquea la página de contacto.' },
        'newsletter': { name: 'Boletín', description: 'Desbloquea el boletín.' },
        'courage-minigame': { name: 'Terapia: Valor', description: 'Desbloquea Valor.' },
        'connection-minigame': { name: 'Terapia: Conexión', description: 'Desbloquea Conexión.' },
        'healing-minigame': { name: 'Terapia: Sanación', description: 'Desbloquea Sanación.' },
        'true-heart': { name: 'Corazón Verdadero de la Guarida', description: 'Tesoro final.' },
        'passive-collection-1': { name: 'Corrientes Suaves', description: '+10% de tasa pasiva.' },
        'passive-collection-2': { name: 'Mareas Fluyentes', description: '+25% de tasa pasiva.' },
        'passive-collection-3': { name: 'Resonancia Profunda', description: '+50% de tasa pasiva.' },
        'baby-multiplier-1': { name: 'Impulso Bebé Kraken I', description: '2x Bebé Kraken.' },
        'young-multiplier-1': { name: 'Impulso Kraken Joven I', description: '2x Kraken Joven.' },
        'adult-multiplier-1': { name: 'Impulso Kraken Adulto I', description: '2x Kraken Adulto.' },
        'elder-multiplier-1': { name: 'Impulso Kraken Anciano I', description: '2x Kraken Anciano.' },
        'guardian-multiplier-1': { name: 'Impulso Kraken Guardián I', description: '2x Kraken Guardián.' },
        'tide-multiplier-1': { name: 'Impulso Maestro de la Marea I', description: '2x Maestro de la Marea.' },
        'den-multiplier-1': { name: 'Impulso Guardián de la Guarida I', description: '2x Guardián de la Guarida.' },
        'player-multiplier-1': { name: 'Tu Impulso I', description: '2x tu tasa.' },
        'hope-cooldown-1': { name: 'Esperanza Enfriamiento I', description: '-25% de enfriamiento de Esperanza.' },
        'courage-cooldown-1': { name: 'Valor Enfriamiento I', description: '-25% de enfriamiento de Valor.' },
        'connection-cooldown-1': { name: 'Conexión Enfriamiento I', description: '-25% de enfriamiento de Conexión.' },
        'healing-cooldown-1': { name: 'Sanación Enfriamiento I', description: '-25% de enfriamiento de Sanación.' },
        'hope-reward-1': { name: 'Impulso Esperanza I', description: '2x recompensas de Esperanza.' },
        'hope-reward-2': { name: 'Impulso Esperanza II', description: '3x recompensas de Esperanza.' },
        'courage-reward-1': { name: 'Impulso Valor I', description: '2x recompensas de Valor.' },
        'courage-reward-2': { name: 'Impulso Valor II', description: '3x recompensas de Valor.' },
        'connection-reward-1': { name: 'Impulso Conexión I', description: '2x recompensas de Conexión.' },
        'connection-reward-2': { name: 'Impulso Conexión II', description: '3x recompensas de Conexión.' },
        'healing-reward-1': { name: 'Impulso Sanación I', description: '2x recompensas de Sanación.' },
        'healing-reward-2': { name: 'Impulso Sanación II', description: '3x recompensas de Sanación.' },
        'all-therapies-reward-1': { name: 'Impulso Terapias I', description: '+50% todas las recompensas.' },
        'all-therapies-reward-2': { name: 'Impulso Terapias II', description: '2x todas las recompensas.' },
        'sound-button-click': { name: 'Efectos de Sonido: Clics y Recolecciones', description: 'Desbloquea sonidos de clic.' },
        'sound-minigame-hope': { name: 'Efectos de Sonido: Terapia Esperanza', description: 'Desbloquea sonidos de Esperanza.' },
        'sound-minigame-courage': { name: 'Efectos de Sonido: Terapia Valor', description: 'Desbloquea sonidos de Valor.' },
        'sound-minigame-connection': { name: 'Efectos de Sonido: Terapia Conexión', description: 'Desbloquea sonidos de Conexión.' },
        'sound-minigame-healing': { name: 'Efectos de Sonido: Terapia Sanación', description: 'Desbloquea sonidos de Sanación.' },
        'sound-music': { name: 'Música de Fondo', description: 'Desbloquea música de fondo.' },
        'collect-multiplier-10': { name: 'Oleada de Recolección: 10', description: 'Recolección manual da 10 Krakenlings.' },
        'collect-multiplier-100': { name: 'Oleada de Recolección: 100', description: 'Recolección manual da 100 Krakenlings.' },
        'collect-multiplier-500': { name: 'Oleada de Recolección: 1000', description: 'Recolección manual da 1000 Krakenlings.' },
        'collect-percent-1': { name: 'Tsunami de Recolección I', description: 'Recolección manual da 5 veces tu KPS.' },
        'collect-percent-2': { name: 'Tsunami de Recolección II', description: 'Recolección manual da 10 veces tu KPS.' },
        'collect-all': { name: 'Recolectar Todo', description: 'Al recolectar un Krakenling, recolecta todos los Krakenlings de la página.' }
      },
      minigames: {
        'hope': { name: 'Esperanza – Sigue la Luz', description: 'Sigue la luz. Enfócate en un paso a la vez.' },
        'courage': { name: 'Valor – Mantén la Presión', description: 'Mantén el botón. Quédate con la incomodidad un poco más.' },
        'connection': { name: 'Conexión – Conecta los Puntos', description: 'Conecta las letras. Construye la palabra.' },
        'healing': { name: 'Sanación – Ritmo de Respiración', description: 'Toca con el ritmo. Nota tu respiración.' }
      },
      missions: {
        'visit-home': { name: 'Bienvenida a la Guarida', description: 'Visita la página de inicio.' },
        'visit-games': { name: 'Descubre el juego', description: 'Conoce nuestros juegos.' },
        'visit-team': { name: 'Conoce al equipo', description: 'Conoce a las personas detrás del estudio.' },
        'visit-contact': { name: 'Contáctanos', description: 'Visita la página de contacto.' },
        'hope-1': { name: 'Esperanza I', description: 'Completa la terapia de Esperanza por primera vez.' },
        'hope-2': { name: 'Esperanza II', description: 'Completa la terapia de Esperanza 2 veces.' },
        'hope-3': { name: 'Esperanza III', description: 'Completa la terapia de Esperanza 5 veces.' },
        'hope-4': { name: 'Esperanza IV', description: 'Completa la terapia de Esperanza 10 veces.' },
        'courage-1': { name: 'Valor I', description: 'Completa la terapia de Valor por primera vez.' },
        'courage-2': { name: 'Valor II', description: 'Completa la terapia de Valor 2 veces.' },
        'courage-3': { name: 'Valor III', description: 'Completa la terapia de Valor 5 veces.' },
        'courage-4': { name: 'Valor IV', description: 'Completa la terapia de Valor 10 veces.' },
        'connection-1': { name: 'Conexión I', description: 'Completa la terapia de Conexión por primera vez.' },
        'connection-2': { name: 'Conexión II', description: 'Completa la terapia de Conexión 2 veces.' },
        'connection-3': { name: 'Conexión III', description: 'Completa la terapia de Conexión 5 veces.' },
        'connection-4': { name: 'Conexión IV', description: 'Completa la terapia de Conexión 10 veces.' },
        'healing-1': { name: 'Sanación I', description: 'Completa la terapia de Sanación por primera vez.' },
        'healing-2': { name: 'Sanación II', description: 'Completa la terapia de Sanación 2 veces.' },
        'healing-3': { name: 'Sanación III', description: 'Completa la terapia de Sanación 5 veces.' },
        'healing-4': { name: 'Sanación IV', description: 'Completa la terapia de Sanación 10 veces.' },
        'buy-first-helper': { name: 'Pide ayuda', description: 'Obtén tu primer ayudante' },
        'own-3-helpers': { name: 'Equipo Inicial', description: 'Consigue 3 ayudantes diferentes trabajando al mismo tiempo.' },
        'own-5-helpers': { name: 'Equipo en Crecimiento', description: 'Consigue 5 ayudantes diferentes trabajando al mismo tiempo.' },
        'own-10-helpers': { name: 'Equipo Completo', description: 'Consigue 10 ayudantes diferentes trabajando al mismo tiempo.' },
        'collect-10': { name: 'Recolector I', description: 'Salva personalmente a 10 Krakenlings.' },
        'collect-50': { name: 'Recolector II', description: 'Salva personalmente a 50 Krakenlings.' },
        'collect-100': { name: 'Recolector III', description: 'Salva personalmente a 100 Krakenlings.' },
        'collect-500': { name: 'Recolector IV', description: 'Salva personalmente a 500 Krakenlings.' },
        'collect-1000': { name: 'Recolector V', description: 'Salva personalmente a 1000 Krakenlings.' },
        'reach-5000': { name: 'Abundancia I', description: 'Alcanza 5000 Krakenlings en total.' },
        'reach-20000': { name: 'Abundancia II', description: 'Alcanza 20000 Krakenlings en total.' },
        'reach-50000': { name: 'Abundancia III', description: 'Alcanza 50000 Krakenlings en total.' },
        'reach-100000': { name: 'Abundancia IV', description: 'Alcanza 100000 Krakenlings en total.' },
        'reach-500000': { name: 'Abundancia V', description: 'Alcanza 500000 Krakenlings en total.' },
        'reach-1000000': { name: 'Abundancia VI', description: 'Alcanza 1000000 Krakenlings en total.' },
        'reach-2000000': { name: 'Abundancia VII', description: 'Alcanza 2000000 Krakenlings en total.' },
        'reach-50-kps': { name: 'Maestro I', description: 'Alcanza 50 Krakenlings por segundo.' },
        'reach-100-kps': { name: 'Maestro II', description: 'Alcanza 100 Krakenlings por segundo.' },
        'reach-200-kps': { name: 'Maestro III', description: 'Alcanza 200 Krakenlings por segundo.' },
        'reach-400-kps': { name: 'Maestro IV', description: 'Alcanza 400 Krakenlings por segundo.' },
        'reach-800-kps': { name: 'Maestro V', description: 'Alcanza 800 Krakenlings por segundo.' },
        'reach-1600-kps': { name: 'Maestro VI', description: 'Alcanza 1600 Krakenlings por segundo.' },
        'reach-3000-kps': { name: 'Maestro VII', description: 'Alcanza 3000 Krakenlings por segundo.' }
      },
      connectionWords: [
        'ESPERANZA', 'AMOR', 'CALMA', 'AMABLE', 'CÁLIDO', 'SEGURO', 'SANAR', 'ALEGRÍA', 'PAZ', 'CONFIANZA',
        'CRECER', 'ABRIR', 'CUIDAR', 'SUAVE', 'GENTIL', 'VALIENTE', 'FUERTE', 'VERDADERO', 'REAL', 'LIBRE',
        'LUZ', 'PROFUNDO', 'SILENCIO', 'QUIETO', 'FACILIDAD', 'DESCANSO', 'BRILLO', 'FLUIR', 'ELEVARSE', 'RAYO'
      ]
    }
  },
  ca: {
    common: {
      close: 'Tancar',
      loading: 'Carregant...',
      error: 'Error',
      success: 'Èxit'
    },
    header: {
      home: 'Inici',
      team: 'Equip',
      games: 'Jocs',
      contact: 'Contacte',
      openTreasure: 'Obrir Tresor',
      aboutUs: 'Sobre Nosaltres',
      lockedHome: 'Bloquejat. Obtén "Pàgina d\'Inici" al Tresor del Kraken per desbloquejar aquesta part de la guarida.',
      lockedTeam: 'Bloquejat. Obtén "Sobre Nosaltres" al Tresor del Kraken per conèixer l\'equip.',
      lockedGames: 'Bloquejat. Obtén "Pàgina de Jocs" al Tresor del Kraken per veure els nostres jocs.',
      lockedContact: 'Bloquejat. Obtén "Contacte" al Tresor del Kraken per desbloquejar aquesta part de la guarida.'
    },
    footer: {
      newsletter: 'Butlletí',
      subscribe: 'Subscriure\'s',
      emailPlaceholder: 'El teu email',
      subscribed: '¡Subscrit!',
      socialMedia: 'Segueix-nos',
      letTheKraken: 'Deixa que el',
      catchYou: 'et capturi',
      you: '',
      signUp: 'Subscriu-te!',
      lockedNewsletter: 'Completa la teràpia de Sanació al Viatge Emocional per desbloquejar',
      lockedNewsletterDesc: 'Bloquejat. Obtén "Butlletí" al Tresor del Kraken per rebre actualitzacions suaus i narratives.',
      healingJourney: 'La sanació és un viatge continu. Uneix-te a la nostra comunitat desbloquejant el butlletí al Tresor del Kraken.',
      copyright: '@ Kraken\'s Den Studios 2025',
      subscribeSuccess: 'Gràcies per subscriure\'t al nostre butlletí!',
      subscribeError: 'S\'ha produït un error.',
      newsletterCopies: [
        "Submergeix-te a la Guarida del Kraken – el nostre butlletí és l'única font de diversió tenticular aprovada per monstres marins!",
        "Subscriu-te ara i deixa que el Kraken xiuxiuegi secrets de tentacles directament al teu correu!",
        "Uneix-te al cercle íntim de la Guarida del Kraken – on els gamers s'uneixen i els tentacles escriuen!",
        "No et quedis sense la teva ració de kraken! Registra't per rebre actualitzacions que faran que diguis adéu a l'avorriment.",
        "Allibera el kraken... de notícies gaming! Subscriu-te avui i que comenci l'aventura.",
        "No et perdis actualitzacions llegendàries – subscriu-te i deixa que els tentacles del coneixement t'il·lumini!",
        "Llest per pujar de nivell el teu correu? Deixa que la Guarida del Kraken sigui el teu guia!",
        "Subscriu-te ara – perquè ni tan sols un kraken pot guardar secrets tant bé com el nostre butlletí!",
        "Advertència: El nostre butlletí podria contenir rastres de riures induïts per tentacles.",
        "Dona un toc d'emoció al teu correu – uneix-te a la tripulació de la Guarida del Kraken per una onada d'actualitzacions gaming!",
        "Uneix-te al club de fans de la Guarida del Kraken – prometem que els nostres tentacles només són per escriure!",
        "No siguis un terrestre! Subscriu-te ara i surfeja les ones de la grandesa gaming.",
        "Subscriu-te per rebre actualitzacions més calentes que el cafè d'un kraken!",
        "Perquè els kraken saben millor: Subscriure's és igual a pujar de nivell a la vida!",
        "Registra't i deixa que el kraken gestioni la teva dosi diària de genialitat gaming.",
        "Nada amb el kraken – en un mar de notícies gaming i riures!",
        "El nostre butlletí és kraken-tàstic! Subscriu-te ara i deixa que comenci la rialla.",
        "Navega cap al món del gaming èpic – un butlletí impulsat per kraken a la vegada.",
        "Allibera el kraken... d'actualitzacions gaming! Subscriu-te i deixa que la diversió flueixi.",
        "Perquè la vida és massa curta per no tenir un butlletí aprovat per kraken al teu correu!",
        "Per què temer l'desconegut quan pots abraçar el futur gaming aprovat per kraken?",
        "Converteix el teu correu en un parc d'atraccions d'alegria gaming – gràcies a la tripulació de la Guarida del Kraken!",
        "Subscriu-te ara – el poder especial del nostre kraken? Fer el gaming increïble!",
        "Uneix-te a la Guarida del Kraken i fes que el teu correu sigui l'enveja de totes les criatures marines.",
        "No et krak el cap per perdre't alguna cosa – prem subscriure's i que comenci la diversió!",
        "El nostre butlletí és estimat per kraken i aprovat per gamers – què més podries voler?",
        "No es van ferir kraken en la creació d'aquest butlletí, però s'hi va afegir molta diversió!",
        "Cura amb els atacs de taurons – subscriu-te al butlletí de la Guarida del Kraken per una experiència gaming més segura.",
        "Subscriu-te ara – kraken i jocs de paraules, les dues coses en què no ens contenim!",
        "Has sentit mai un kraken explicar una broma? Ara ho faràs – subscriu-te per la teva rialla diària!",
        "Converteix-te en un Susurrador de Kraken – subscriu-te i deixa que la màgia gaming flueixi!",
        "Allibera la saviesa del kraken al teu correu – subscriu-te per la il·luminació!",
        "Prepara't per ser kraken-eat – el nostre butlletí és aleta-tàstic i tentacle-rífic!",
        "Per què el gamer va creuar l'oceà? Per subscriure's i posar-se kraken amb nosaltres!",
        "Subscriu-te per la versió del kraken d'un mapa del tresor – et porta directe a la felicitat gaming!",
        "Digues adéu a l'avorriment – els kraken insisteixen en una dosi diària del nostre butlletí!",
        "Registra't ara i deixa que el kraken et faci pessigolles a l'os de la rialla... i els teus sentits gaming!",
        "Tenim el segell d'aprovació del kraken – subscriu-te i surfeja les ones gaming!",
        "Mantingues la calma i deixa que el kraken parli – subscriu-te ara per un toc de diversió!",
        "Subscriu-te i deixa que el kraken canti històries de jocs llegendaris als teus oïdes.",
        "Si fossis un kraken, definitivament et subscriuries – només dic!",
        "Un pop té vuit braços, però un butlletí aprovat per kraken té diversió infinita – subscriu-te avui!",
        "Perquè fins i tot els kraken no poden resistir l'atractiu del nostre butlletí ple de gaming!",
        "El nostre butlletí: On els kraken i els gamers s'uneixen en hilaritat harmònica!",
        "Guarida del Kraken: On els somnis gaming es fan realitat – un botó de subscripció a la vegada!",
        "Allibera el kraken i allibera el teu potencial gaming – prem subscriure's ara!",
        "Subscriu-te i fes que el kraken estigui orgullós – és una elecció tentacular!",
        "Cansat de l'ordinari? Subscriu-te i deixa que el kraken afegeixi alguna cosa extraordinària al teu correu.",
        "Perquè un butlletí aprovat per kraken és com un power-up per al teu correu – subscriu-te!",
        "No es van ferir kraken en la creació d'aquest butlletí, però vam compartir algunes rialles!",
        "Llest per krakear? Subscriu-te ara i uneix-te a la festa de la Guarida del Kraken!",
        "Guarida del Kraken: L'únic lloc on els tentacles i les notícies gaming s'entenen perfectament!",
        "Subscriu-te i deixa que el kraken et guiï a través dels mars gaming de meravella!",
        "Per què conformar-se amb històries sospitoses quan pots tenir històries gaming aprovades per kraken?",
        "No podem prometre't una mascota kraken, però podem prometre't un temps increïble – subscriu-te ara!",
        "Converteix-te en un coneixedor de kraken – d'actualitzacions gaming! Subscriu-te avui.",
        "Guarida del Kraken: On la rialla, el gaming i els tentacles s'entrellacen – subscriu-te per l'experiència completa!",
        "Subscriu-te ara i deixa que el kraken teixi el seu tapís màgic de bondat gaming!",
        "Guarida del Kraken: El destí definitiu per gamers que estimen una bona esbofada – subscriu-te i submergeix-te!"
      ]
    },
    home: {
      title: 'Benvingut a la Guarida del Kraken',
      subtitle: 'Un lloc on les emocions troben la seva llar',
      description: 'Recull Krakenets, desbloqueja teràpies i descobreix tresors.',
      openTreasure: 'Obrir Tresor',
      enterDen: 'Entrar a la Guarida',
      welcomeHeart: 'Benvingut al Cor del Kraken',
      descriptionFull: 'Recull Krakenets, desbloqueja teràpies i descobreix tresors. Juga al teu propi ritme.',
      explore: 'EXPLORAR',
      exploreLocked: 'EXPLORAR 🔒',
      subscribe: 'SUBSCRIURE\'S',
      subscribeLocked: 'SUBSCRIURE\'S 🔒',
      meetUs: 'CONÈIX-NOS!',
      meetUsLocked: 'CONÈIX-NOS! 🔒',
      krakensGames: 'Els nostres Jocs'
    },
    firstVisit: {
      title: 'Benvingut a la Guarida',
      subtitle: 'Un Krakenling t\'ha trobat.',
      action: 'Salva\'l',
      instruction: 'Fes clic al Krakenling per salvar-lo'
    },
    treasure: {
      title: 'El Tresor del Kraken',
      description: 'Intercanvia Krakenets per ajudants, tresors i teràpies.',
      krakenlings: 'krakenets',
      saved: 'salvats personalment',
      perSecond: 'krakenets/segon',
      missions: 'Missions',
      therapies: 'Teràpies',
      helpers: 'Ajudants',
      treasures: 'Tresors',
      upgrades: 'Millores',
      get: 'OBTENIR',
      owned: 'posseïts',
      unlocked: 'DESBLOQUEJAT',
      requires: 'Requereix:',
      reward: 'Recompensa:',
      claim: 'Reclamar',
      claimed: 'Reclamat',
      readyToClaim: 'llestes per reclamar',
      completed: '¡Completat!',
      go: 'Visitar',
      buy: 'Comprar',
      missionsDescription: 'Completa missions per desbloquejar nous ajudants, tresors i millores.',
      helpersDescription: 'Contracta ajudants que automàticament recullen Krakenets per tu. Com més en tinguis, més recullen.',
      helperPerHelper: 'per ajudant',
      helperTotalProduction: 'producció total',
      helperUpgradeBonus: 'per millores',
      missionRequiredLabel: 'Missió requerida:',
      missionUnlockHint: 'Completa aquesta missió per desbloquejar',
      tapToPlay: 'Toca en qualsevol lloc per jugar',
      clickNow: 'Fes clic ara',
      wait: 'Espera...',
      tryAgain: 'Torna a intentar',
      followRhythm: 'Segueix el ritme...',
      now: '¡Ara!',
      hold: 'Mantén',
      holdButton: 'Mantén...',
      progress: 'Progrés:',
      correctClicks: 'Clics correctes:',
      incorrectOrder: 'Ordre incorrecte. Torna a intentar.',
      formed: 'Has format:',
      established: 'Has establert la connexió',
      play: 'COMENÇAR',
      therapyNeedsTime: 'La teràpia necessita temps per establir-se. Torna en',
      finalTreasureMessage: 'Has arribat a la part més profunda de la guarida.\n\nHas recollit Krakenlings, desbloquejat pàgines i completat teràpies – però res d\'això importa més que això:\n\nT\'has presentat. Has jugat. Has sentit.\n\nLa Guarida del Kraken mai va ser sobre trobar alguna cosa fora de tu.\nVa ser sobre notar el coratge, la tendresa i la resilència que ja portes amb tu.\n\nGràcies per donar-li a les teves emocions un lloc per respirar.'
    },
    missions: {
      visitHome: 'Benvinguda',
      visitGames: 'Visitar Jocs',
      visitTeam: 'Visitar Equip',
      visitContact: 'Visitar Contacte',
      buyFirstHelper: 'Comprar Primer Ajudant',
      collect10: 'Recull 10 Krakenets',
      collect50: 'Recull 50 Krakenets',
      collect100: 'Recull 100 Krakenets',
      collect750: 'Recull 750 Krakenets',
      collect1500: 'Recull 1500 Krakenets',
      collect3000: 'Recull 3000 Krakenets',
      collect6000: 'Recull 6000 Krakenets',
      reach100: 'Arriba a 100 Krakenets',
      reach500: 'Arriba a 500 Krakenets',
      reach1000: 'Arriba a 1000 Krakenets',
      reach5000: 'Arriba a 5000 Krakenets',
      reach10000: 'Arriba a 10000 Krakenets',
      reach50000: 'Arriba a 50000 Krakenets',
      reach100000: 'Arriba a 100000 Krakenets',
      reach500000: 'Arriba a 500000 Krakenets',
      reach1000000: 'Arriba a 1000000 Krakenets',
      reach10Kps: 'Arriba a 10 KPS',
      reach50Kps: 'Arriba a 50 KPS',
      reach100Kps: 'Arriba a 100 KPS',
      reach200Kps: 'Arriba a 200 KPS',
      reach400Kps: 'Arriba a 400 KPS',
      reach800Kps: 'Arriba a 800 KPS',
      reach1600Kps: 'Arriba a 1600 KPS',
      hope1: 'Esperança I',
      hope2: 'Esperança II',
      hope3: 'Esperança III',
      hope4: 'Esperança IV',
      courage1: 'Coratge I',
      courage2: 'Coratge II',
      courage3: 'Coratge III',
      courage4: 'Coratge IV',
      connection1: 'Connexió I',
      connection2: 'Connexió II',
      connection3: 'Connexió III',
      connection4: 'Connexió IV',
      healing1: 'Sanació I',
      healing2: 'Sanació II',
      healing3: 'Sanació III',
      healing4: 'Sanació IV',
      own3Helpers: 'Obtenir 3 ajudants diferents alhora'
    },
    minigames: {
      hope: 'Esperança',
      courage: 'Coratge',
      connection: 'Connexió',
      healing: 'Sanació',
      completed: '¡Completat!',
      followLight: 'Has seguit la llum de l\'esperança',
      shownCourage: 'Has mostrat coratge',
      formedWord: 'Has format:',
      foundRhythm: 'Has trobat el teu ritme de sanació'
    },
    contact: {
      title: 'Contacta\'ns',
      subtitle: 'Posa\'t en contacte amb nosaltres o estigues connectat a través del nostre butlletí',
      email: 'Email',
      newsletter: 'Butlletí',
      subscribe: 'Subscriure\'s',
      subscribed: '¡Subscrit!',
      subscribing: 'Subscrivint...',
      enterEmail: 'Introdueix el teu email',
      thankYou: '¡Gràcies per subscriure\'t!',
      locked: 'El butlletí està bloquejat',
      lockedDesc: 'Desbloqueja el Butlletí al Tresor del Kraken per subscriure\'t.'
    },
    team: {
      title: 'El Nostre Equip',
      subtitle: 'Coneix les persones darrere de la Guarida del Kraken',
      members: [
        {
          name: 'Carlos Martínez',
          role: 'Dissenyador de Jocs',
          description: 'La cara de l\'equip, està present allà on faci falta ser sociable i amable. També és el responsable de fer que el joc no sigui un simulador de caminar.'
        },
        {
          name: 'David Tàrrega',
          role: 'Dissenyador de Nivells',
          description: 'Va començar com a estudiant i algun dia es convertirà en mestre. Podria sortir a la serie de Volleyball anime,'
        },
        {
          name: 'Meritxell',
          role: 'Dissenyadora Narrativa',
          description: 'Encarregada de les històries i dels textos amb les que - idealment - tothom riurà, plorarà i se sentirà emocionat. Li agrada el color turquesa i els gats.'
        },
        {
          name: 'José Manuel Correa',
          role: 'Animador',
          description: 'Encarregat de donar vida als personatges. També ajuda a modelar i en allò que sigui necessari.'
        },
        {
          name: 'Ergoni',
          role: 'Artista 3D',
          description: 'El culpable de tenir uns models 3d tan bonics.'
        },
        {
          name: 'Enric',
          role: 'Alguns',
          description: 'Gestió de l\'equip, del codi, de la producció, de la programació... El que calgui. M\'obliguen a escriure que ningú m\'ha dit que no m\'estan obligant a fer hores extra per comprar-li més joguines i menjar al meu gos i als meus dos gats.'
        }
      ],
      finalText: 'Units per la passió de crear experiències que sanen i transformen, treballem junts per donar vida a històries que ressonen al cor.'
    },
    heartWeaver: {
      coverAlt: 'Portada de Heart Weaver',
      titleAlt: 'Títol de Heart Weaver',
      introText: 'Quan el jo es trenca en mil trossos, quan ja no pots ser tu mateix, embarca\'t en una aventura, sent de nou...',
      mainTitle: 'Deixa que HeartWeaver repari el teu cor',
      storyBegins: 'Una Història Comença...',
      storyDescription1: 'HeartWeaver és una aventura d\'acció emocional i narrativa amb un sistema d\'habilitats dinàmic.',
      storyDescription2: 'La pèrdua i la culpa han fet que Ace desitgi mai més tornar a sentir res...',
      aceAlt: 'Ace de HeartWeaver',
      friendsAndFoes: 'Amics i Enemics',
      friendsDescription1: 'Embarca\'t en un viatge captivador a través d\'aquest regne retorçat atrapat pel desequilibri de les emocions d\'Ace.',
      friendsDescription2: 'Ajuda a Ace a abraçar les seves emocions de nou i uneix-te a Mark i els seus éssers estimats.',
      markAlt: 'Mark de HeartWeaver',
      decideFate: 'Decideix el Destí d\'Ace',
      fateDescription1: 'Tens el poder de restaurar les emocions d\'Ace a la seva harmonia legítima o deixar-les desaparèixer per sempre...',
      fateDescription2: '... El futur d\'Ace descansa a les teves mans.',
      bookAlt: 'Llibre de HeartWeaver',
      mendHeartTitle: 'Deixa que la Heart Weaver sani el teu cor',
      mendHeartAlt: 'La Heart Weaver teixint llum al voltant d\'un cor',
      cleanseThoughtsTitle: 'Utilitza les emocions de l\'Ace per netejar els seus pensaments intrusius',
      cleanseThoughtsAlt: 'Ace canalitzant emocions per purificar els pensaments',
      charismaticCompanionTitle: 'Companya carismàtica i única',
      charismaticCompanionAlt: 'Companya carismàtica somrient amb confiança',
      immersiveWorldTitle: 'Endinsa\'t en un món de fantasia immersiu',
      immersiveWorldAlt: 'Mapa fantàstic del món de Heart Weaver',
      powerEmotionsTitle: 'Utilitza el poder de les emocions',
      powerEmotionsGifAlts: [
        'Vista prèvia de l\'habilitat d\'esperança',
        'Vista prèvia de l\'habilitat de coratge',
        'Vista prèvia de l\'habilitat de connexió'
      ],
      powerEmotionsCenterAlt: 'Emblema transparent de Heart Weaver'
    },
    minigamesExtra: {
      holdMouse: 'Manté pressionat el botó del ratolí per començar',
      holdAndMove: 'Manté pressionat i mou-te als punts',
      enterEmail: 'Introdueix adreça de correu'
    },
    gameData: {
      agents: {
        'baby-kraken': { name: 'Bebè Kraken – Petit Explorador', description: 'Recull 1 Krakenling per segon.' },
        'young-kraken': { name: 'Kraken Jove – Guardià Constant', description: 'Recull 5 Krakenlings per segon.' },
        'adult-kraken': { name: 'Kraken Adult – Guardià de la Marea Profunda', description: 'Recull 20 Krakenlings per segon.' },
        'elder-kraken': { name: 'Kraken Ancià – Corrent Antic', description: 'Recull 50 Krakenlings per segon.' },
        'guardian-kraken': { name: 'Kraken Guardià', description: 'Recull 100 Krakenlings per segon.' },
        'tide-master': { name: 'Mestre de la Marea', description: 'Flueix amb la marea.' },
        'den-keeper': { name: 'Guardià de la Guarida', description: 'Manté la guarida segura.' },
        'the-player': { name: 'Tu', description: 'Tu ets el tresor.' }
      },
      unlockables: {
        'home': { name: 'Pàgina d\'Inici', description: 'Desbloqueja la pàgina principal.' },
        'games': { name: 'Pàgina de Jocs', description: 'Desbloqueja la pàgina de jocs.' },
        'team': { name: 'Sobre Nosaltres', description: 'Desbloqueja la pàgina de l\'equip.' },
        'contact': { name: 'Contacte', description: 'Desbloqueja la pàgina de contacte.' },
        'newsletter': { name: 'Butlletí', description: 'Desbloqueja el butlletí.' },
        'courage-minigame': { name: 'Teràpia: Coratge', description: 'Desbloqueja Coratge.' },
        'connection-minigame': { name: 'Teràpia: Connexió', description: 'Desbloqueja Connexió.' },
        'healing-minigame': { name: 'Teràpia: Sanació', description: 'Desbloqueja Sanació.' },
        'true-heart': { name: 'Cor Veritable de la Guarida', description: 'Tresor final.' },
        'passive-collection-1': { name: 'Corrents Suaus', description: '+10% de taxa passiva.' },
        'passive-collection-2': { name: 'Marees Flueixents', description: '+25% de taxa passiva.' },
        'passive-collection-3': { name: 'Resonància Profunda', description: '+50% de taxa passiva.' },
        'baby-multiplier-1': { name: 'Impuls Bebè Kraken I', description: '2x Bebè Kraken.' },
        'young-multiplier-1': { name: 'Impuls Kraken Jove I', description: '2x Kraken Jove.' },
        'adult-multiplier-1': { name: 'Impuls Kraken Adult I', description: '2x Kraken Adult.' },
        'elder-multiplier-1': { name: 'Impuls Kraken Ancià I', description: '2x Kraken Ancià.' },
        'guardian-multiplier-1': { name: 'Impuls Kraken Guardià I', description: '2x Kraken Guardià.' },
        'tide-multiplier-1': { name: 'Impuls Mestre de la Marea I', description: '2x Mestre de la Marea.' },
        'den-multiplier-1': { name: 'Impuls Guardià de la Guarida I', description: '2x Guardià de la Guarida.' },
        'player-multiplier-1': { name: 'El Teu Impuls I', description: '2x la teva taxa.' },
        'hope-cooldown-1': { name: 'Esperança Refredament I', description: '-25% de refredament d\'Esperança.' },
        'courage-cooldown-1': { name: 'Coratge Refredament I', description: '-25% de refredament de Coratge.' },
        'connection-cooldown-1': { name: 'Connexió Refredament I', description: '-25% de refredament de Connexió.' },
        'healing-cooldown-1': { name: 'Sanació Refredament I', description: '-25% de refredament de Sanació.' },
        'hope-reward-1': { name: 'Impuls Esperança I', description: '2x recompenses d\'Esperança.' },
        'hope-reward-2': { name: 'Impuls Esperança II', description: '3x recompenses d\'Esperança.' },
        'courage-reward-1': { name: 'Impuls Coratge I', description: '2x recompenses de Coratge.' },
        'courage-reward-2': { name: 'Impuls Coratge II', description: '3x recompenses de Coratge.' },
        'connection-reward-1': { name: 'Impuls Connexió I', description: '2x recompenses de Connexió.' },
        'connection-reward-2': { name: 'Impuls Connexió II', description: '3x recompenses de Connexió.' },
        'healing-reward-1': { name: 'Impuls Sanació I', description: '2x recompenses de Sanació.' },
        'healing-reward-2': { name: 'Impuls Sanació II', description: '3x recompenses de Sanació.' },
        'all-therapies-reward-1': { name: 'Impuls Teràpies I', description: '+50% totes les recompenses.' },
        'all-therapies-reward-2': { name: 'Impuls Teràpies II', description: '2x totes les recompenses.' },
        'sound-button-click': { name: 'Efectes de So: Clics i Recol·leccions', description: 'Desbloqueja sons de clic.' },
        'sound-minigame-hope': { name: 'Efectes de So: Teràpia Esperança', description: 'Desbloqueja sons d\'Esperança.' },
        'sound-minigame-courage': { name: 'Efectes de So: Teràpia Coratge', description: 'Desbloqueja sons de Coratge.' },
        'sound-minigame-connection': { name: 'Efectes de So: Teràpia Connexió', description: 'Desbloqueja sons de Connexió.' },
        'sound-minigame-healing': { name: 'Efectes de So: Teràpia Sanació', description: 'Desbloqueja sons de Sanació.' },
        'sound-music': { name: 'Música de Fons', description: 'Desbloqueja música de fons.' },
        'collect-multiplier-10': { name: 'Onada de Recol·lecció I', description: 'Recol·lecció manual dóna 10 Krakenlings.' },
        'collect-multiplier-100': { name: 'Onada de Recol·lecció II', description: 'Recol·lecció manual dóna 100 Krakenlings.' },
        'collect-multiplier-500': { name: 'Onada de Recol·lecció III', description: 'Recol·lecció manual dóna 1000 Krakenlings.' },
        'collect-percent-1': { name: 'Tsunami de Recol·lecció I', description: 'Recol·lecció manual dóna 5 cops el teu KPS total.' },
        'collect-percent-2': { name: 'Tsunami de Recol·lecció I', description: 'Recol·lecció manual dóna 10 cops el teu KPS total.' },
        'collect-all': { name: 'Recollir Tot', description: 'En recollir un Krakenling, recull tots els Krakenlings de la pàgina.' }
      },
      minigames: {
        'hope': { name: 'Esperança – Segueix la Llum', description: 'Segueix la llum. Enfoca\'t en un pas a la vegada.' },
        'courage': { name: 'Coratge – Mantén la Pressió', description: 'Mantén el botó. Qüeda\'t amb la incomoditat una mica més.' },
        'connection': { name: 'Connexió – Connecta els Punts', description: 'Connecta les lletres. Construeix la paraula.' },
        'healing': { name: 'Sanació – Ritme de Respiració', description: 'Toca amb el ritme. Nota la teva respiració.' }
      },
      missions: {
        'visit-home': { name: 'Benvinguda a la Guarida', description: 'Visita la pàgina d\'inici.' },
        'visit-games': { name: 'Descobreix el joc', description: 'Coneix els nostres jocs.' },
        'visit-team': { name: 'Coneix l\'equip', description: 'Coneix les persones darrere de l\'estudi.' },
        'visit-contact': { name: 'Contacta\'ns', description: 'Visita la pàgina de contacte.' },
        'hope-1': { name: 'Esperança I', description: 'Completa la teràpia d\'Esperança per primera vegada.' },
        'hope-2': { name: 'Esperança II', description: 'Completa la teràpia d\'Esperança 2 vegades.' },
        'hope-3': { name: 'Esperança III', description: 'Completa la teràpia d\'Esperança 5 vegades.' },
        'hope-4': { name: 'Esperança IV', description: 'Completa la teràpia d\'Esperança 10 vegades.' },
        'courage-1': { name: 'Coratge I', description: 'Completa la teràpia de Coratge per primera vegada.' },
        'courage-2': { name: 'Coratge II', description: 'Completa la teràpia de Coratge 2 vegades.' },
        'courage-3': { name: 'Coratge III', description: 'Completa la teràpia de Coratge 5 vegades.' },
        'courage-4': { name: 'Coratge IV', description: 'Completa la teràpia de Coratge 10 vegades.' },
        'connection-1': { name: 'Connexió I', description: 'Completa la teràpia de Connexió per primera vegada.' },
        'connection-2': { name: 'Connexió II', description: 'Completa la teràpia de Connexió 2 vegades.' },
        'connection-3': { name: 'Connexió III', description: 'Completa la teràpia de Connexió 5 vegades.' },
        'connection-4': { name: 'Connexió IV', description: 'Completa la teràpia de Connexió 10 vegades.' },
        'healing-1': { name: 'Sanació I', description: 'Completa la teràpia de Sanació per primera vegada.' },
        'healing-2': { name: 'Sanació II', description: 'Completa la teràpia de Sanació 2 vegades.' },
        'healing-3': { name: 'Sanació III', description: 'Completa la teràpia de Sanació 5 vegades.' },
        'healing-4': { name: 'Sanació IV', description: 'Completa la teràpia de Sanació 10 vegades.' },
        'buy-first-helper': { name: 'Demana ajuda', description: 'Obtén el teu primer ajudant' },
        'own-3-helpers': { name: 'Equip Inicial', description: 'Consegueix 3 ajudants diferents treballant al mateix temps.' },
        'own-5-helpers': { name: 'Equip en Creixement', description: 'Consegueix 5 ajudants diferents treballant al mateix temps.' },
        'own-10-helpers': { name: 'Equip Complet', description: 'Consegueix 10 ajudants diferents treballant al mateix temps.' },
        'collect-10': { name: 'Recol·lector I', description: 'Salva personalment a 10 Krakenlings.' },
        'collect-50': { name: 'Recol·lector II', description: 'Salva personalment a 50 Krakenlings.' },
        'collect-100': { name: 'Recol·lector III', description: 'Salva personalment a 100 Krakenlings.' },
        'collect-500': { name: 'Recol·lector IV', description: 'Salva personalment a 500 Krakenlings.' },
        'collect-1000': { name: 'Recol·lector V', description: 'Salva personalment a 1000 Krakenlings.' },
        'reach-5000': { name: 'Abundància I', description: 'Arriba a 5000 Krakenlings en total.' },
        'reach-20000': { name: 'Abundància II', description: 'Arriba a 20000 Krakenlings en total.' },
        'reach-50000': { name: 'Abundància III', description: 'Arriba a 50000 Krakenlings en total.' },
        'reach-100000': { name: 'Abundància IV', description: 'Arriba a 100000 Krakenlings en total.' },
        'reach-500000': { name: 'Abundància V', description: 'Arriba a 500000 Krakenlings en total.' },
        'reach-1000000': { name: 'Abundància VI', description: 'Arriba a 1000000 Krakenlings en total.' },
        'reach-2000000': { name: 'Abundància VII', description: 'Arriba a 2000000 Krakenlings en total.' },
        'reach-50-kps': { name: 'Mestre I', description: 'Arriba a 50 Krakenlings per segon.' },
        'reach-100-kps': { name: 'Mestre II', description: 'Arriba a 100 Krakenlings per segon.' },
        'reach-200-kps': { name: 'Mestre III', description: 'Arriba a 200 Krakenlings per segon.' },
        'reach-400-kps': { name: 'Mestre IV', description: 'Arriba a 400 Krakenlings per segon.' },
        'reach-800-kps': { name: 'Mestre V', description: 'Arriba a 800 Krakenlings per segon.' },
        'reach-1600-kps': { name: 'Mestre VI', description: 'Arriba a 1600 Krakenlings per segon.' },
        'reach-3000-kps': { name: 'Mestre VII', description: 'Arriba a 3000 Krakenlings per segon.' }
      },
      connectionWords: [
        'ESPERANÇA', 'AMOR', 'CALMA', 'AMABLE', 'CÀLID', 'SEGUR', 'SANAR', 'ALEGRIA', 'PAU', 'CONFIANÇA',
        'AMIC', 'OBRIR', 'CUIDAR', 'SUAU', 'GENTIL', 'VALENT', 'FORT', 'VERDADER', 'REAL', 'LLIURE',
        'LLUM', 'PROFUND', 'SILENCI', 'QUIET', 'FACILITAT', 'DESCANS', 'BRILLANTOR', 'FLUIR', 'CRÈIXER', 'RAIG'
      ]
    }
  }
};

