import { CalendarDays, Check, ClipboardList, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';
import { getAllAdoptionRequests, updateAdoptionStatus } from '../../services/adoptionService';

const filters = ['All', 'Pending', 'Approved', 'Rejected'];

function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [actingId, setActingId] = useState('');

  useEffect(() => {
    getAllAdoptionRequests()
      .then((data) => setRequests(data.adoptions))
      .catch(() => toast.error('Could not load adoption requests.'))
      .finally(() => setLoading(false));
  }, []);

  const decide = async (id, status) => {
    setActingId(id);
    try {
      const data = await updateAdoptionStatus(id, status);
      setRequests((current) => current.map((request) => (request._id === id ? data.adoption : request)));
      toast.success(`Request ${status.toLowerCase()}.`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update this request.');
    } finally {
      setActingId('');
    }
  };

  const visible = filter === 'All' ? requests : requests.filter((request) => request.status === filter);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Adoption pipeline</p>
        <h1 className="mt-2 text-4xl font-black text-charcoal">Manage requests</h1>
        <p className="mt-3 text-slate-600">Review applications and approve or decline them.</p>

        <div className="mt-6 flex gap-2 overflow-x-auto">
          {filters.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
                filter === option ? 'bg-teal text-white' : 'bg-white text-slate-600 hover:bg-teal/10 hover:text-teal'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-7 h-60 animate-pulse rounded-[2rem] bg-white" />
        ) : visible.length === 0 ? (
          <div className="mt-7 rounded-[2rem] border border-dashed border-teal/30 bg-white p-12 text-center">
            <ClipboardList className="mx-auto text-teal" size={32} />
            <p className="mt-3 font-extrabold text-charcoal">No {filter !== 'All' ? filter.toLowerCase() : ''} requests.</p>
          </div>
        ) : (
          <div className="mt-7 grid gap-5">
            {visible.map((request) => (
              <article key={request._id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm sm:flex">
                <img src={request.pet?.image} alt={request.pet?.name || 'Pet'} className="h-48 w-full object-cover sm:h-auto sm:w-44" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black text-charcoal">{request.pet?.name || 'Pet unavailable'}</h2>
                      <p className="mt-1 font-medium text-teal">{request.pet?.breed}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="mt-4 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-bold text-charcoal">Applicant:</span> {request.user?.name || 'Unknown'}
                    </p>
                    <p>
                      <span className="font-bold text-charcoal">Email:</span> {request.user?.email || request.email}
                    </p>
                    <p>
                      <span className="font-bold text-charcoal">Phone:</span> {request.phone}
                    </p>
                    <p>
                      <span className="font-bold text-charcoal">Housing:</span> {request.housingType}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{request.reason}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
                    <CalendarDays size={15} /> Submitted {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                  {request.status === 'Pending' && (
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => decide(request._id, 'Approved')}
                        disabled={actingId === request._id}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-[#348a7a] disabled:opacity-50"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        onClick={() => decide(request._id, 'Rejected')}
                        disabled={actingId === request._id}
                        className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminRequestsPage;
