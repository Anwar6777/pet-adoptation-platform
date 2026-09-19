import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/pets', label: 'Manage Pets' },
  { to: '/admin/requests', label: 'Manage Requests' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/profile', label: 'Profile' },
];

function AdminLayout() {
  const tabClass = ({ isActive }) =>
    `whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
      isActive ? 'bg-teal text-white shadow-sm' : 'text-slate-600 hover:bg-teal/10 hover:text-teal'
    }`;

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-orange-100/80 bg-white/60">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 sm:px-8 lg:px-10">
          {tabs.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end={tab.end} className={tabClass}>
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AdminLayout;
