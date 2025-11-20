'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showHeader, setShowHeader] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if user has already seen the first visit modal
    const hasSeenFirstVisit = localStorage.getItem('has-seen-first-visit');
    if (hasSeenFirstVisit) {
      // If already seen, show header immediately
      setShowHeader(true);
      // For root page, wait for content to be ready
      const handleContentReady = () => {
        setShowFooter(true);
      };
      window.addEventListener('contentReady', handleContentReady);
      
      // If content is already ready (not on root page), show footer immediately
      setTimeout(() => {
        if (window.location.pathname !== '/') {
          setShowFooter(true);
        }
      }, 100);
      
      return () => {
        window.removeEventListener('contentReady', handleContentReady);
      };
    } else {
      // Wait for the modal to complete
      const handleModalComplete = () => {
        setShowHeader(true);
      };
      
      // Wait for content to be ready before showing footer
      const handleContentReady = () => {
        setShowFooter(true);
      };
      
      // Listen for custom event from FirstVisitModal
      window.addEventListener('firstVisitComplete', handleModalComplete);
      window.addEventListener('contentReady', handleContentReady);
      
      return () => {
        window.removeEventListener('firstVisitComplete', handleModalComplete);
        window.removeEventListener('contentReady', handleContentReady);
      };
    }
  }, []);

  return (
    <>
      {showHeader && (
        <div className="w-full transition-opacity duration-1000 ease-in-out animate-fade-in">
          <Header />
        </div>
      )}
      {children}
      {showFooter && (
        <div className="w-full transition-opacity duration-1000 ease-in-out animate-fade-in">
          <Footer />
        </div>
      )}
    </>
  );
}

