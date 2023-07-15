import { useEffect, useState } from 'react';

export const useIsScrolled = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const onScroll = () => {
    setIsScrolled(window.scrollY > window.innerHeight * 0.3);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return isScrolled;
};
