import { ABOUT_FACTS, SECTION_IDS } from '../config/constants';
import { VietnamOutline } from './BrandMark';

export function AboutVietnam() {
  return (
    <section
      id={SECTION_IDS.about}
      aria-labelledby="about-title"
      className="pointer-events-auto relative overflow-hidden bg-mist px-5 py-24 text-ink-deep sm:px-10 sm:py-32"
    >
      <VietnamOutline
        filled
        className="pointer-events-none absolute -top-10 -right-16 h-[120%] w-auto text-ink/15 lg:right-[4%]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="about-title" className="display-title">
            A country shaped like the letter S
          </h2>
          <div className="mt-8 max-w-[34rem] space-y-5 text-lg font-normal text-ink/85">
            <p>
              Vietnam runs for 1,650 kilometres down the eastern edge of mainland Southeast Asia.
              At its narrowest, in the centre, it is barely fifty kilometres from the mountains to
              the sea.
            </p>
            <p>
              That long shape gives it three climates and three characters. The north has four
              seasons and the oldest cities. The centre holds the imperial past and the best of
              the coast. The south is tropical, generous and built on water.
            </p>
            <p>
              Travelling from one end to the other, the food changes with every province, and so
              do the accents, the festivals and the landscape outside the window.
            </p>
          </div>
        </div>

        <dl className="self-end">
          {ABOUT_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-1 border-t border-ink/20 py-5 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <dt className="order-2 max-w-xs font-normal text-ink/80">{fact.label}</dt>
              <dd className="order-1 w-64 shrink-0 font-display text-4xl font-light whitespace-nowrap sm:text-5xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
