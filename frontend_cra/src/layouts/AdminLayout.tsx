import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { HiLogout, HiTemplate } from 'react-icons/hi';
import {
  HiOutlineChartSquareBar,
  HiOutlineMusicNote,
  HiOutlinePlay,
  HiOutlineCalendar,
  HiOutlineShoppingBag,
  HiOutlineUserGroup,
  HiOutlineMail,
  HiOutlineSparkles,
  HiOutlineUserCircle,
} from 'react-icons/hi';

const adminNav = [
  { to: '/admin/dashboard', label: 'Overview', icon: HiOutlineChartSquareBar },
  { to: '/admin/hero', label: 'Hero Highlight', icon: HiOutlineSparkles },
  { to: '/admin/about', label: 'About', icon: HiTemplate },
  { to: '/admin/music', label: 'Music', icon: HiOutlineMusicNote },
  { to: '/admin/videos', label: 'Videos', icon: HiOutlinePlay },
  { to: '/admin/tour', label: 'Tour', icon: HiOutlineCalendar },
  { to: '/admin/merch', label: 'Merch', icon: HiOutlineShoppingBag },
  { to: '/admin/subscribers', label: 'Subscribers', icon: HiOutlineUserGroup },
  { to: '/admin/messages', label: 'Messages', icon: HiOutlineMail },
  { to: '/admin/profile', label: 'Profile', icon: HiOutlineUserCircle },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore((state) => ({
    admin: state.admin,
    logout: state.logout,
  }));

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <aside className="hidden w-72 flex-col border-r border-slate-800 bg-slate-950/70 px-6 py-10 lg:flex">
        <div>
          <p className="font-heading text-lg font-semibold uppercase tracking-[0.4em] text-white">
            Tolu John
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.35em] text-slate-500">Admin Console</p>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-500/20 text-white ring-1 ring-brand-400/40'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signed in as</p>
            <p className="mt-1 text-sm font-semibold text-white">{admin?.name}</p>
            <p className="text-xs text-slate-500">{admin?.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <HiLogout className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading text-base font-semibold uppercase tracking-[0.3em] text-white">
                Admin Console
              </p>
              <p className="text-xs text-slate-400">Welcome back, {admin?.name}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
            >
              <HiLogout className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 bg-slate-900 px-4 pb-16 pt-6 sm:px-8 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

