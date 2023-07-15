import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative w-full h-full">
      <div className="relative w-full h-3/5">
        <Image src="/heartweaver.png" className="object-cover lg:object-[32vw] brightness-75" fill alt="Heart Weaver" />

        <Image
          src="/heartweaver.svg"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          width={96}
          height={96}
          alt="Kraken's Den Logo"
        />
      </div>
    </main>
  );
}
