import { Heart, LockKeyhole, Mail, PawPrint, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function AuthPage() {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post(isLogin ? '/auth/login' : '/auth/register', form);
      login(data);
      toast.success(isLogin ? 'Welcome back to PawConnect!' : 'Your PawConnect account is ready!');
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-3 focus:ring-teal/10';
  return <main className="min-h-screen bg-cream px-5 py-12"><div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-orange-100/50 lg:grid-cols-[.9fr_1.1fr]"><aside className="hidden bg-charcoal p-10 text-white lg:flex lg:flex-col lg:justify-between"><div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-peach text-charcoal"><PawPrint /></div><p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-peach">PawConnect</p><h1 className="mt-3 text-4xl font-black leading-tight">A home can change everything.</h1><p className="mt-5 leading-7 text-slate-300">Join a community that believes every pet deserves safety, affection, and a second chance.</p></div><p className="inline-flex items-center gap-2 text-sm text-slate-300"><Heart size={16} fill="currentColor" className="text-peach" /> Find your future best friend.</p></aside><section className="p-7 sm:p-10"><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-teal hover:text-charcoal"><PawPrint size={17} /> PawConnect</Link><p className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-teal">{isLogin ? 'Welcome back' : 'Join the community'}</p><h2 className="mt-2 text-3xl font-black text-charcoal">{isLogin ? 'Log in to PawConnect' : 'Create your account'}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{isLogin ? 'Continue your adoption journey.' : 'Start making a difference, one adoption at a time.'}</p>{error && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}<form onSubmit={submit} className="mt-7 space-y-4">{!isLogin && <label className="form-label">Full name<div className="relative"><UserRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required className={`${inputClass} pl-11`} name="name" value={form.name} onChange={update} placeholder="Your name" /></div></label>}<label className="form-label">Email address<div className="relative"><Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="email" className={`${inputClass} pl-11`} name="email" value={form.email} onChange={update} placeholder="you@example.com" /></div></label><label className="form-label">Password<div className="relative"><LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required minLength="6" type="password" className={`${inputClass} pl-11`} name="password" value={form.password} onChange={update} placeholder="At least 6 characters" /></div></label>{!isLogin && <><label className="form-label">Phone number <span className="font-normal text-slate-400">(optional)</span><input className={inputClass} name="phone" value={form.phone} onChange={update} placeholder="Your phone number" /></label><label className="form-label">Address <span className="font-normal text-slate-400">(optional)</span><input className={inputClass} name="address" value={form.address} onChange={update} placeholder="Your address" /></label></>}<button disabled={submitting} className="w-full rounded-xl bg-teal py-3.5 font-bold text-white transition hover:bg-[#348a7a] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}</button></form><p className="mt-6 text-center text-sm text-slate-500">{isLogin ? 'New to PawConnect?' : 'Already have an account?'} <Link className="font-bold text-teal hover:text-charcoal" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Log in'}</Link></p></section></div></main>;
}

export default AuthPage;
