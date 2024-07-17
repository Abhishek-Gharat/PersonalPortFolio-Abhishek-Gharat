import gsap from "gsap";

export const stagger = (target, fromVars, toVars) => {
  return gsap.fromTo(
    target,
    { opacity: 0, ...fromVars },
    { opacity: 1, ...toVars, stagger: 0.2, ease: "power3.out" }
  );
};
