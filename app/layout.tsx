import Header from '@/components/Header';
import type { Metadata } from 'next';
import { Lora, Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--roboto'
});

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--lora'
});

export const metadata: Metadata = {
  title: "Kraken's Den",
  description: ''
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${lora.variable} font-roboto bg-black flex flex-col items-center`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
