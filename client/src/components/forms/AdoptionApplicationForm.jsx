import { ArrowLeft, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { submitAdoptionRequest } from '../../services/adoptionService';

function AdoptionApplicationForm({ pet, user, onSubmitted }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '', city: '', housingType: '', previousPetExperience: '', reason: '', contactMethod: 'Email' });
  const [error, setError] = useState('');
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const next = () => {
    if (step === 1 && (!form.fullName || !form.email || !form.phone || !form.address || !form.city)) return setError('Please complete all contact details before continuing.');
    if (step === 2 && (!form.housingType || form.previousPetExperience === '' || form.reason.trim().length < 20)) return setError('Please share your housing details and a thoughtful reason of at least 20 characters.');
    setError('');
    setStep((current) => current + 1);
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const data = await submitAdoptionRequest({ ...form, previousPetExperience: form.previousPetExperience === 'true', petId: pet._id });
      toast.success('Adoption request submitted. We will be in touch soon!');
      onSubmitted(data.pet);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-3 focus:ring-teal/10';
  return <section className="mt-10 rounded-[2rem] border border-teal/15 bg-[#f1faf8] p-5 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-teal">Adoption application</p><h2 className="mt-1 text-2xl font-black text-charcoal">Bring {pet.name} home</h2></div><Heart className="text-peach" fill="currentColor" /></div><div className="mt-6 flex gap-2">{[1, 2, 3].map((number) => <span key={number} className={`h-1.5 flex-1 rounded-full ${number <= step ? 'bg-teal' : 'bg-teal/15'}`} />)}</div>{error && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}
    {step === 1 && <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="form-label">Full name<input className={inputClass} name="fullName" value={form.fullName} onChange={update} /></label><label className="form-label">Email address<input className={inputClass} name="email" type="email" value={form.email} onChange={update} /></label><label className="form-label">Phone number<input className={inputClass} name="phone" value={form.phone} onChange={update} /></label><label className="form-label">City<input className={inputClass} name="city" value={form.city} onChange={update} /></label><label className="form-label sm:col-span-2">Address<textarea className={inputClass} name="address" rows="2" value={form.address} onChange={update} /></label></div>}
    {step === 2 && <div className="mt-6 grid gap-5"><label className="form-label">Housing type<select className={inputClass} name="housingType" value={form.housingType} onChange={update}><option value="">Select one</option><option>Apartment</option><option>Independent House</option><option>Farmhouse</option><option>Other</option></select></label><fieldset><legend className="form-label">Do you have previous pet experience?</legend><div className="mt-2 flex gap-3"><label className="choice-label"><input name="previousPetExperience" type="radio" value="true" checked={form.previousPetExperience === 'true'} onChange={update} /> Yes</label><label className="choice-label"><input name="previousPetExperience" type="radio" value="false" checked={form.previousPetExperience === 'false'} onChange={update} /> No</label></div></fieldset><label className="form-label">Why would you like to adopt {pet.name}?<textarea className={inputClass} name="reason" rows="5" value={form.reason} onChange={update} placeholder="Tell us a little about the loving home you can provide..." /></label></div>}
    {step === 3 && <div className="mt-6"><div className="rounded-2xl bg-white p-5"><CheckCircle2 className="text-teal" /><h3 className="mt-3 text-lg font-extrabold text-charcoal">One final detail</h3><p className="mt-1 text-sm leading-6 text-slate-600">How should the shelter team contact you about your application?</p><div className="mt-4 flex gap-3"><label className="choice-label"><input type="radio" name="contactMethod" value="Email" checked={form.contactMethod === 'Email'} onChange={update} /> Email</label><label className="choice-label"><input type="radio" name="contactMethod" value="Phone" checked={form.contactMethod === 'Phone'} onChange={update} /> Phone</label></div></div></div>}
    <div className="mt-7 flex items-center justify-between gap-3">{step > 1 ? <button onClick={() => { setError(''); setStep((current) => current - 1); }} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-bold text-slate-600 hover:bg-white"><ArrowLeft size={17} /> Back</button> : <span />}{step < 3 ? <button onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 font-bold text-white hover:bg-[#348a7a]">Continue <ArrowRight size={17} /></button> : <button disabled={submitting} onClick={submit} className="rounded-xl bg-teal px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit application'}</button>}</div>
  </section>;
}

export default AdoptionApplicationForm;
