import { PawPrint, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/common/StatusBadge';
import { createPet, deletePet, getPets, updatePet } from '../../services/petService';

const emptyForm = {
  name: '',
  species: 'Dog',
  breed: '',
  age: '',
  gender: 'Male',
  description: '',
  personality: '',
  location: '',
  image: '',
  vaccinated: false,
  status: 'Available',
};

function AdminPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const loadPets = () =>
    getPets()
      .then((data) => setPets(data.pets))
      .catch(() => toast.error('Could not load pets.'))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadPets();
  }, []);

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-3 focus:ring-teal/10';

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (pet) => {
    setEditingId(pet._id);
    setForm({
      name: pet.name || '',
      species: pet.species || 'Dog',
      breed: pet.breed || '',
      age: pet.age ?? '',
      gender: pet.gender || 'Male',
      description: pet.description || '',
      personality: (pet.personality || []).join(', '),
      location: pet.location || '',
      image: pet.image || '',
      vaccinated: Boolean(pet.vaccinated),
      status: pet.status || 'Available',
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const update = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      age: Number(form.age),
      personality: form.personality
        .split(',')
        .map((trait) => trait.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        const data = await updatePet(editingId, payload);
        setPets((current) => current.map((pet) => (pet._id === editingId ? data.pet : pet)));
        toast.success('Pet updated successfully.');
      } else {
        const data = await createPet(payload);
        setPets((current) => [data.pet, ...current]);
        toast.success('Pet added successfully.');
      }
      closeForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save this pet.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (pet) => {
    if (!window.confirm(`Delete ${pet.name}? This cannot be undone.`)) return;
    setDeletingId(pet._id);
    try {
      await deletePet(pet._id);
      setPets((current) => current.filter((item) => item._id !== pet._id));
      toast.success('Pet deleted.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete this pet.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <main className="py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Shelter inventory</p>
            <h1 className="mt-2 text-4xl font-black text-charcoal">Manage pets</h1>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 font-bold text-white hover:bg-[#348a7a]"
          >
            <Plus size={18} /> Add pet
          </button>
        </div>

        {formOpen && (
          <form onSubmit={save} className="mt-7 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-charcoal">{editingId ? 'Edit pet' : 'Add a new pet'}</h2>
              <button type="button" onClick={closeForm} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="form-label">
                Name
                <input required className={inputClass} name="name" value={form.name} onChange={update} />
              </label>
              <label className="form-label">
                Species
                <select className="select-field mt-1.5" name="species" value={form.species} onChange={update}>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Rabbit</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="form-label">
                Breed
                <input required className={inputClass} name="breed" value={form.breed} onChange={update} />
              </label>
              <label className="form-label">
                Age (years)
                <input required type="number" min="0" max="30" className={inputClass} name="age" value={form.age} onChange={update} />
              </label>
              <label className="form-label">
                Gender
                <select className="select-field mt-1.5" name="gender" value={form.gender} onChange={update}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
              <label className="form-label">
                Status
                <select className="select-field mt-1.5" name="status" value={form.status} onChange={update}>
                  <option>Available</option>
                  <option>Pending</option>
                  <option>Adopted</option>
                </select>
              </label>
              <label className="form-label">
                Location
                <input required className={inputClass} name="location" value={form.location} onChange={update} />
              </label>
              <label className="form-label">
                Image URL
                <input required type="url" className={inputClass} name="image" value={form.image} onChange={update} placeholder="https://..." />
              </label>
              <label className="form-label sm:col-span-2">
                Personality traits (comma-separated)
                <input className={inputClass} name="personality" value={form.personality} onChange={update} placeholder="Friendly, Playful, Gentle" />
              </label>
              <label className="form-label sm:col-span-2">
                Description
                <textarea required rows="3" className={inputClass} name="description" value={form.description} onChange={update} />
              </label>
              <label className="choice-label w-fit">
                <input type="checkbox" name="vaccinated" checked={form.vaccinated} onChange={update} /> Vaccinated
              </label>
            </div>
            <div className="mt-7 flex gap-3">
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 font-bold text-white hover:bg-[#348a7a] disabled:opacity-60">
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add pet'}
              </button>
              <button type="button" onClick={closeForm} className="rounded-xl px-5 py-3 font-bold text-slate-500 hover:bg-slate-100">
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="mt-8 rounded-[2rem] bg-white shadow-sm">
          {loading ? (
            <div className="h-60 animate-pulse rounded-[2rem] bg-slate-50" />
          ) : pets.length === 0 ? (
            <div className="p-12 text-center">
              <PawPrint className="mx-auto text-teal" size={32} />
              <p className="mt-3 font-extrabold text-charcoal">No pets yet. Add your first one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4">Pet</th>
                    <th className="px-6 py-4">Species / Breed</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pets.map((pet) => (
                    <tr key={pet._id}>
                      <td className="flex items-center gap-3 px-6 py-4">
                        <img src={pet.image} alt={pet.name} className="h-10 w-10 rounded-lg object-cover" />
                        <span className="font-extrabold text-charcoal">{pet.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {pet.species} · {pet.breed}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{pet.location}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={pet.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(pet)} className="rounded-lg p-2 text-slate-500 hover:bg-teal/10 hover:text-teal" aria-label={`Edit ${pet.name}`}>
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => remove(pet)}
                            disabled={deletingId === pet._id}
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                            aria-label={`Delete ${pet.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
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

export default AdminPetsPage;
