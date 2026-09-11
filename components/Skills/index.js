import React, { useEffect, useRef, useState } from 'react';

const SkillGroup = ({ title, skills }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 dark:bg-zinc-900 dark:border-zinc-800">
      <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-zinc-500 mb-4 dark:text-zinc-400">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills?.map((skill) => (
          <span
            key={skill.name}
            className="text-sm font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 px-3.5 py-1.5 rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors cursor-default dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-white dark:hover:text-zinc-900 dark:hover:border-white"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const Skills = ({ skills }) => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="bg-white py-20 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg"
    >
      <div className="max-w-5xl mx-auto">
        <div className={`mb-12 transition-all duration-500 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-700 mb-3 dark:text-emerald-400">
            03 — Skills
          </div>
          <h2 className="font-condensed text-5xl sm:text-6xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Tech Stack
          </h2>
          <p className="mt-3 text-zinc-600 max-w-2xl dark:text-zinc-400">
            Tools I use in production every day. No percentages — just what I ship with.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <SkillGroup title="Frontend" skills={skills.frontend} />
          <SkillGroup title="Backend" skills={skills.backend} />
          <SkillGroup title="Tools" skills={skills.tools} />
        </div>
      </div>
    </section>
  );
};

export default Skills;
