import React from 'react';

const Footer = ({ data }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-zinc-200 py-8 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg dark:border-zinc-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="font-condensed text-xl font-bold text-zinc-900 dark:text-white">AG</span>
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              © {currentYear} {data.name} {data.surname}
            </span>
          </div>

          <nav className="flex items-center gap-6">
            {[
              { href: '#hero', label: 'Top' },
              { href: '#experience', label: 'Experience' },
              { href: '#projects', label: 'Projects' },
              { href: '#contact', label: 'Contact' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Open to work
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
