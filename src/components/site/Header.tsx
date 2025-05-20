
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Home, LayoutGrid } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Logo } from '@/components/site/Logo';
import { cn } from '@/lib/utils';
import { GENRES, APP_NAME } from '@/lib/constants';

// Anasayfa için ana navigasyon linki
const mainNavLink = { href: '/', label: 'Anasayfa', icon: Home };
// Admin paneli için link
const adminPanelLink = { href: '/admin', label: 'Admin Paneli', icon: BookOpen };


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
          {/* Anasayfa Linki */}
          <Button variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
               pathname === mainNavLink.href ? "text-primary" : "text-foreground/70"
            )}>
            <Link href={mainNavLink.href}>
              {mainNavLink.label}
            </Link>
          </Button>

          {/* Kategoriler Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith('/categories') ? "text-primary" : "text-foreground/70"
              )}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Kategoriler
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Kategoriler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {GENRES.map((genre) => (
                <DropdownMenuItem key={genre} asChild>
                  <Link href={`/categories/${genre}`}>{genre}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>En Çok Okunanlar</DropdownMenuLabel>
              <DropdownMenuItem disabled>
                Yakında...
              </DropdownMenuItem>
               {/* Örnek olarak eklenebilir:
               <DropdownMenuItem asChild>
                <Link href="/story/placeholder-id-1">Popüler Hikaye 1</Link>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
          
           <Button variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
               pathname.startsWith(adminPanelLink.href) ? "text-primary" : "text-foreground/70"
            )}>
              <Link href={adminPanelLink.href}>
                {adminPanelLink.label}
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
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Menüyü kapat</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col space-y-3 p-6 flex-grow overflow-y-auto">
                {/* Mobil: Anasayfa */}
                <NavLinkItem href={mainNavLink.href} label={mainNavLink.label} icon={mainNavLink.icon} exact={true} />
                
                {/* Mobil: Kategoriler (açılır liste olarak kalır) */}
                <div>
                  <NavLinkItem href={`/categories/${GENRES[0]}`} label="Kategoriler" icon={LayoutGrid} />
                  <div className="flex flex-col mt-1 space-y-1">
                    {GENRES.map(genre => <CategoryLinkItem key={genre} genre={genre} />)}
                  </div>
                </div>
                
                 <NavLinkItem href={adminPanelLink.href} label={adminPanelLink.label} icon={adminPanelLink.icon} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
