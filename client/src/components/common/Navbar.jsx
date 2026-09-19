import { Heart, LogOut, Menu, PawPrint, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'Find Pets', to: '/pets' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);
  const navClass = ({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-teal' : 'text-slate-600 hover:text-teal'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10" aria-label="Main navigation">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-charcoal">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal text-white shadow-sm"><PawPrint size={21} /></span>
          Paw<span className="text-teal">Connect</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {publicLinks.map((link) => <NavLink key={link.to} className={navClass} to={link.to}>{link.label}</NavLink>)}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link className="text-sm font-semibold text-slate-600 hover:text-teal" to={user.role === 'admin' ? '/admin' : '/dashboard'}>{user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</Link>
              {user.role !== 'admin' && <><Link className="text-sm font-semibold text-slate-600 hover:text-teal" to="/my-requests">My Requests</Link><Link className="text-sm font-semibold text-slate-600 hover:text-teal" to="/profile">Profile</Link></>}
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:text-teal"><LogOut size={16} /> Logout</button>
            </>
          ) : (
            <>
              <Link className="px-3 py-2 text-sm font-bold text-charcoal hover:text-teal" to="/login">Login</Link>
              <Link className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#348a7a]" to="/register"><Heart size={16} fill="currentColor" /> Join PawConnect</Link>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen((open) => !open)} className="rounded-xl p-2 text-charcoal hover:bg-white lg:hidden" aria-label="Toggle navigation menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-orange-100 bg-cream px-5 py-5 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {publicLinks.map((link) => <NavLink key={link.to} onClick={closeMenu} className={navClass} to={link.to}>{link.label}</NavLink>)}
            <hr className="border-orange-100" />
            {user ? <button onClick={() => { logout(); closeMenu(); }} className="w-fit text-sm font-bold text-teal">Logout</button> : <div className="flex gap-3"><Link onClick={closeMenu} className="rounded-xl border border-teal px-4 py-2 text-sm font-bold text-teal" to="/login">Login</Link><Link onClick={closeMenu} className="rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white" to="/register">Register</Link></div>}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
