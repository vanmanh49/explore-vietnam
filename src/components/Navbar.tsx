import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { NAV_LINKS, SEARCH_INPUT_ID, SECTION_IDS, type NavLink } from '../config/constants';
import { useExplore } from '../context/ExploreContext';
import { scrollToSection } from '../lib/dom';
import { FlagIcon } from './BrandMark';

export function Navbar() {
  const { enterExplore, exitExplore } = useExplore();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useCallback(
    (link: NavLink) => {
      setMenuOpen(false);
      if (link.action === 'home') exitExplore();
      else if (link.action === 'explore') enterExplore();
      else if (link.sectionId) scrollToSection(link.sectionId);
    },
    [enterExplore, exitExplore],
  );

  const openSearch = useCallback(() => {
    setMenuOpen(false);
    scrollToSection(SECTION_IDS.destinations);
    document.getElementById(SEARCH_INPUT_ID)?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Main"
        className="glass pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pr-2 pl-5"
      >
        <button
          type="button"
          onClick={() => navigate(NAV_LINKS[0]!)}
          className="flex items-center gap-2.5 rounded-full py-1 pr-2 text-mist"
          aria-label="Vietnam, back to the start"
        >
          <FlagIcon className="h-5 w-auto" />
          <span className="font-display text-xl tracking-wide">Việt Nam</span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                type="button"
                onClick={() => navigate(link)}
                className="rounded-full px-3.5 py-2 text-sm font-normal text-mist/80 transition-colors duration-200 hover:bg-mist/10 hover:text-mist"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openSearch}
            className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-normal text-mist/85 transition-colors duration-200 hover:bg-mist/10 hover:text-mist"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search places</span>
            <span className="sr-only sm:hidden">Search places</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full text-mist transition-colors duration-200 hover:bg-mist/10 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass pointer-events-auto mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden"
          >
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => navigate(link)}
                    className="w-full rounded-2xl px-4 py-3 text-left font-display text-2xl text-mist transition-colors duration-200 hover:bg-mist/10"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
