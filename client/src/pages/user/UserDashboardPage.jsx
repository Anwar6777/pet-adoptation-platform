import { ArrowRight, ClipboardList, Clock3, Heart, PawPrint } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { getMyAdoptionRequests } from '../../services/adoptionService';

function UserDashboardPage() {
  const { user } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMyAdoptionRequests().then((data) => setAdoptions(data.adoptions)).catch(() => setAdoptions([])).finally(() => setLoading(false)); }, []);
  const pending = adoptions.filter((request) => request.status === 'Pending').length;
  const approved = adoptions.filter((request) => request.status === 'Approved').length;
  const cards = [{ label: 'My requests', value: adoptions.length, icon: ClipboardList, style: 'bg-orange-50 text-orange-500' }, { label: 'Under review', value: pending, icon: Clock3, style: 'bg-amber-50 text-amber-600' }, { label: 'Approved', value: approved, icon: Heart, style: 'bg-emerald-50 text-emerald-600' }];

  return <main className="min-h-screen bg-cream py-10"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Your PawConnect space</p><h1 className="mt-2 text-4xl font-black text-charcoal">Welcome back, {user.name.split(' ')[0]}.</h1><p className="mt-3 text-slate-600">Keep track of the pets and adoption journeys that matter to you.</p><section className="mt-8 grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, icon: Icon, style }) => <article key={label} className="rounded-3xl bg-white p-5 shadow-sm"><div className={`grid h-11 w-11 place-items-center rounded-2xl ${style}`}><Icon size={21} /></div><p className="mt-5 text-3xl font-black text-charcoal">{loading ? '—' : value}</p><p className="mt-1 text-sm font-semibold text-slate-500">{label}</p></article>)}</section><section className="mt-9 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-teal">Recent activity</p><h2 className="mt-1 text-2xl font-black text-charcoal">Your adoption requests</h2></div><Link to="/my-requests" className="inline-flex items-center gap-2 font-bold text-teal hover:text-charcoal">View all <ArrowRight size={17} /></Link></div>{loading ? <div className="mt-7 h-32 animate-pulse rounded-2xl bg-slate-50" /> : adoptions.length === 0 ? <div className="mt-7 rounded-2xl border border-dashed border-teal/30 bg-[#f1faf8] p-8 text-center"><PawPrint className="mx-auto text-teal" /><p className="mt-3 font-extrabold text-charcoal">Your adoption journey starts here.</p><Link to="/pets" className="mt-3 inline-block text-sm font-bold text-teal hover:text-charcoal">Find a pet</Link></div> : <div className="mt-7 divide-y divide-slate-100">{adoptions.slice(0, 3).map((request) => <div key={request._id} className="flex items-center justify-between gap-4 py-4"><div className="flex min-w-0 items-center gap-3"><img src={request.pet?.image} alt="" className="h-12 w-12 rounded-xl object-cover" /><div className="min-w-0"><p className="truncate font-extrabold text-charcoal">{request.pet?.name || 'Pet unavailable'}</p><p className="text-sm text-slate-500">Submitted {new Date(request.createdAt).toLocaleDateString()}</p></div></div><StatusBadge status={request.status} /></div>)}</div>}</section></div></main>;
}

export default UserDashboardPage;
