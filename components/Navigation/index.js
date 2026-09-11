import React, { useState, useEffect } from 'react';
import ThemeToggleButton from '../ui/theme-toggle';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Bottom of page -> contact is visible but can never reach the
      // 100px line because max scroll leaves its top at ~230px
      // (contact + footer are shorter than viewport). Force it active.
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80;
      if (nearBottom) {
        setActiveSection('contact');
        return;
      }

      // Determine active section — document order, last section
      // whose top has crossed the nav line wins.
      const sections = ['hero', 'experience', 'projects', 'skills', 'contact'];
      let current = 'hero';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Highlight immediately so the black pill moves even if smooth
      // scroll can't bring the last section fully to the top.
      setActiveSection(id);
      const top = element.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-3xl">
      {/* Dynamic island — liquid glass */}
      <div
        className={`relative rounded-full border transition-all duration-300 dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] ${
          isScrolled
            ? 'border-white/70 bg-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]'
            : 'border-white/50 bg-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.6)]'
        } backdrop-blur-2xl backdrop-saturate-150`}
      >
        <div className="flex items-center justify-between gap-1 sm:gap-2 pl-4 sm:pl-5 pr-2 sm:pr-2.5 py-1.5 min-h-[52px]">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="group flex items-center gap-2 shrink-0"
          >
            <span className="relative flex items-center justify-center w-8 h-8 shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-400/50 animate-breathe-ring" />
              <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-breathe-ring-delayed" />
              <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white font-condensed text-sm font-bold">
                AG
              </span>
            </span>
            <span className="hidden min-[400px]:block font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              Portfolio
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.14em] uppercase transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-700 hover:text-zinc-900 hover:bg-white/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Status */}
          <div className="hidden lg:flex items-center gap-2 pl-2 pr-3 shrink-0">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-400">
              Open to work
            </span>
          </div>

          {/* Right corner: theme toggle + mobile menu */}
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggleButton className="w-9 h-9 p-2" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-zinc-900 hover:bg-white/70 active:scale-95 transition-all dark:text-zinc-100 dark:hover:bg-white/10"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — glass sheet under the island */}
        {mobileMenuOpen && (
          <nav className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 rounded-3xl border border-white/60 bg-white/95 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_16px_48px_rgba(0,0,0,0.16)] p-2 space-y-1 dark:border-white/10 dark:bg-zinc-900/90">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-2xl font-mono text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-900/5 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center gap-2 px-4 py-2.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-400">
                Open to work
              </span>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navigation;
