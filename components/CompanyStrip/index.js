import React from 'react';
import Reveal from '../ui/Reveal';

// Teams strip — mirrors reference .featured-work header:
// 40px light sentence-case heading + quiet logo row, left-aligned.
// Names come only from experience data — no logos invented.

const CompanyStrip = ({ experience = [] }) => {
  const names = [...new Set((experience || []).map((e) => e.company).filter(Boolean))];
  if (!names.length) return null;

  return (
    <section aria-label="Teams I've shipped with" className="bg-[#FFFBF2] px-5 pb-14 pt-20 sm:px-8 dark:bg-dark-bg">
      <div className="mx-auto w-full max-w-6xl text-left">
        <Reveal>
          <h2 className="text-[40px] font-light leading-[1.1] tracking-[-0.04em] text-zinc-950 dark:text-zinc-50">
            Teams I&apos;ve shipped with
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <ul aria-label="Companies this work has shipped with" className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-6">
            {names.map((name) => (
              <li
                key={name}
                className="whitespace-nowrap text-[22px] font-semibold tracking-tight text-zinc-900/45 transition-colors hover:text-zinc-900/80 dark:text-white/40 dark:hover:text-white/75"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default CompanyStrip;
