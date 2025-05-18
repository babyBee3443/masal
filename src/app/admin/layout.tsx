import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { Logo } from '@/components/site/Logo';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: `Admin Panel | ${APP_NAME}`,
  robots: 'noindex, nofollow', // Prevent indexing of admin panel
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <header className="bg-card shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="text-xl font-semibold text-foreground">Admin Panel</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">View Site</Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        &copy; {new Date().getFullYear()} {APP_NAME} Admin
      </footer>
    </div>
  );
}
