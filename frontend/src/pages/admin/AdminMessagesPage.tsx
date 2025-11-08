import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '../../lib/api';
import type { ContactMessage } from '../../types/content';

const statusLabels: Record<ContactMessage['status'], string> = {
  new: 'New',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
};

const AdminMessagesPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: AdminAPI.listMessages,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactMessage['status'] }) =>
      AdminAPI.updateMessageStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Inbox</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Messages & Opportunities
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Track booking requests, media inquiries, and collaboration notes coming from the website.
        </p>
      </header>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-elevated">
        {isLoading && <div className="h-24 animate-pulse rounded-2xl bg-white/5" />}

        {isError && <p className="text-sm text-red-300">Unable to load messages right now.</p>}

        {!isLoading && data?.length === 0 && (
          <p className="text-sm text-slate-300">
            Inbox is currently quiet. New messages will appear here instantly.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {data?.map((message) => (
            <article key={message._id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold text-white">{message.name}</h3>
                  <a href={`mailto:${message.email}`} className="text-sm text-accent-200">
                    {message.email}
                  </a>
                </div>
                <select
                  value={message.status}
                  onChange={(event) =>
                    updateStatusMutation.mutate({
                      id: message._id,
                      status: event.target.value as ContactMessage['status'],
                    })
                  }
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                >
                  {Object.keys(statusLabels).map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status as ContactMessage['status']]}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm text-slate-200">{message.message}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;

