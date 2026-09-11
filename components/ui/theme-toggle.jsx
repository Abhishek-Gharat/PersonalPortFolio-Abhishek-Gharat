"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import React, { useEffect, useId, useState } from "react";

import { cn } from "../../lib/utils";

/**
 * Animated sun/moon theme toggle, placed top-right in the nav island.
 *
 * Animation adapted from Skiper UI's Theme Toggle Animations
 * (https://skiper-ui.com), rebuilt with Framer Motion — themselves
 * inspired by https://toggles.dev/ (Alfie Jones, open source).
 * Free to use with attribution to Skiper UI (see source header).
 */
export function ThemeToggleButton({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const rawId = useId();
  // useId contains ":" which breaks url(#...) references — strip it.
  const clipId = `theme-toggle-clip-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a same-size placeholder pre-mount so server and first
  // client render agree (theme is unknown until hydration).
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "block rounded-full border border-white/60 bg-white/70",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/70 active:scale-95 dark:border dark:border-white/20 dark:hover:bg-white/10",
        isDark ? "bg-zinc-900 text-white" : "bg-white/70 text-zinc-900",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
      >
        <clipPath id={clipId}>
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <motion.circle
            animate={{ r: isDark ? 10 : 8 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            cx="16"
            cy="16"
          />
          <motion.g
            animate={{
              rotate: isDark ? -100 : 0,
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
}

export default ThemeToggleButton;
