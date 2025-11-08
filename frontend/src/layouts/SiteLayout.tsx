import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const SiteLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <main className="pt-24">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;

