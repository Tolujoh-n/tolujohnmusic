import { FaSpotify, FaInstagram, FaYoutube, FaApple } from 'react-icons/fa';

const SiteFooter = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 md:flex-row md:justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold uppercase tracking-[0.4em] text-white">
            Tolu John
          </h3>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">
            © {new Date().getFullYear()} Tolu John Music. All rights reserved.
          </p>
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
          
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

