import type { ReactNode } from 'react';
import {
  FOOTER_POPULAR_SLUGS,
  NAV_LINKS,
  SECTION_IDS,
  SITE,
} from '../config/constants';
import { useExplore } from '../context/ExploreContext';
import { useFilters } from '../context/FilterContext';
import { DESTINATION_BY_ID } from '../data/destinations';
import { REGIONS } from '../data/regions';
import { scrollToSection } from '../lib/dom';
import type { RegionId } from '../types';
import { FlagIcon } from './BrandMark';

const LINK_CLASS =
  'text-left font-normal text-mist/75 transition-colors duration-200 hover:text-saffron';

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title}>
      <h3 className="font-sans text-sm font-medium tracking-normal text-mist">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </nav>
  );
}

export function Footer() {
  const { enterExplore, exitExplore, openDestination } = useExplore();
  const { setRegion, setCategory, setQuery } = useFilters();

  const showRegion = (region: RegionId) => {
    setQuery('');
    setCategory('all');
    setRegion(region);
    scrollToSection(SECTION_IDS.destinations);
  };

  return (
    <footer className="relative z-10 bg-ink-deep px-5 pt-20 pb-10 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <FlagIcon className="h-8 w-auto" />
            <p className="mt-6 max-w-md font-display text-3xl leading-tight font-light sm:text-4xl">
              {SITE.footerTagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterColumn title="Quick links">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    className={LINK_CLASS}
                    onClick={() => {
                      if (link.action === 'home') exitExplore();
                      else if (link.action === 'explore') enterExplore();
                      else if (link.sectionId) scrollToSection(link.sectionId);
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Regions">
              {REGIONS.map((region) => (
                <li key={region.id}>
                  <button type="button" className={LINK_CLASS} onClick={() => showRegion(region.id)}>
                    {region.name}
                  </button>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Popular destinations">
              {FOOTER_POPULAR_SLUGS.map((slug) => {
                const destination = DESTINATION_BY_ID.get(slug);
                if (!destination) return null;
                return (
                  <li key={slug}>
                    <button
                      type="button"
                      className={LINK_CLASS}
                      onClick={() => openDestination(destination.id)}
                    >
                      {destination.name}
                    </button>
                  </li>
                );
              })}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 border-t border-mist/15 pt-8">
          <p className="max-w-xl text-sm font-normal text-mist/60">
            © {new Date().getFullYear()} Explore Vietnam. An independent showcase, not an official
            tourism service. Photographs from Wikimedia Commons contributors.
          </p>
        </div>
      </div>
    </footer>
  );
}
