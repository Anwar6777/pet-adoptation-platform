import { HeartHandshake, Mail, PawPrint } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const content = {
  '/how-it-works': { eyebrow: 'A simple journey', title: 'How PawConnect works', text: 'Browse the pets looking for home, submit a thoughtful application, and let our shelter team guide the next steps.' },
  '/about': { eyebrow: 'Our mission', title: 'Every pet deserves belonging.', text: 'PawConnect is an academic pet-adoption platform designed around kindness, clarity, and responsible adoption.' },
  '/contact': { eyebrow: 'We are here to help', title: 'Get in touch', text: 'Have a question about adoption or a pet profile? Our friendly shelter team would love to hear from you.' },
  '/privacy': { eyebrow: 'Your information', title: 'Privacy policy', text: 'PawConnect uses your information only to support your account and adoption application in this academic demonstration project.' },
};

function InfoPage() {
  const { pathname } = useLocation();
  const page = content[pathname] || content['/about'];
  const Icon = pathname === '/contact' ? Mail : pathname === '/how-it-works' ? PawPrint : HeartHandshake;
  return <main className="grid min-h-[65vh] place-items-center bg-cream px-5 py-16"><section className="max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-sm sm:p-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal/10 text-teal"><Icon size={28} /></div><p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-teal">{page.eyebrow}</p><h1 className="mt-3 text-4xl font-black text-charcoal">{page.title}</h1><p className="mt-5 leading-8 text-slate-600">{page.text}</p><Link to="/pets" className="mt-8 inline-flex rounded-xl bg-teal px-5 py-3 font-bold text-white hover:bg-[#348a7a]">Find a pet</Link></section></main>;
}

export default InfoPage;
