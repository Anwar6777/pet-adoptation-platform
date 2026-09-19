import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import PetCard from '../../components/pets/PetCard';
import { getPets } from '../../services/petService';

const initialFilters = { search: '', species: '', breed: '', gender: '', age: '', location: '', status: 'Available' };

function BrowsePetsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPets(filters);
        setPets(data.pets);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'We could not load pets right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(loadPets, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  const updateFilter = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  const clearFilters = () => setFilters(initialFilters);

  return (
    <main className="min-h-screen bg-cream"><section className="border-b border-orange-100 bg-white"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10"><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Find your companion</p><h1 className="mt-2 text-4xl font-black text-charcoal sm:text-5xl">Meet the pets waiting for home.</h1><p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600">A new best friend might be one small search away.</p></div></section><section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10"><div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-extrabold text-charcoal"><SlidersHorizontal size={17} className="text-teal" /> Search and filter</div><div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5"><label className="relative lg:col-span-2"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input name="search" value={filters.search} onChange={updateFilter} placeholder="Search name, breed, or location" className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-3 focus:ring-teal/10" /></label><select name="species" value={filters.species} onChange={updateFilter} className="select-field"><option value="">All species</option><option>Dog</option><option>Cat</option><option>Rabbit</option><option>Other</option></select><select name="gender" value={filters.gender} onChange={updateFilter} className="select-field"><option value="">Any gender</option><option>Male</option><option>Female</option></select><select name="status" value={filters.status} onChange={updateFilter} className="select-field"><option value="">All statuses</option><option>Available</option><option>Pending</option><option>Adopted</option></select></div><div className="mt-3 flex flex-wrap items-center gap-3"><input name="breed" value={filters.breed} onChange={updateFilter} placeholder="Filter by breed" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-3 focus:ring-teal/10 sm:w-52" /><select name="age" value={filters.age} onChange={updateFilter} className="select-field w-full sm:w-40"><option value="">Any age</option><option value="1">1 year</option><option value="2">2 years</option><option value="3">3 years</option><option value="4">4 years</option><option value="5">5 years</option></select><input name="location" value={filters.location} onChange={updateFilter} placeholder="Filter by location" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-3 focus:ring-teal/10 sm:w-60" /><button onClick={clearFilters} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 hover:bg-orange-50 hover:text-charcoal"><X size={16} /> Clear filters</button></div></div>
      <div className="mt-8 flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{loading ? 'Finding pets...' : `${pets.length} pet${pets.length === 1 ? '' : 's'} found`}</p></div>
      {error && <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-medium text-rose-700">{error}</div>}
      {loading ? <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-96 animate-pulse rounded-3xl bg-white" />)}</div> : !error && (pets.length > 0 ? <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}</div> : <div className="mt-6 rounded-3xl border border-dashed border-teal/30 bg-white px-6 py-16 text-center"><p className="text-xl font-extrabold text-charcoal">No pets match those filters.</p><p className="mt-2 text-slate-500">Try adjusting your search to meet more wonderful companions.</p><button onClick={clearFilters} className="mt-5 font-bold text-teal hover:text-charcoal">Clear filters</button></div>)}</section></main>
  );
}

export default BrowsePetsPage;
