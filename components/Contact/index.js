import React, { useState, useRef, useEffect } from 'react';

const Contact = ({ data }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const copyEmail = () => {
    if (data.email) {
      navigator.clipboard.writeText(data.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-zinc-900 text-white py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className={`transition-all duration-500 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400 mb-3">
            04 — Contact
          </div>
          <h2 className="font-condensed text-5xl sm:text-6xl font-black uppercase tracking-tight">
            Let's Work Together
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Open to frontend roles in Mumbai / Remote. Fastest reply is email.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={copyEmail}
              className="px-7 py-3.5 bg-white text-zinc-900 font-semibold text-sm rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all"
            >
              {copied ? 'Copied!' : data.email || 'Copy Email'}
            </button>
            <div className="flex gap-3">
              {data.socials?.filter(s => s.title !== 'Email').map((s) => (
                <a
                  key={s.id}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 border border-zinc-700 rounded-xl text-sm font-medium text-white hover:border-white transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 font-mono text-xs text-zinc-500">
            {data.location}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
