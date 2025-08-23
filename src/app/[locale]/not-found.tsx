"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'tr';

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1E1E1E] rounded-2xl p-8 text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300">{t('errors.notFound')}</h2>
          <p className="text-gray-400">
            {t('errors.notFoundDescription')}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link 
            href={`/${currentLocale}`}
            className="btn-standard"
          >
            <span></span>
            <span className="btn-content">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('navigation.home')}
            </span>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="btn-standard"
          >
            <span></span>
            <span className="btn-content">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              {t('common.back')}
            </span>
          </button>
        </div>

        <div className="pt-4 text-sm text-gray-500">
          {t('errors.contactOwner')}
        </div>
      </div>
    </div>
  );
}
