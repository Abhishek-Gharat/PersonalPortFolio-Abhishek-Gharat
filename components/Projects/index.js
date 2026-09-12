import React, { useRef, useEffect, useState } from 'react';
import Reveal from '../ui/Reveal';

const ProjectCard = ({ project, wide = true }) => {
  const href = project.url || project.github || '#projects';

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={`Open the ${project.title} case study`}
      className="group relative block h-[298px] w-full overflow-hidden rounded-[40px] bg-[#EFE7D6] transition-[box-shadow] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.14)] dark:bg-zinc-800"
    >
      {project.imageSrc && (
        <img
          src={project.imageSrc}
          alt={`${project.title} — case study cover`}
          loading="lazy"
          className="absolute left-0 top-[-17%] h-[135%] w-full object-cover transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]"
        />
      )}
      {/* tile-overlay: hidden at rest, fades in on hover/focus — like the reference.
          Always visible on touch (no hover) so content stays reachable. */}
      <span aria-hidden="true" className="absolute inset-0 bg-[#FFFBF2]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
      <span aria-hidden="true" className="absolute inset-x-8 top-1/2 h-40 -translate-y-1/2 rounded-3xl bg-[#FFFBF2]/55 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
      <span className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
        <span className={`block font-normal uppercase leading-[1.08] tracking-[-0.01em] text-black [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden ${wide ? 'text-[34px]' : 'text-[22px]'}`}>
          {project.shortTitle || project.title}
        </span>
        <span className="mt-2 block max-w-[30ch] text-balance text-[17px] font-normal leading-snug text-black [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          {project.description}
        </span>
      </span>
    </a>
  );
};

const Projects = ({ projects }) => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Featured work"
      className="bg-[#FFFBF2] px-5 pb-20 pt-2 sm:px-8 dark:bg-dark-bg"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="sr-only">Featured work</h2>

        <div className={`flex snap-x snap-mandatory gap-[2%] overflow-x-auto pb-4 transition-all duration-500 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {projects?.map((project, i) => {
            // reference rhythm: outer cards wide (349), inner cards narrow (227)
            const wide = i === 0 || i === (projects?.length ?? 1) - 1;
            return (
              <Reveal key={project.id} delay={(i % 3) * 90} className={`w-[85%] shrink-0 snap-center ${wide ? 'sm:w-[349px]' : 'sm:w-[227px]'}`}>
                <ProjectCard project={project} wide={wide} />
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://github.com/Abhishek-Gharat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 border border-zinc-300 bg-white px-6 py-3 rounded-xl hover:border-zinc-900 transition-colors dark:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-white"
          >
            View all on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
