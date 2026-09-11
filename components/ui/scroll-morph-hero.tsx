"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

// --- Utility ---
// function cn(...inputs: ClassValue[]) {
//     return twMerge(clsx(inputs));
// }

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardTarget {
    tx: number;
    ty: number;
    rotation: number;
    scale: number;
    opacity: number;
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

const FlipCard = React.memo(function FlipCard({
    src,
    index,
    tx,
    ty,
    rotation,
    scale,
    opacity,
}: {
    src: string;
    index: number;
} & FlipCardTarget) {
    return (
        <motion.div
            // Tight follower spring: the parent already smooths the input,
            // so this stage tracks with minimal extra lag (no stacked mush).
            animate={{
                x: tx,
                y: ty,
                rotate: rotation,
                scale: scale,
                opacity: opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 170,
                damping: 24,
            }}

            // Anchored so x:0/y:0 is the exact container center —
            // no reliance on flex static-positioning for alignment.
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                marginLeft: -IMG_WIDTH / 2,
                marginTop: -IMG_HEIGHT / 2,
                transformStyle: "preserve-3d", // Essential for the 3D hover effect
                perspective: "1000px",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`hero-${index}`}
                        className="h-full w-full object-cover"
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-900 flex flex-col items-center justify-center p-4 border border-gray-700"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-1">View</p>
                        <p className="text-xs font-medium text-white">Details</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
// Virtual scroll range, matched to visible change: morph runs 0→600,
// drift runs 600→MAX. Past MAX the wheel is released to the page,
// so the hero never feels like a scroll trap.
const MAX_SCROLL = 1200;

// Frontend developer images (code, dashboards, UI design)
const IMAGES = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550439062-609e1531270e?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=200&q=80&auto=format&fit=crop",
];

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        // Initial set
        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Virtual Scroll Logic ---
    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0); // Keep track of scroll value without re-renders

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // Firefox reports lines, not pixels — normalize so one notch
            // behaves the same everywhere.
            const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;

            // Let the page scroll normally once the virtual range is exhausted,
            // otherwise the hero traps all wheel input (portfolio hero fix).
            const atMax = scrollRef.current >= MAX_SCROLL && delta > 0;
            const atMin = scrollRef.current <= 0 && delta < 0;
            if (atMax || atMin) return;

            // Prevent default to stop browser overscroll/bounce
            e.preventDefault();

            const newScroll = Math.min(Math.max(scrollRef.current + delta, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        // Touch support
        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;

            const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
            // Only hijack the gesture while inside the virtual range
            if (newScroll <= 0 || newScroll >= MAX_SCROLL) return;
            e.preventDefault();
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        // Attach listeners to container instead of window for portability
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll]);

    // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
    // Happens between scroll 0 and 600. Single responsive smoothing stage —
    // the cards follow tightly, so input stays connected instead of laggy.
    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 110, damping: 24 });

    // 2. Scroll Drift: Starts after morph (e.g., > 600)
    // Gently shifts the arc as the user keeps scrolling — bounded so
    // cards always stay on screen.
    const driftProgress = useTransform(virtualScroll, [600, MAX_SCROLL], [0, 360]);
    const smoothDrift = useSpring(driftProgress, { stiffness: 110, damping: 24 });

    // --- Mouse Parallax ---
    // Tight enough to feel attached to the cursor, soft enough to stay buttery.
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 90, damping: 22 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;

            // Normalize -1 to 1
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            // Move +/- 100px
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    // --- Single render-loop state ---
    // The three smoothed values are sampled together once per frame and
    // committed in one setState. Previously each MotionValue had its own
    // subscription → up to 3 renders per frame with values sampled at
    // different times, which showed up as cursor jitter/tearing.
    // The equality bail-out means zero re-renders once springs settle.
    const [frame, setFrame] = useState({ morph: 0, drift: 0, parallax: 0 });

    useEffect(() => {
        let raf = 0;
        const tick = () => {
            setFrame((prev) => {
                const morph = smoothMorph.get();
                const drift = smoothDrift.get();
                const parallax = smoothMouseX.get();
                if (prev.morph === morph && prev.drift === drift && prev.parallax === parallax) {
                    return prev;
                }
                return { morph, drift, parallax };
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [smoothMorph, smoothDrift, smoothMouseX]);

    const morphValue = frame.morph;
    const driftValue = frame.drift;
    const parallaxValue = frame.parallax;

    // --- Content Opacity ---
    // Fade in content when arc is formed (morphValue > 0.8)
    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-[#FAFAFA] overflow-hidden">
            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center">

                {/* Intro Text (Fades out) */}
                {/* Wrapper owns the centering translate; the motion children own
                    their animated transform. Mixing a Tailwind translate class
                    with a framer-motion animated transform on the SAME element
                    makes the class lose (inline style wins) and the text jump. */}
                <div className="absolute z-0 top-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center text-center pointer-events-none">
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                        className="text-2xl font-medium tracking-tight text-gray-800 md:text-4xl"
                    >
                        The future is built on AI.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-4 text-xs font-bold tracking-[0.2em] text-gray-500"
                    >
                        SCROLL TO EXPLORE
                    </motion.p>
                </div>

                {/* Arc Active Content (Fades in) */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
                >
                    <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
                        Explore Our Vision
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 max-w-lg leading-relaxed">
                        Discover a world where technology meets creativity. <br className="hidden md:block" />
                        Scroll through our curated collection of innovations designed to shape the future.
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase & Morph Logic

                            // Responsive Calculations
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            // A. Calculate Circle Position
                            const circleRadius = Math.min(minDimension * 0.35, 350);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            // B. Calculate Bottom Arc Position — rainbow (∩), FITTED.
                            // Anchor the peak in the upper third and the ends in
                            // the lower-middle, solve the circle through them,
                            // then clamp the radius so the ends stay on screen.
                            // (The old math used an unbounded radius and a
                            // flipped center — edge cards flew ~2x past the
                            // viewport on morph.)
                            const spreadAngle = isMobile ? 100 : 130;
                            const halfSpread = ((spreadAngle / 2) * Math.PI) / 180;

                            const apexY = -containerSize.height * 0.28;
                            const edgeY = containerSize.height * 0.1;
                            const rByHeight = (edgeY - apexY) / (1 - Math.cos(halfSpread));
                            // Reserve room for the rotated card body at the ends
                            // (worst case: half the scaled diagonal) plus a gutter.
                            const cardHalfDiag =
                                0.5 *
                                Math.hypot(IMG_WIDTH, IMG_HEIGHT) *
                                (isMobile ? 1.4 : 1.8);
                            const rByWidth =
                                (containerSize.width / 2 - 48 - cardHalfDiag) / Math.sin(halfSpread);
                            const arcRadius = Math.max(80, Math.min(rByHeight, rByWidth));
                            const arcCenterY = apexY + arcRadius;

                            const startAngle = -90 - spreadAngle / 2;
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            // Scroll-linked drift: driftValue sweeps 0→360 across
                            // the post-morph range; map it to a small bounded
                            // shift so cards breathe with scroll. Capped so the
                            // extreme card never crosses ±180°, past which the
                            // circle dives steeply off screen.
                            const scrollProgress = Math.min(Math.max(driftValue / 360, 0), 1);
                            const drift = -scrollProgress * spreadAngle * 0.15;

                            const currentArcAngle = startAngle + i * step + drift;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8,
                            };

                            // C. Interpolate (Morph)
                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                tx={target.x}
                                ty={target.y}
                                rotation={target.rotation}
                                scale={target.scale}
                                opacity={target.opacity}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
