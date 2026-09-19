import { ArrowLeft, Heart, MapPin, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdoptionApplicationForm from '../../components/forms/AdoptionApplicationForm';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function PetDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplication, setShowApplication] = useState(false);

  useEffect(() => { api.get(`/pets/${id}`).then(({ data }) => setPet(data.pet)).catch((requestError) => setError(requestError.response?.data?.message || 'Pet not found.')).finally(() => setLoading(false)); }, [id]);
  if (loading) return <main className="min-h-screen bg-cream px-5 py-16"><div className="mx-auto h-[25rem] max-w-6xl animate-pulse rounded-[2rem] bg-white" /></main>;
  if (error || !pet) return <main className="grid min-h-[60vh] place-items-center bg-cream px-5"><div className="text-center"><h1 className="text-3xl font-black text-charcoal">{error || 'Pet not found.'}</h1><Link to="/pets" className="mt-5 inline-block font-bold text-teal">Back to pets</Link></div></main>;

  const adopted = pet.status === 'Adopted';
  return <main className="bg-cream py-10 sm:py-14"><div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10"><Link to="/pets" className="inline-flex items-center gap-2 text-sm font-bold text-teal hover:text-charcoal"><ArrowLeft size={17} /> Back to all pets</Link><div className="mt-6 grid overflow-hidden rounded-[2rem] bg-white shadow-sm lg:grid-cols-2"><div className="min-h-[22.5rem] bg-orange-50"><img src={pet.image} alt={pet.name} className="h-full w-full object-cover" /></div><div className="p-7 sm:p-10"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-teal">{pet.species}</p><h1 className="mt-1 text-4xl font-black text-charcoal">{pet.name}</h1><p className="mt-2 text-lg text-slate-600">{pet.breed}</p></div><StatusBadge status={pet.status} /></div><div className="mt-7 grid grid-cols-2 gap-3 text-sm"><div className="detail-item">Age <strong>{pet.age} {pet.age === 1 ? 'year' : 'years'}</strong></div><div className="detail-item">Gender <strong>{pet.gender}</strong></div><div className="detail-item col-span-2"><MapPin size={16} className="text-teal" /> Location <strong>{pet.location}</strong></div><div className="detail-item col-span-2"><ShieldCheck size={16} className="text-teal" /> Vaccinated <strong>{pet.vaccinated ? 'Yes' : 'No'}</strong></div></div><div className="mt-7"><h2 className="font-extrabold text-charcoal">A little about {pet.name}</h2><p className="mt-3 leading-7 text-slate-600">{pet.description}</p></div><div className="mt-6"><h2 className="font-extrabold text-charcoal">Personality</h2><div className="mt-3 flex flex-wrap gap-2">{pet.personality.map((trait) => <span key={trait} className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-slate-600">{trait}</span>)}</div></div>{adopted ? <button disabled className="mt-8 w-full rounded-2xl bg-slate-100 px-5 py-3.5 font-bold text-slate-500">{pet.name} has been adopted</button> : !user ? <Link to="/login" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal px-5 py-3.5 font-bold text-white hover:bg-[#348a7a]"><Heart size={18} fill="currentColor" /> Login to apply</Link> : <button onClick={() => setShowApplication(true)} disabled={pet.status === 'Pending'} className="mt-8 w-full rounded-2xl bg-teal px-5 py-3.5 font-bold text-white hover:bg-[#348a7a] disabled:cursor-not-allowed disabled:bg-slate-300">{pet.status === 'Pending' ? 'Application under review' : `Apply to adopt ${pet.name}`}</button>}</div></div>{showApplication && <AdoptionApplicationForm pet={pet} user={user} onSubmitted={(updatedPet) => { setPet(updatedPet); setShowApplication(false); }} />}</div></main>;
}

export default PetDetailsPage;
