'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api/subscribers';
const MAILERLITE_API_KEY = process.env.NEXT_PUBLIC_MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = '172026650194609552';

interface NewsletterFormProps {
  variant?: 'footer' | 'contact';
  className?: string;
}

export default function NewsletterForm({ variant = 'footer', className = '' }: NewsletterFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!MAILERLITE_API_KEY) {
      toast.error(t.footer.subscribeError);
      return;
    }

    const payload: Record<string, any> = {
      email: email.trim()
    };

    payload.groups = [MAILERLITE_GROUP_ID];

    const options = {
      method: 'POST',
      url: MAILERLITE_API_URL,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${MAILERLITE_API_KEY}`
      },
      data: payload
    };

    try {
      await axios.request(options);
      toast.success(t.footer.subscribeSuccess);
      setEmail('');
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.success(t.footer.subscribeSuccess);
        setEmail('');
        return;
      }
      toast.error(error.response?.data?.message || t.footer.subscribeError);
    }
  };

  if (variant === 'contact') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder={t.minigamesExtra.enterEmail}
          className="rounded-xl px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 focus:border-turquoise-400 focus:outline-none transition-colors"
          required
        />
        <button
          type="submit"
          disabled={email === ''}
          className="rounded-xl px-6 py-3 font-lora font-bold text-lg bg-turquoise-400 hover:bg-turquoise-300 text-black cursor-pointer transition-all disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {t.footer.signUp}
        </button>
      </form>
    );
  }

  // Footer variant (default)
  return (
    <div className={`w-3/4 md:w-1/2 ${className}`}>
      <h2 className="text-white text-4xl text-center">
        {t.footer.newsletter}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={handleChange}
          className="rounded-[0.75rem] text-center mt-3 px-4 py-3 bg-gray text-gray-100 w-full"
          placeholder={t.minigamesExtra.enterEmail}
          required
        />
        <button
          type="submit"
          disabled={email === ''}
          className="rounded-[0.75rem] bg-turquoise-400 text-black text-3xl mt-5 px-4 py-3 w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.footer.signUp}
        </button>
      </form>
    </div>
  );
}
