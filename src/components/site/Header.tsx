
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Home, LayoutGrid, Sparkles, TrendingUp, FileText, HelpCircle, Telescope, Heart, Brain, Ghost, ChevronDown } from 'lucide-react';
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
import { GENRES, APP_NAME, SUBGENRES_MAP } from '@/lib/constants';
import type { StoryGenre } from '@/lib/types';


const mainNavLink = { href: '/', label: 'Anasayfa', icon: Home };
const adminPanelLink = { href: '/admin', label: 'Admin Paneli', icon: BookOpen };

const GenreIcon = ({ genre, className }: { genre: StoryGenre; className?: string }) => {
  const defaultClassName = "mr-3 h-5 w-5 text-accent/80 group-hover:text-primary transition-colors duration-200";
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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const NavLinkItem = ({ href, label, icon: Icon, exact = false, isMobile = false }: { href: string; label: string; icon: React.ElementType; exact?: boolean; isMobile?: boolean}) => {
    const isActive = (exact && pathname === href) || (!exact && href !== '/' && pathname.startsWith(href)) || (href === '/' && pathname === '/');

    const baseClasses = "justify-start text-base font-medium transition-all duration-200 ease-out";
    const desktopClasses = "px-4 py-2.5 text-sm rounded-lg";
    const mobileClasses = "w-full py-3 text-lg";

    return (
      <Button
        variant="ghost"
        asChild
        className={cn(
          baseClasses,
          isMobile ? mobileClasses : desktopClasses,
          isActive
            ? (isMobile ? "text-primary font-semibold" : "bg-accent/20 text-accent font-semibold hover:bg-accent/25")
            : (isMobile ? "text-foreground/70 hover:text-primary" : "text-foreground/80 hover:bg-accent/10 hover:text-accent")
      )}>
        <Link href={href} onClick={() => {if (isMobile) setIsMobileMenuOpen(false)}}>
          <Icon className={cn("mr-2 h-5 w-5", isMobile && "h-6 w-6")} />
          {label}
        </Link>
      </Button>
    );
  };

  const CategoryLinkItem = ({ genre, isMobile = false }: { genre: StoryGenre, isMobile?: boolean }) => {
    const href = `/categories/${genre}`;
    const isActive = pathname === href;
    return (
       <Button
        variant="ghost"
        asChild
        className={cn(
          "justify-start font-medium transition-colors hover:text-primary",
          isActive ? "text-primary font-semibold" : "text-foreground/70",
          isMobile ? "w-full py-2.5 text-md pl-10" : "text-sm pl-8"
       )}>
        <Link href={href} onClick={() => {if (isMobile) setIsMobileMenuOpen(false)}}>
          {isMobile && <GenreIcon genre={genre} className="mr-3 h-5 w-5 text-foreground/60 group-hover:text-primary" />}
          {genre}
        </Link>
      </Button>
    )
  }

  const SubCategoryLinkItem = ({ mainGenre, subGenre, isMobile = false }: { mainGenre: StoryGenre; subGenre: { value: string; label: string }; isMobile?: boolean }) => {
    const href = `/categories/${mainGenre}?subGenre=${subGenre.value}`;
    // Subgenre active state might be more complex if we want to highlight it based on query params
    // For now, we keep it simple and don't highlight subgenres specifically in the dropdown
    // const isActive = pathname === href; // This would require more logic for query params

    return (
      <Button
        variant="ghost"
        asChild
        className={cn(
          "justify-start font-normal transition-colors hover:text-primary/90 text-foreground/60 hover:bg-accent/10",
          isMobile ? "w-full py-2 text-sm pl-14" : "text-xs pl-12 py-1.5 h-auto" // Smaller for subcategories
        )}
      >
        <Link href={href} onClick={() => { if (isMobile) setIsMobileMenuOpen(false); }}>
          <span className="truncate">{subGenre.label}</span>
        </Link>
      </Button>
    );
  }


  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-shadow duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/30" : "bg-transparent border-b border-transparent"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label={`${APP_NAME} Anasayfa`} className="z-10 transform transition-transform duration-300 hover:scale-105">
          <Logo className="h-10 md:h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <NavLinkItem href={mainNavLink.href} label={mainNavLink.label} icon={Home} exact={true} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out rounded-lg flex items-center gap-2",
                  pathname.startsWith('/categories')
                    ? "bg-accent/20 text-accent font-semibold hover:bg-accent/25"
                    : "text-foreground/80 hover:bg-accent/10 hover:text-accent"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Kategoriler
                <ChevronDown className="ml-1 h-4 w-4 opacity-70 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[880px] p-6 bg-card/90 backdrop-blur-xl border-2 border-primary/40 shadow-2xl rounded-2xl mt-3"
              sideOffset={15}
              align="center"
            >
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <DropdownMenuLabel className="text-lg font-bold text-primary px-2 pb-2.5 mb-2 border-b-2 border-primary/25 flex items-center">
                    <Sparkles className="mr-2.5 h-5 w-5 text-accent"/>
                    DüşBox Kategorileri
                  </DropdownMenuLabel>
                  {GENRES.map((genre) => (
                    <React.Fragment key={genre}>
                      <DropdownMenuItem asChild className="p-0 group focus:bg-accent/15 rounded-lg">
                        <Link href={`/categories/${genre}`} className="flex items-center w-full px-3 py-2.5 text-base rounded-lg text-foreground/90 hover:bg-accent/15 hover:text-accent transition-colors duration-200">
                          <GenreIcon genre={genre} />
                          <span className="font-semibold">{genre}</span>
                        </Link>
                      </DropdownMenuItem>
                      {SUBGENRES_MAP[genre] && SUBGENRES_MAP[genre].length > 0 && (
                        <div className="flex flex-col pl-5 space-y-0.5 mb-1.5">
                          {SUBGENRES_MAP[genre].map(subGenre => (
                            <DropdownMenuItem key={subGenre.value} asChild className="p-0 group focus:bg-accent/10 rounded-md">
                               <SubCategoryLinkItem mainGenre={genre} subGenre={subGenre} />
                            </DropdownMenuItem>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="space-y-3">
                  <DropdownMenuLabel className="text-lg font-bold text-primary px-2 pb-2.5 mb-3 border-b-2 border-primary/25 flex items-center">
                     <TrendingUp className="mr-2.5 h-5 w-5 text-accent"/>
                    Öne Çıkan Masal
                  </DropdownMenuLabel>
                  <div className="px-1">
                    <Link href="/story/placeholder-featured" className="group block rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-accent/50 p-3 bg-background/40 hover:bg-background/60">
                      <Image
                        src="https://placehold.co/250x150.png"
                        alt="Öne Çıkan Masal"
                        width={250}
                        height={150}
                        className="w-full h-40 object-cover rounded-md mb-3.5 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="futuristic abstract"
                      />
                      <h4 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors px-1">Efsanevi Ejderhanın Sırrı</h4>
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 px-1">Kadim dağların ardında, efsanevi bir ejderhanın koruduğu bir sır...</p>
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <DropdownMenuLabel className="text-lg font-bold text-primary px-2 pb-2.5 mb-3 border-b-2 border-primary/25 flex items-center">
                     <BookOpen className="mr-2.5 h-5 w-5 text-accent"/>
                     Popüler Masallar
                  </DropdownMenuLabel>
                  {[
                    { title: "Yıldız Tozu ve Hayaller", href: "/story/placeholder-popular-1" },
                    { title: "Unutulmuş Krallık", href: "/story/placeholder-popular-2" },
                    { title: "Denizin Altındaki Melodi", href: "/story/placeholder-popular-3" },
                    { title: "Saklı Bahçenin Şarkısı", href: "/story/placeholder-popular-4" },
                  ].map((item) => (
                    <DropdownMenuItem key={item.title} asChild className="p-0 group focus:bg-accent/15 rounded-lg">
                     <Link href={item.href} className="flex items-center w-full px-3 py-3 text-base rounded-lg text-foreground/90 hover:bg-accent/15 hover:text-accent transition-colors duration-200">
                        <Sparkles className="h-5 w-5 mr-3 text-accent/80 group-hover:text-primary transition-colors duration-200"/>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                   <DropdownMenuItem disabled className="px-3 py-2.5 text-sm text-muted-foreground/60">Daha fazlası yakında...</DropdownMenuItem>
                </div>
              </div>
              <DropdownMenuSeparator className="my-5 bg-primary/25" />
              <div className="text-center">
                <Button variant="outline" asChild size="lg" className="w-full md:w-auto text-primary hover:text-accent hover:border-accent transition-colors duration-200 py-3 border-primary/60 hover:bg-primary/5">
                  <Link href={`/categories/${GENRES[0]}`}>
                    Tüm Kategorileri Gör
                  </Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

           <NavLinkItem href={adminPanelLink.href} label={adminPanelLink.label} icon={BookOpen} />
        </nav>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Menüyü aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background/95 backdrop-blur-lg p-0 shadow-xl flex flex-col border-l border-border/30">
              <SheetHeader className="p-4 flex flex-row justify-between items-center border-b border-border/30">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo className="h-9 w-auto" />
                </Link>
                <SheetTitle className="sr-only">Ana Menü</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Menüyü kapat</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col space-y-1 p-4 flex-grow overflow-y-auto">
                <NavLinkItem href={mainNavLink.href} label={mainNavLink.label} icon={mainNavLink.icon} exact={true} isMobile={true}/>

                <div>
                  <NavLinkItem href={`/categories/${GENRES[0]}`} label="Kategoriler" icon={LayoutGrid} isMobile={true}/>
                  <div className="flex flex-col mt-1 space-y-0.5 pl-4 border-l-2 border-primary/20 ml-3">
                    {GENRES.map(genre => (
                        <React.Fragment key={`${genre}-mobile`}>
                            <CategoryLinkItem genre={genre} isMobile={true}/>
                            {SUBGENRES_MAP[genre] && SUBGENRES_MAP[genre].length > 0 && (
                                <div className="flex flex-col space-y-0.5">
                                {SUBGENRES_MAP[genre].map(subGenre => (
                                     <SubCategoryLinkItem key={`${subGenre.value}-mobile`} mainGenre={genre} subGenre={subGenre} isMobile={true} />
                                ))}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                  </div>
                </div>

                 <NavLinkItem href={adminPanelLink.href} label={adminPanelLink.label} icon={adminPanelLink.icon} isMobile={true}/>
              </nav>
               <div className="p-4 border-t border-border/30 mt-auto">
                <Button variant="outline" className="w-full text-primary hover:border-primary hover:bg-primary/5" asChild>
                    <Link href="/admin">Yönetici Paneli</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

