import React from 'react';
import { WovenLightHero } from '../ui/woven-light-hero';

const Hero = ({ data }) => {
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative w-full overflow-hidden">
      <WovenLightHero
        brand="AG"
        headline={data ? `${data.name} ${data.surname}` : undefined}
        sub={
          <>
            <span className="text-red-500 font-semibold">Fullstack Developer</span>
            {" specializing in React, Next.js & workflow automation — 1+ year of experience shipping production systems."}
          </>
        }
        cta="View My Work"
        onCta={scrollToProjects}
      />
    </section>
  );
};

export default Hero;
