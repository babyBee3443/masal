
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Home, LayoutGrid } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Logo } from '@/components/site/Logo';
import { cn } from '@/lib/utils';
import { GENRES, APP_NAME } from '@/lib/constants';

const defaultCategory = GENRES[0] || "Macera"; // Default category for the link

const navLinks = [
  { href: '/', label: 'Anasayfa', icon: Home },
  { href: `/categories/${defaultCategory}`, label: 'Kategoriler', icon: LayoutGrid },
  // Add other top-level navigation links here if needed
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinkItem = ({ href, label, icon: Icon, exact = false }: { href: string; label: string; icon: React.ElementType; exact?: boolean}) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Button variant="ghost" asChild className={cn(
        "justify-start text-base font-medium transition-colors hover:text-primary",
        isActive ? "text-primary font-semibold" : "text-foreground/70"
      )}>
        <Link href={href} onClick={() => setIsMobileMenuOpen(false)}>
          <Icon className="mr-2 h-5 w-5" />
          {label}
        </Link>
      </Button>
    );
  };
  
  const CategoryLinkItem = ({ genre }: { genre: string }) => {
    const href = `/categories/${genre}`;
    const isActive = pathname === href;
    return (
       <Button variant="ghost" asChild className={cn(
        "justify-start text-sm font-medium transition-colors hover:text-primary pl-10",
        isActive ? "text-primary font-semibold" : "text-foreground/60"
      )}>
        <Link href={href} onClick={() => setIsMobileMenuOpen(false)}>
          {genre}
        </Link>
      </Button>
    )
  }


  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label={`${APP_NAME} Anasayfa`}>
          <Logo className="h-9 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navLinks.map((link) => (
            <Button variant="ghost" asChild key={link.href} className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
               (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && !link.href.includes('/categories') ) || (link.href.includes('/categories') && pathname.startsWith('/categories')) ) ? "text-primary" : "text-foreground/70"
            )}>
              <Link href={link.href}>
                {link.label}
              </Link>
            </Button>
          ))}
           <Button variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
               pathname.startsWith('/admin') ? "text-primary" : "text-foreground/70"
            )}>
              <Link href="/admin">
                Admin Paneli
              </Link>
            </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menüyü aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-0 shadow-xl flex flex-col">
              <SheetHeader className="p-6 flex flex-row justify-between items-center border-b">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo className="h-8 w-auto" />
                </Link>
                <SheetTitle className="sr-only">Ana Menü</SheetTitle> 
                {/* Title for accessibility, visually hidden if Logo acts as title. Or "Menü" */}
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Menüyü kapat</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col space-y-3 p-6 flex-grow overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <NavLinkItem href={link.href} label={link.label} icon={link.icon} exact={link.href === '/'} />
                    {link.href.includes('/categories') && (
                      <div className="flex flex-col mt-1 space-y-1">
                        {GENRES.map(genre => <CategoryLinkItem key={genre} genre={genre} />)}
                      </div>
                    )}
                  </div>
                ))}
                 <NavLinkItem href="/admin" label="Admin Paneli" icon={BookOpen} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
