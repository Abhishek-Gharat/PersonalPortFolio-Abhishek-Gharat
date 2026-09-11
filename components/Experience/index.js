"use client";

/**
 * Experience section — airy bento-inspired layout.
 * Same portfolio data, decluttered presentation:
 * single-column work history + 2-col education, no typing terminal,
 * no duplicate timeline, no 3D tilt.
 */

import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const ExperienceCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);
  const achievements = item.achievements || [];
  const visibleAchievements = expanded ? achievements : achievements.slice(0, 3);
  const hasMore = achievements.length > 3;

  return (
    <motion.article
      variants={fadeInUp}
      className={cn(
        "group relative rounded-2xl border border-zinc-200 bg-white p-7 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900",
        "transition-shadow duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)] hover:border-zinc-300 dark:hover:border-zinc-700"
      )}
    >
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        {/* Left rail — role meta */}
        <div className="md:w-64 md:shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-8 bg-emerald-500" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full dark:text-emerald-300 dark:bg-emerald-500/10">
              {item.type || "Full-time"}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {item.position}
          </h3>
          <p className="mt-1 text-base font-medium text-zinc-800 dark:text-zinc-200">
            {item.company}
          </p>

          <div className="mt-3 space-y-1.5">
            <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{item.duration}</p>
            <p className="flex items-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5" />
              {item.location}
            </p>
          </div>
        </div>

        {/* Right — details */}
        <div className="min-w-0 flex-1 md:border-l md:border-zinc-100 md:pl-10 md:dark:border-zinc-800">
          <p className="text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">
            {item.description}
          </p>

          {visibleAchievements.length > 0 && (
            <ul className="mt-5 space-y-2.5">
              {visibleAchievements.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm leading-6 text-zinc-700 dark:text-zinc-300"
                >
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              type="button"
            >
              {expanded ? "Show less" : `Show ${achievements.length - 3} more`}
              <ArrowUpRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  expanded && "rotate-180"
                )}
              />
            </button>
          )}

          {item.technologies && (
            <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-100 pt-5 dark:border-zinc-800">
              {item.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const EducationCard = ({ item }) => (
  <motion.article
    variants={fadeInUp}
    className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6 transition-shadow duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-zinc-300 sm:p-7 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
  >
    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
      <GraduationCap className="h-4 w-4" />
      <span className="font-mono text-[11px] uppercase tracking-[0.15em]">
        Education
      </span>
    </div>
    <h3 className="mt-3 text-lg font-bold leading-snug text-zinc-900 dark:text-white">
      {item.degree}
    </h3>
    <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.institution}</p>
    <p className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">{item.duration}</p>
    <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">{item.location}</p>
    <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.description}</p>
    {(item.cgpa || item.percentage) && (
      <p className="mt-4 inline-block rounded-full bg-white border border-zinc-200 px-3 py-1 font-mono text-xs text-zinc-700 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300">
        {item.cgpa ? `CGPA: ${item.cgpa}` : `Score: ${item.percentage}`}
      </p>
    )}
  </motion.article>
);

const Experience = ({ experience = [], education = [] }) => {
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
      id="experience"
      ref={sectionRef}
      className="bg-white py-24 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg"
    >
      <div className="mx-auto max-w-4xl">
        <div
          className={`mb-14 transition-all duration-500 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-700 mb-4 dark:text-emerald-400">
            01 — Experience
          </div>
          <h2 className="font-condensed text-5xl sm:text-6xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Work History
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Production experience across startups and freelance — React,
            Next.js, and API integration.
          </p>
        </div>

        <motion.div
          className="space-y-8"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="visible"
        >
          {experience?.map((item, i) => (
            <ExperienceCard key={item.id} item={item} index={i} />
          ))}
        </motion.div>

        {education?.length > 0 && (
          <div className="mt-16">
            <div className="mb-7 flex items-baseline justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-900 dark:text-white">
                Education
              </h3>
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                {education.length} records
              </span>
            </div>
            <motion.div
              className="grid gap-6 md:grid-cols-2"
              initial="hidden"
              variants={staggerContainer}
              viewport={{ once: true, margin: "-60px" }}
              whileInView="visible"
            >
              {education.map((item) => (
                <EducationCard key={item.id} item={item} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
