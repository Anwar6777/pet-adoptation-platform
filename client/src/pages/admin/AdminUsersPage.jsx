import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUsers } from '../../services/userService';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.users))
      .catch(() => toast.error('Could not load users.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Community</p>
        <h1 className="mt-2 text-4xl font-black text-charcoal">Manage users</h1>
        <p className="mt-3 text-slate-600">Everyone registered on PawConnect.</p>

        <section className="mt-7 rounded-[2rem] bg-white shadow-sm">
          {loading ? (
            <div className="h-60 animate-pulse rounded-[2rem] bg-slate-50" />
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto text-teal" size={32} />
              <p className="mt-3 font-extrabold text-charcoal">No users yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 font-extrabold text-charcoal">{user.name}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-slate-600">{user.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                            user.role === 'admin' ? 'bg-teal/10 text-teal ring-teal/20' : 'bg-slate-50 text-slate-600 ring-slate-100'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminUsersPage;
