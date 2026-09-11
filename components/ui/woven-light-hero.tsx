"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

// --- Main Hero Component ---
interface WovenLightHeroProps {
  brand?: string;
  headline?: string;
  sub?: React.ReactNode;
  cta?: string;
  onCta?: () => void;
}

export const WovenLightHero = ({
  brand = "Woven",
  headline = "Woven by Light",
  sub = "An interactive tapestry of light and motion, crafted with code and creativity.",
  cta = "Explore the Weave",
  onCta,
}: WovenLightHeroProps = {}) => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();
  // Site-dark theme => white hero background => headline needs a dark
  // hairline + soft shadow instead of the white stroke / black glow
  // used on the black hero (those bleed around dark letters on white).
  const siteDark = useSiteDark();

  useEffect(() => {
    // Add a more elegant font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: (typeof i === "number" ? i : 0) * 0.04 + 0.8,
        duration: 0.7,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
        opacity: 1,
        transition: { delay: 1.9, duration: 0.8 }
    });

    return () => {
        if (link.parentNode === document.head) {
            document.head.removeChild(link);
        }
    }
  }, [textControls, buttonControls]);

  // Global sequential char indices so the cascade flows evenly across words
  // (the old i*5+j math restarted mid-word, leaving partial text like
  // "Abhis Gh" hanging on screen during the reveal).
  let charCursor = -1;
  const wordChars = headline.split(" ").map((word) =>
      word.split("").map((char) => {
          charCursor += 1;
          return { char, index: charCursor };
      })
  );

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black dark:bg-white">
      <WovenCanvas />
      {/* Legibility scrim so copy survives bright particle clusters */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_65%)]" />
      <HeroNav brand={brand} />
      <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto">
        <h1 className="text-white dark:text-slate-900 text-[clamp(2.75rem,7vw,6rem)] leading-[1.05] text-balance font-bold" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, WebkitTextStroke: siteDark ? '1px rgba(15,23,42,0.9)' : '1px rgba(255,255,255,0.85)', paintOrder: 'stroke', textShadow: siteDark ? '0 2px 20px rgba(15,23,42,0.18)' : '0 2px 24px rgba(0,0,0,0.9), 0 0 70px rgba(0,0,0,0.75)' }}>
            {wordChars.map((chars, i) => (
                <span key={i} className="inline-block">
                    {chars.map(({ char, index }) => (
                        <motion.span key={index} custom={index} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block' }}>
                            {char}
                        </motion.span>
                    ))}
                    {i < wordChars.length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </h1>
        <motion.p
          custom={headline.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-200 dark:text-slate-600"
          style={{ fontFamily: "'Inter', sans-serif", textShadow: siteDark ? 'none' : '0 1px 14px rgba(0,0,0,0.9)' }}
        >
          {sub}
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={buttonControls} className="mt-10">
          <button onClick={onCta} className="rounded-full border-2 border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 dark:border-slate-800/20 dark:bg-slate-800/5 dark:text-slate-800 dark:hover:bg-slate-800/10" style={{ fontFamily: "'Inter', sans-serif" }}>
            {cta}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// --- Navigation Component ---
const HeroNav = ({ brand = "Woven" }: { brand?: string }) => {
    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}
            className="absolute top-0 left-0 right-0 z-20 p-6"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white dark:text-slate-800">⎎</span>
                    <span className="text-xl font-bold text-white dark:text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>{brand}</span>
                </div>
            </div>
        </motion.nav>
    );
};

// Tracks the site theme (`.dark` on <html>) so text styling can match
// the hero background. Separate from the canvas observer below.
function useSiteDark() {
  const [siteDark, setSiteDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setSiteDark(el.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return siteDark;
}

// --- Three.js Canvas Component ---
const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  // Rebuild the particle scene when the site theme flips, so the dot
  // colors always match the hero background (black hero <-> white hero).
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const el = document.documentElement;
    let last = el.classList.contains('dark');
    const obs = new MutationObserver(() => {
      const cur = el.classList.contains('dark');
      if (cur !== last) {
        last = cur;
        setThemeTick((t) => t + 1);
      }
    });
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // Site-dark theme => white hero background => near-black dots.
    // Site-light theme => black hero background => bright weave.
    // Read from the theme class (not OS preference) so dots always
    // match the actual hero background.
    const lightBg = document.documentElement.classList.contains('dark');

    // --- Woven Silk ---
    const particleCount = 50000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);

    for (let i = 0; i < particleCount; i++) {
        const vertexIndex = i % torusKnot.attributes.position.count;
        const x = torusKnot.attributes.position.getX(vertexIndex);
        const y = torusKnot.attributes.position.getY(vertexIndex);
        const z = torusKnot.attributes.position.getZ(vertexIndex);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;

        const color = new THREE.Color();
        if (lightBg) {
          // Near-black dots with slight variation for depth on white.
          color.setHSL(Math.random(), 0.15, 0.04 + Math.random() * 0.08);
        } else {
          color.setHSL(Math.random(), 0.8, 0.7);
        }
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = 0;
        velocities[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        blending: lightBg ? THREE.NormalBlending : THREE.AdditiveBlending,
        transparent: true,
        opacity: lightBg ? 1.0 : 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scratch objects hoisted out of the per-particle loop: the original
    // allocates ~4 Vector3 per particle per frame (200k+/frame at 50k
    // particles), which churns the GC and janks the animation.
    const currentPos = new THREE.Vector3();
    const originalPos = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const returnForce = new THREE.Vector3();
    const mouseWorld = new THREE.Vector3();

    let raf = 0;
    const animate = () => {
        raf = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        mouseWorld.set(mouse.x * 3, mouse.y * 3, 0);

        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            currentPos.set(positions[ix], positions[iy], positions[iz]);
            originalPos.set(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
            velocity.set(velocities[ix], velocities[iy], velocities[iz]);

            const dist = currentPos.distanceTo(mouseWorld);
            if (dist < 1.5) {
                const force = (1.5 - dist) * 0.01;
                direction.subVectors(currentPos, mouseWorld).normalize();
                velocity.addScaledVector(direction, force);
            }

            // Return to original position
            returnForce.subVectors(originalPos, currentPos).multiplyScalar(0.001);
            velocity.add(returnForce);

            // Damping
            velocity.multiplyScalar(0.95);

            positions[ix] += velocity.x;
            positions[iy] += velocity.y;
            positions[iz] += velocity.z;

            velocities[ix] = velocity.x;
            velocities[iy] = velocity.y;
            velocities[iz] = velocity.z;
        }
        geometry.attributes.position.needsUpdate = true;

        points.rotation.y = elapsedTime * 0.05;
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        scene.remove(points);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        mount.removeChild(renderer.domElement);
    };
  }, [themeTick]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};
