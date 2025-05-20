
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
  const defaultClassName = "mr-3 h-5 w-5"; // Adjusted margin
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-3 py-2",
                  pathname.startsWith('/categories') ? "text-primary" : "text-foreground/70"
                )}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Kategoriler
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[760px] p-6 bg-gradient-to-br from-[hsl(var(--primary)/0.85)] via-[hsl(var(--accent)/0.8)] to-[hsl(var(--card)/0.85)] backdrop-blur-lg border border-[hsl(var(--border)/0.2)] shadow-2xl rounded-xl text-primary-foreground"
              sideOffset={15}
            >
              <div className="grid grid-cols-3 gap-x-8">
                {/* Column 1: DüşBox Kategorileri */}
                <div className="space-y-1">
                  <DropdownMenuLabel className="text-base font-semibold text-primary-foreground/90 px-1 mb-2 border-b border-primary-foreground/20 pb-2">DüşBox Kategorileri</DropdownMenuLabel>
                  {GENRES.map((genre) => (
                    <DropdownMenuItem key={genre} asChild className="p-0 group focus:bg-primary-foreground/10">
                      <Link href={`/categories/${genre}`} className="flex items-center w-full px-2 py-2.5 text-sm rounded-md text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors duration-200">
                        <GenreIcon genre={genre} className="text-primary-foreground/70 group-hover:text-primary-foreground/90 transition-colors duration-200" />
                        <span className="font-medium">{genre}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* Column 2: Öne Çıkan Masal */}
                <div className="space-y-3">
                  <DropdownMenuLabel className="text-base font-semibold text-primary-foreground/90 px-1 mb-2 border-b border-primary-foreground/20 pb-2">Öne Çıkan Masal</DropdownMenuLabel>
                  <div className="px-1">
                    <Link href="/story/placeholder-featured" className="group block rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <Image
                        src="https://placehold.co/600x400.png"
                        alt="Öne Çıkan Masal"
                        width={220}
                        height={130}
                        className="w-full h-36 object-cover rounded-md mb-3 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="fantasy landscape"
                      />
                      <h4 className="text-sm font-semibold text-primary-foreground group-hover:text-accent transition-colors px-1">Efsanevi Ejderhanın Sırrı</h4>
                      <p className="text-xs text-primary-foreground/70 mt-1 line-clamp-2 px-1">Kadim dağların ardında, efsanevi bir ejderhanın koruduğu bir sır...</p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Popüler Masallar */}
                <div className="space-y-1">
                  <DropdownMenuLabel className="text-base font-semibold text-primary-foreground/90 px-1 mb-2 border-b border-primary-foreground/20 pb-2">Popüler Masallar</DropdownMenuLabel>
                  {[
                    { title: "Yıldız Tozu ve Hayaller", href: "/story/placeholder-popular-1" },
                    { title: "Unutulmuş Krallık", href: "/story/placeholder-popular-2" },
                    { title: "Denizin Altındaki Melodi", href: "/story/placeholder-popular-3" },
                    { title: "Saklı Bahçenin Şarkısı", href: "/story/placeholder-popular-4" },
                  ].map((item) => (
                    <DropdownMenuItem key={item.title} asChild className="p-0 group focus:bg-primary-foreground/10">
                     <Link href={item.href} className="flex items-center w-full px-2 py-2.5 text-sm rounded-md text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors duration-200">
                        <TrendingUp className="h-5 w-5 mr-3 text-primary-foreground/70 group-hover:text-primary-foreground/90 transition-colors duration-200"/>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                   <DropdownMenuItem disabled className="px-2 py-2 text-xs text-primary-foreground/50">Daha fazlası yakında...</DropdownMenuItem>
                </div>
              </div>
              <DropdownMenuSeparator className="my-4 bg-primary-foreground/20" />
              <div className="text-center">
                <Button variant="ghost" asChild size="sm" className="w-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors duration-200 py-2">
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
                <SheetTitle className="sr-only">Ana Menü</SheetTitle>
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
