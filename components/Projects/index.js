import React, { useRef, useEffect, useState } from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all flex flex-col dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700">
      {project.imageSrc && (
        <div className="aspect-video bg-zinc-100 overflow-hidden dark:bg-zinc-800">
          <img
            src={project.imageSrc}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {project.featured && (
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full dark:text-emerald-300 dark:bg-emerald-500/10">
              Featured
            </span>
          )}
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {project.tags?.slice(0, 2).join(' · ')}
          </span>
        </div>

        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{project.title}</h3>
        <p className="mt-2 text-[15px] text-zinc-600 leading-relaxed flex-1 dark:text-zinc-400">
          {project.longDescription || project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-full dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-zinc-900 px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Live Demo →
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 border border-zinc-300 px-4 py-2.5 rounded-xl hover:border-zinc-900 transition-colors dark:text-white dark:border-zinc-700 dark:hover:border-white"
            >
              Code
            </a>
          )}
        </div>
      </div>
    </div>
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
      className="bg-zinc-50 py-20 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900/40"
    >
      <div className="max-w-5xl mx-auto">
        <div className={`mb-12 transition-all duration-500 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-700 mb-3 dark:text-emerald-400">
            02 — Projects
          </div>
          <h2 className="font-condensed text-5xl sm:text-6xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Selected Work
          </h2>
          <p className="mt-3 text-zinc-600 max-w-2xl dark:text-zinc-400">
            Three production-grade builds — what problem, what I shipped, and where to see it live.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
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
