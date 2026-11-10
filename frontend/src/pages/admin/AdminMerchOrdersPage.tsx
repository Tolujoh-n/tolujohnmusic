import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '../../lib/api';
import type { MerchOrder, MerchOrderStatus } from '../../types/content';
import { formatMoney } from '../../lib/currency';

const statusLabels: Record<MerchOrderStatus, string> = {
  new: 'New',
  'in-progress': 'In Progress',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

const AdminMerchOrdersPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-merch-orders'],
    queryFn: AdminAPI.listMerchOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MerchOrderStatus }) =>
      AdminAPI.updateMerchOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merch-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminAPI.deleteMerchOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merch-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Merch</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Shipping Requests
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Manage Get it Now form submissions. No payment is collected here — follow up with the fan
          to complete fulfillment.
        </p>
      </header>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-elevated">
        {isLoading && <div className="h-24 animate-pulse rounded-2xl bg-white/5" />}

        {isError && <p className="text-sm text-red-300">Unable to load merch orders right now.</p>}

        {!isLoading && data?.length === 0 && (
          <p className="text-sm text-slate-300">
            No shipping requests yet. Form-based merch CTAs will appear here when fans submit.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {data?.map((order: MerchOrder) => (
            <article key={order._id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold text-white">
                    {order.itemTitle}
                  </h3>
                  <p className="mt-1 text-sm text-accent-200">
                    {typeof order.itemPrice === 'number'
                      ? formatMoney(order.itemPrice, order.currency)
                      : order.currency}{' '}
                    · Qty {order.quantity}
                  </p>
                  <div className="mt-4 space-y-1 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-500">Name:</span> {order.name}
                    </p>
                    <p>
                      <span className="text-slate-500">Email:</span>{' '}
                      <a href={`mailto:${order.email}`} className="text-accent-200">
                        {order.email}
                      </a>
                    </p>
                    <p>
                      <span className="text-slate-500">Phone:</span>{' '}
                      <a href={`tel:${order.phone}`} className="text-accent-200">
                        {order.phone}
                      </a>
                    </p>
                    <p>
                      <span className="text-slate-500">Address:</span> {order.addressLine1}
                      {order.addressLine2 ? `, ${order.addressLine2}` : ''}
                    </p>
                    <p>
                      {order.city}, {order.state}, {order.country}
                      {order.postalCode ? ` ${order.postalCode}` : ''}
                    </p>
                    {order.notes && (
                      <p className="whitespace-pre-line pt-2 text-slate-200">
                        <span className="text-slate-500">Notes:</span> {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateStatusMutation.mutate({
                        id: order._id,
                        status: event.target.value as MerchOrderStatus,
                      })
                    }
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                  >
                    {Object.keys(statusLabels).map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status as MerchOrderStatus]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(order._id)}
                    className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMerchOrdersPage;
