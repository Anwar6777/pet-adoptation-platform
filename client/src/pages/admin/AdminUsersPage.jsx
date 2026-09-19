import { Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { deleteUser, getUsers } from '../../services/userService';

function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.users))
      .catch(() => toast.error('Could not load users.'))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (user) => {
    if (!window.confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return;
    setDeletingId(user.id);
    try {
      await deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      toast.success('User deleted.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete this user.');
    } finally {
      setDeletingId('');
    }
  };

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
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const isSelf = user.id === currentUser.id;
                    return (
                      <tr key={user.id}>
                        <td className="px-6 py-4 font-extrabold text-charcoal">
                          {user.name}
                          {isSelf && <span className="ml-2 text-xs font-semibold text-slate-400">(you)</span>}
                        </td>
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
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() => remove(user)}
                              disabled={isSelf || deletingId === user.id}
                              title={isSelf ? "You can't delete your own account while logged in" : 'Delete user'}
                              className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Delete ${user.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
