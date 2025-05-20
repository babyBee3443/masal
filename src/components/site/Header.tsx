
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Home, LayoutGrid, Sparkles, TrendingUp, FileText, HelpCircle, Telescope, Heart, Brain, Ghost } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger
} from '@/components/ui/sheet';
import { Logo } from '@/components/site/Logo';
import { cn } from '@/lib/utils';
import { GENRES, APP_NAME } from '@/lib/constants';
import type { StoryGenre } from '@/lib/types';


const mainNavLink = { href: '/', label: 'Anasayfa', icon: Home };
const adminPanelLink = { href: '/admin', label: 'Admin Paneli', icon: BookOpen };

const GenreIcon = ({ genre, className }: { genre: StoryGenre; className?: string }) => {
  const defaultClassName = "mr-2 h-5 w-5 text-primary";
  const iconClassName = cn(defaultClassName, className);
  switch (genre) {
    case 'Korku': return <Ghost className={iconClassName} />;
    case 'Macera': return <Telescope className={iconClassName} />;
    case 'Romantik': return <Heart className={iconClassName} />;
    case 'Bilim Kurgu': return <Sparkles className={iconClassName} />;
    case 'Fabl': return <FileText className={iconClassName} />;
    case 'Felsefi': return <Brain className={iconClassName} />;
    default: return <HelpCircle className={iconClassName} />;
  }
};


export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Removed hover-related state: isCategoriesMenuOpen, categoriesMenuTimeoutRef

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Removed hover-related functions: openCategoriesMenu, closeCategoriesMenuWithDelay

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

  const CategoryLinkItem = ({ genre }: { genre: StoryGenre }) => {
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
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Button variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors hover:text-primary px-3 py-2",
               pathname === mainNavLink.href ? "text-primary" : "text-foreground/70"
            )}>
            <Link href={mainNavLink.href}>
              {mainNavLink.label}
            </Link>
          </Button>

          <DropdownMenu> {/* Removed open and onOpenChange props for hover behavior */}
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-3 py-2",
                  pathname.startsWith('/categories') ? "text-primary" : "text-foreground/70"
                )}
                // Removed onMouseEnter, onMouseLeave event handlers
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Kategoriler
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[680px] p-4 bg-card shadow-xl rounded-lg border"
              sideOffset={10}
              // Removed onMouseEnter, onMouseLeave event handlers
            >
              <div className="grid grid-cols-3 gap-x-6">
                {/* Column 1: DüşBox Kategorileri */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="text-base font-semibold text-foreground px-2">DüşBox Kategorileri</DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  {GENRES.map((genre) => (
                    <DropdownMenuItem key={genre} asChild className="p-0 group">
                      <Link href={`/categories/${genre}`} className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                        <GenreIcon genre={genre} className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-accent-foreground" />
                        <span>{genre}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* Column 2: Öne Çıkan Masal */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="text-base font-semibold text-foreground px-2">Öne Çıkan Masal</DropdownMenuLabel>
                   <DropdownMenuSeparator className="my-1" />
                  <div className="px-2">
                    <Link href="/story/placeholder-featured" className="group block rounded-md overflow-hidden">
                      <Image
                        src="https://placehold.co/600x400.png"
                        alt="Öne Çıkan Masal"
                        width={200}
                        height={120}
                        className="w-full h-32 object-cover rounded-md mb-2 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="fantasy landscape"
                      />
                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Efsanevi Ejderhanın Sırrı</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Kadim dağların ardında, efsanevi bir ejderhanın koruduğu bir sır...</p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Popüler Masallar */}
                <div className="space-y-2">
                  <DropdownMenuLabel className="text-base font-semibold text-foreground px-2">Popüler Masallar</DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild className="p-0 group">
                    <Link href="/story/placeholder-popular-1" className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                      <TrendingUp className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-accent-foreground"/>
                      <span>Yıldız Tozu ve Hayaller</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0 group">
                     <Link href="/story/placeholder-popular-2" className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                      <TrendingUp className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-accent-foreground"/>
                      <span>Unutulmuş Krallık</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0 group">
                     <Link href="/story/placeholder-popular-3" className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                      <TrendingUp className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-accent-foreground"/>
                      <span>Denizin Altındaki Melodi</span>
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem disabled className="px-2 py-2 text-xs text-muted-foreground">Daha fazlası yakında...</DropdownMenuItem>
                </div>
              </div>
              <DropdownMenuSeparator className="my-3" />
              <div className="text-center">
                <Button variant="ghost" asChild size="sm" className="w-full hover:bg-primary/10">
                  <Link href={`/categories/${GENRES[0]}`}>
                    Tüm Kategorileri Gör
                  </Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

           <Button variant="ghost" asChild className={cn(
              "text-sm font-medium transition-colors hover:text-primary px-3 py-2",
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
                <SheetTitle className="sr-only">Ana Menü</SheetTitle> {/* Added sr-only for accessibility */}
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Menüyü kapat</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col space-y-1 p-4 flex-grow overflow-y-auto">
                <NavLinkItem href={mainNavLink.href} label={mainNavLink.label} icon={mainNavLink.icon} exact={true} />

                <div> {/* Wrapper for Kategoriler and its sub-items */}
                  <NavLinkItem href={`/categories/${GENRES[0]}`} label="Kategoriler" icon={LayoutGrid} />
                  <div className="flex flex-col mt-1 space-y-0.5">
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
