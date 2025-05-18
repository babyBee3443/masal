import type { Metadata } from 'next';
// Removed: import { GeistSans } from 'geist/font/sans';
// Removed: import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Assuming Toaster is in ui, adjust if needed
import { APP_NAME } from '@/lib/constants';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';


export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: `Discover enchanting AI-generated stories on ${APP_NAME}. Your daily dose of imagination.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className="antialiased flex flex-col min-h-screen">
        {/* Header and Footer are part of this root layout for public pages.
            Admin pages will use admin/layout.tsx to override or provide a different structure.
        */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
