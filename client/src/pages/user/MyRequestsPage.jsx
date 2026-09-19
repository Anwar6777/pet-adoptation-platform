import { CalendarDays, ClipboardList, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';
import { cancelAdoptionRequest, getMyAdoptionRequests } from '../../services/adoptionService';

function MyRequestsPage() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState('');
  const loadRequests = () => getMyAdoptionRequests().then((data) => setAdoptions(data.adoptions)).catch(() => toast.error('Could not load your adoption requests.')).finally(() => setLoading(false));
  useEffect(() => { loadRequests(); }, []);
  const cancel = async (id) => {
    if (!window.confirm('Cancel this pending adoption request?')) return;
    setCancelling(id);
    try { await cancelAdoptionRequest(id); setAdoptions((current) => current.filter((request) => request._id !== id)); toast.success('Adoption request cancelled.'); } catch (error) { toast.error(error.response?.data?.message || 'Could not cancel the request.'); } finally { setCancelling(''); }
  };

  return <main className="min-h-screen bg-cream py-10"><div className="mx-auto max-w-5xl px-5 sm:px-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Your applications</p><h1 className="mt-2 text-4xl font-black text-charcoal">My adoption requests</h1><p className="mt-3 text-slate-600">See where every application is in its journey.</p>{loading ? <div className="mt-8 h-60 animate-pulse rounded-[2rem] bg-white" /> : adoptions.length === 0 ? <div className="mt-8 rounded-[2rem] border border-dashed border-teal/30 bg-white p-12 text-center"><ClipboardList className="mx-auto text-teal" size={32} /><h2 className="mt-4 text-xl font-black text-charcoal">No requests yet</h2><p className="mt-2 text-slate-500">When you apply for a pet, you will see it here.</p></div> : <div className="mt-8 grid gap-5">{adoptions.map((request) => <article key={request._id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm sm:flex"><img src={request.pet?.image} alt={request.pet?.name || 'Pet'} className="h-52 w-full object-cover sm:h-auto sm:w-48" /><div className="flex flex-1 flex-col p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-2xl font-black text-charcoal">{request.pet?.name || 'Pet unavailable'}</h2><p className="mt-1 font-medium text-teal">{request.pet?.breed || 'Adoption request'}</p></div><StatusBadge status={request.status} /></div><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays size={15} /> {new Date(request.createdAt).toLocaleDateString()}</span>{request.pet?.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {request.pet.location}</span>}</div><p className="mt-4 text-sm leading-6 text-slate-600">{request.status === 'Pending' ? 'The shelter team is reviewing your application.' : request.status === 'Approved' ? 'Wonderful news! The shelter will contact you with next steps.' : 'This request was not approved. You are welcome to meet other pets.'}</p>{request.status === 'Pending' && <button onClick={() => cancel(request._id)} disabled={cancelling === request._id} className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"><X size={16} /> {cancelling === request._id ? 'Cancelling...' : 'Cancel request'}</button>}</div></article>)}</div>}</div></main>;
}

export default MyRequestsPage;
