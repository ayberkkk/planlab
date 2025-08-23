import { NextIntlClientProvider } from 'next-intl';

const locales = ['tr', 'en'] as const;
const defaultLocale = 'tr';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Locale kontrolü - undefined ise varsayılan locale kullan
  const currentLocale = locale || defaultLocale;
  
  if (!locales.includes(currentLocale as any)) {
    throw new Error(`Locale '${currentLocale}' is not supported`);
  }

  // Doğrudan mesaj dosyasını import et
  const messages = (await import(`../../messages/${currentLocale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
