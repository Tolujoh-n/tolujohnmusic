import { NavLink } from 'react-router-dom';
import { FaSpotify, FaInstagram, FaYoutube, FaApple } from 'react-icons/fa';

const SiteFooter = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 md:flex-row md:justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold uppercase tracking-[0.4em] text-white">
            Tolu John
          </h3>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            Inspiring global worshippers through immersive sounds, heartfelt stories, and dynamic live
            experiences.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.4em] text-white">Navigate</h4>
          <nav className="mt-4 flex flex-col gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
            <NavLink to="/about" className="hover:text-white">
              About
            </NavLink>
            <NavLink to="/music" className="hover:text-white">
              Music
            </NavLink>
            <NavLink to="/videos" className="hover:text-white">
              Videos
            </NavLink>
            <NavLink to="/tour" className="hover:text-white">
              Tour
            </NavLink>
            <NavLink to="/merch" className="hover:text-white">
              Merch
            </NavLink>
            <NavLink to="/contact" className="hover:text-white">
              Contact
            </NavLink>
          </nav>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.4em] text-white">
            Listen & Connect
          </h4>
          <div className="mt-4 flex gap-4 text-xl text-slate-400">
            <a href="https://spotify.com" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaSpotify />
            </a>
            <a href="https://music.apple.com" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaApple />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaYoutube />
            </a>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">
            © {new Date().getFullYear()} Tolu John Music. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

