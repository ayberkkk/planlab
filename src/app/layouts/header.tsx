"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const Header = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mevcut dili pathname'den al
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'tr';

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'tr' ? 'en' : 'tr';
    // Basit yönlendirme - her zaman ana sayfaya git
    window.location.href = `/${newLocale}`;
  };

  const menuItems = [
    { href: `/${currentLocale}`, label: t('navigation.home') },
    { href: `/${currentLocale}/room`, label: t('meeting.rooms') },
    { href: `/${currentLocale}/about`, label: t('navigation.about') },
    { href: `/${currentLocale}/contact`, label: t('navigation.contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${currentLocale}`} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-white font-bold text-xl">PlanLab</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="btn-standard"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              <span></span>
              <span className="btn-content">
                {currentLocale.toUpperCase()}
              </span>
            </button>

            {/* Login Button */}
            <button className="btn-standard" style={{ padding: '8px 24px', fontSize: '14px' }}>
              <span></span>
              <span className="btn-content">
                {t('auth.login')}
              </span>
            </button>

            {/* Register Button */}
            <button className="btn-standard" style={{ 
              padding: '8px 24px', 
              fontSize: '14px',
              background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))',
              border: 'none'
            }}>
              <span></span>
              <span className="btn-content">
                {t('auth.register')}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/50 backdrop-blur-md rounded-lg mt-2 border border-white/10">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;