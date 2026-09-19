import { ArrowUpRight, MapPin, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

function PetCard({ pet }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/70">
      <div className="relative aspect-[4/3] overflow-hidden bg-orange-50"><img src={pet.image} alt={pet.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute left-4 top-4"><StatusBadge status={pet.status} /></div></div>
      <div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-extrabold text-charcoal">{pet.name}</h2><p className="mt-1 text-sm font-medium text-teal">{pet.breed}</p></div><span className="rounded-xl bg-orange-50 p-2 text-orange-400"><PawPrint size={19} /></span></div><div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600"><span className="rounded-full bg-slate-50 px-3 py-1.5">{pet.species}</span><span className="rounded-full bg-slate-50 px-3 py-1.5">{pet.age} {pet.age === 1 ? 'year' : 'years'}</span><span className="rounded-full bg-slate-50 px-3 py-1.5">{pet.gender}</span></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="inline-flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={15} className="text-teal" />{pet.location}</span><Link to={`/pets/${pet._id}`} className="inline-flex items-center gap-1 text-sm font-bold text-teal hover:text-charcoal">Meet {pet.name}<ArrowUpRight size={16} /></Link></div></div>
    </article>
  );
}

export default PetCard;
