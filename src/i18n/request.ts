import { getRequestConfig } from 'next-intl/server';

// Desteklenen diller
const locales = ['tr', 'en'] as const;
const defaultLocale = 'tr';

export default getRequestConfig(async ({ locale }) => {
  // Locale kontrolü - undefined ise varsayılan locale kullan
  const currentLocale = locale || defaultLocale;
  
  if (!locales.includes(currentLocale as any)) {
    throw new Error(`Locale '${currentLocale}' is not supported`);
  }

  return {
    locale: currentLocale as string,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});
