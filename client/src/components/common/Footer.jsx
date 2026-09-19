import { Facebook, Heart, Instagram, Mail, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-charcoal text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <section>
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white"><PawPrint className="text-peach" /> PawConnect</Link>
          <p className="mt-4 max-w-xs text-sm leading-6">Helping pets find loving homes, one meaningful connection at a time.</p>
        </section>
        <section><h2 className="font-bold text-white">Explore</h2><div className="mt-4 flex flex-col gap-3 text-sm"><Link to="/pets" className="hover:text-peach">Find Pets</Link><Link to="/how-it-works" className="hover:text-peach">How It Works</Link><Link to="/about" className="hover:text-peach">About Us</Link></div></section>
        <section><h2 className="font-bold text-white">Support</h2><div className="mt-4 flex flex-col gap-3 text-sm"><Link to="/contact" className="hover:text-peach">Contact</Link><Link to="/privacy" className="hover:text-peach">Privacy Policy</Link><a href="mailto:hello@pawconnect.demo" className="hover:text-peach">hello@pawconnect.demo</a></div></section>
        <section><h2 className="font-bold text-white">Stay connected</h2><p className="mt-4 text-sm leading-6">Small acts of care can change a pet&apos;s whole world.</p><div className="mt-5 flex gap-3"><a href="https://instagram.com" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 hover:bg-teal"><Instagram size={17} /></a><a href="https://facebook.com" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 hover:bg-teal"><Facebook size={17} /></a><a href="mailto:hello@pawconnect.demo" aria-label="Email PawConnect" className="rounded-full bg-white/10 p-2.5 hover:bg-teal"><Mail size={17} /></a></div></section>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-5 text-xs sm:flex-row sm:px-8 lg:px-10"><span>© 2026 PawConnect. All rights reserved.</span><span className="inline-flex items-center gap-1">Made with <Heart size={13} fill="currentColor" className="text-peach" /> for every paw</span></div></div>
    </footer>
  );
}

export default Footer;
