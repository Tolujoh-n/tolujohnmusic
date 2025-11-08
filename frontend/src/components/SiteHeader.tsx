import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';

const navItems = [
  { label: 'About', to: '/about' },
  { label: 'Merch', to: '/merch' },
  { label: 'Music', to: '/music' },
  { label: 'Videos', to: '/videos' },
  { label: 'Tour', to: '/tour' },
  { label: 'Subscribe', to: '/subscribe' },
  { label: 'Contact', to: '/contact' },
];

const SiteHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 via-brand-400 to-accent-400 text-lg font-semibold text-white shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
            TJ
          </span>
          <div className="leading-tight">
            <p className="font-heading text-lg font-semibold uppercase tracking-widest text-white">
              Tolu John
            </p>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Music Artist</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'font-medium uppercase tracking-[0.35em] text-xs transition-colors',
                  isActive ? 'text-accent-300' : 'text-slate-300 hover:text-white',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/tour"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-accent-400 hover:text-accent-200"
          >
            Tour Dates
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <HiOutlineX className="h-6 w-6" /> : <HiOutlineMenuAlt3 className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950/95 md:hidden">
          <nav className="mx-6 flex flex-col gap-4 py-6 text-sm uppercase tracking-[0.4em] text-slate-300">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-center',
                    isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/tour"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/20 px-4 py-2 text-center font-semibold text-white"
            >
              Tour Dates
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;

