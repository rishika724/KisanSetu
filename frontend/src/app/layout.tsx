import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { PwaRegister } from '../components/PwaRegister';

export const metadata: Metadata = {
  title: 'किसान सेतु | Kisan Setu - Smart Procurement Gateway',
  description: 'Mobile-First Agricultural Procurement & Dynamic Mandi Slot Scheduling Platform (SIH 26032)',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kisan Setu'
  }
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full bg-slate-50">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-slate-200">
        <LanguageProvider>
          <PwaRegister />
          {/* Hidden Google Translate Bridge Element */}
          <div id="google_translate_element" className="hidden" aria-hidden="true" />
          {children}
        </LanguageProvider>

        {/* Dynamic All-India 22 Scheduled Languages Translation Wrapper */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Auto-restore saved language preference from localStorage before init
              try {
                var saved = localStorage.getItem('kisan_setu_preferred_language') || localStorage.getItem('kisan_setu_lang');
                if (saved && saved !== 'en') {
                  document.cookie = 'googtrans=/en/' + saved + '; path=/;';
                  document.cookie = 'googtrans=/auto/' + saved + '; path=/;';
                }
              } catch(e) {}

              function googleTranslateElementInit() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,bn,mr,te,ta,gu,ur,kn,or,ml,pa,as,mai,sat,ks,ne,kok,doi,mni,brx,sa',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              }
            `
          }}
        />
        <Script
          id="google-translate-core"
          strategy="afterInteractive"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
      </body>
    </html>
  );
}
