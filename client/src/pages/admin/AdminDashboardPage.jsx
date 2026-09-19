import { ClipboardList, Heart, PawPrint, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import { getDashboardSummary } from '../../services/adminService';

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((data) => {
        setStats(data.stats);
        setRecentRequests(data.recentRequests);
      })
      .catch(() => {
        setStats(null);
        setRecentRequests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total pets', value: stats?.totalPets, icon: PawPrint, style: 'bg-teal/10 text-teal' },
    { label: 'Available', value: stats?.availablePets, icon: Heart, style: 'bg-emerald-50 text-emerald-600' },
    { label: 'Adopted', value: stats?.adoptedPets, icon: Heart, style: 'bg-rose-50 text-rose-600' },
    { label: 'Pending requests', value: stats?.pendingRequests, icon: ClipboardList, style: 'bg-amber-50 text-amber-600' },
    { label: 'Total users', value: stats?.totalUsers, icon: Users, style: 'bg-orange-50 text-orange-500' },
  ];

  return (
    <main className="min-h-screen bg-cream py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Shelter administration</p>
        <h1 className="mt-2 text-4xl font-black text-charcoal">Admin dashboard</h1>
        <p className="mt-3 text-slate-600">An overview of pets, adoptions, and members across PawConnect.</p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(({ label, value, icon: Icon, style }) => (
            <article key={label} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className={`grid h-11 w-11 place-items-center rounded-2xl ${style}`}>
                <Icon size={21} />
              </div>
              <p className="mt-5 text-3xl font-black text-charcoal">{loading ? '—' : value ?? 0}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
            </article>
          ))}
        </section>

        <section className="mt-9 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal">Recent activity</p>
          <h2 className="mt-1 text-2xl font-black text-charcoal">Latest adoption requests</h2>

          {loading ? (
            <div className="mt-7 h-32 animate-pulse rounded-2xl bg-slate-50" />
          ) : recentRequests.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-dashed border-teal/30 bg-[#f1faf8] p-8 text-center">
              <PawPrint className="mx-auto text-teal" />
              <p className="mt-3 font-extrabold text-charcoal">No adoption requests yet.</p>
            </div>
          ) : (
            <div className="mt-7 divide-y divide-slate-100">
              {recentRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <img src={request.pet?.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-extrabold text-charcoal">{request.pet?.name || 'Pet unavailable'}</p>
                      <p className="text-sm text-slate-500">
                        {request.user?.name || 'Unknown user'} · {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
