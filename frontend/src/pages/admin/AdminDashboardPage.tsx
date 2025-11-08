import { useQuery } from '@tanstack/react-query';
import { AdminAPI } from '../../lib/api';
import {
  HiOutlineMusicalNote,
  HiOutlinePlay,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineMail,
} from 'react-icons/hi';

const metricIcons = {
  tracks: HiOutlineMusicalNote,
  videos: HiOutlinePlay,
  upcomingTours: HiOutlineCalendar,
  subscribers: HiOutlineUserGroup,
  newMessages: HiOutlineMail,
};

const metricLabels: Record<string, string> = {
  tracks: 'Tracks Published',
  videos: 'Videos Released',
  upcomingTours: 'Upcoming Tours',
  subscribers: 'Subscribers',
  newMessages: 'New Messages',
};

const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: AdminAPI.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-3xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
        Unable to load dashboard metrics right now.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Dashboard</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Platform Health Overview
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Monitor key performance indicators for the Tolu John artist experience.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(data).map(([key, value]) => {
          const Icon = metricIcons[key as keyof typeof metricIcons] ?? HiOutlineMusicalNote;
          return (
            <div
              key={key}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-elevated"
            >
              <Icon className="h-8 w-8 text-accent-300" />
              <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-400">
                {metricLabels[key] || key}
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

