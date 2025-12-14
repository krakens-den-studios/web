'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import RootGameComponents from './RootGameComponents';
import { cookieStorage } from '@/utils/cookieStorage';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showHeader, setShowHeader] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const pathname = usePathname();
  const isRootPage = pathname === '/';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if user has already seen the first visit modal
    const hasSeenFirstVisit = cookieStorage.getItem('has-seen-first-visit');
    if (hasSeenFirstVisit) {
      // If already seen, show header immediately
      setShowHeader(true);
      // For root page, never show footer
      // For other pages, show footer immediately
      if (!isRootPage) {
        setTimeout(() => {
          setShowFooter(true);
        }, 100);
      }
    } else {
      // Wait for the modal to complete
      const handleModalComplete = () => {
        setShowHeader(true);
      };
      
      // Wait for content to be ready before showing footer (only for non-root pages)
      const handleContentReady = () => {
        if (!isRootPage) {
          setShowFooter(true);
        }
      };
      
      // Listen for custom event from FirstVisitModal
      window.addEventListener('firstVisitComplete', handleModalComplete);
      window.addEventListener('contentReady', handleContentReady);
      
      return () => {
        window.removeEventListener('firstVisitComplete', handleModalComplete);
        window.removeEventListener('contentReady', handleContentReady);
      };
    }
  }, [isRootPage]);

  // Update footer visibility when pathname changes
  useEffect(() => {
    if (isRootPage) {
      setShowFooter(false);
    } else {
      // Show footer on other pages after a short delay
      setTimeout(() => {
        setShowFooter(true);
      }, 100);
    }
  }, [isRootPage]);

  return (
    <>
      {showHeader && !isRootPage && (
        <div className="w-full transition-opacity duration-1000 ease-in-out animate-fade-in">
          <Header />
        </div>
      )}
      {/* Game components (treasure and krakenlings) for root page */}
      {isRootPage && <RootGameComponents />}
      {children}
      {showFooter && !isRootPage && (
        <div className="w-full transition-opacity duration-1000 ease-in-out animate-fade-in">
          <Footer />
        </div>
      )}
    </>
  );
}

