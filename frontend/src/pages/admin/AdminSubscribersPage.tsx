import { useQuery } from '@tanstack/react-query';
import { AdminAPI } from '../../lib/api';

const AdminSubscribersPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-subscribers'],
    queryFn: AdminAPI.listSubscribers,
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Audience</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Subscribers & Partners
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          View newsletter opt-ins and key contacts growing the Tolu John movement.
        </p>
      </header>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-elevated">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Total Subscribers: {data?.length ?? 0}
          </p>
        </div>

        {isLoading && <div className="mt-6 h-24 animate-pulse rounded-2xl bg-white/5" />}

        {isError && (
          <p className="mt-6 text-sm text-red-300">Unable to load subscribers right now.</p>
        )}

        {!isLoading && data?.length === 0 && (
          <p className="mt-6 text-sm text-slate-300">No subscribers just yet. First campaign launching soon.</p>
        )}

        {!isLoading && data && data.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {data.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{subscriber.email}</td>
                    <td className="px-4 py-3">{subscriber.source || 'website'}</td>
                    <td className="px-4 py-3">
                      {new Date(subscriber.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscribersPage;

