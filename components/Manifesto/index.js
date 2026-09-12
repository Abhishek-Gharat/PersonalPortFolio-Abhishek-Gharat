import React from 'react';
import Reveal from '../ui/Reveal';

// Intro bio — mirrors reference .projects block:
// left-aligned, cream paper, two paragraphs, scroll reveal.
// Copy composed only from portfolio.json fields — no reference text copied.

const Manifesto = ({ data }) => {
  const line1 =
    'Two years across frontend and workflow automation, building what\u2019s next \u2013 from the Collection System production build to the ReactViz codebase explorer, shipped with Next.js and React Flow.';

  const line2 =
    'I believe every great interface forms the basis for an even greater workflow and I\u2019m here to keep building mine.';

  return (
    <section aria-label="Introduction" className="bg-[#FFFBF2] px-5 py-20 sm:px-8 lg:px-8 dark:bg-dark-bg">
      <div className="mx-auto w-full max-w-6xl text-left">
        <Reveal>
          <p className="max-w-4xl text-balance text-[clamp(1.4rem,3vw,2.15rem)] font-normal leading-[1.35] tracking-[-0.01em] text-zinc-900 dark:text-zinc-100">
            {line1}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {line2}
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Manifesto;
