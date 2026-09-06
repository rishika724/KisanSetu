import type { Metadata, Viewport } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { VoiceAssistantProvider } from '@/context/VoiceAssistantContext';
import { PwaRegister } from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'किसान सेतु | Kisan Setu - Smart Procurement Gateway',
  description: 'Mobile-First Agricultural Procurement & Dynamic Mandi System',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kisan Setu',
  },
  icons: {
    apple: '/icons/icon-192.png', // Replaces the manual apple-touch-icon link
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 antialiased">
        <LanguageProvider>
          <VoiceAssistantProvider>
            <PwaRegister />
            {children}
          </VoiceAssistantProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}