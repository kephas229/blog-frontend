import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { PenSquare, Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = [
  {
    title: 'Contenu',
    links: [
      { label: 'Développement Web',      to: '/search?q=développement' },
      { label: 'Marketing Digital',       to: '/search?q=marketing' },
      { label: 'Intelligence Artificielle', to: '/search?q=intelligence artificielle' },
      { label: 'Cybersécurité',           to: '/search?q=cybersécurité' },
    ],
  },
  {
    title: 'Plateforme',
    links: [
      { label: 'Connexion',    to: '/login' },
      { label: 'Inscription',  to: '/register' },
      { label: 'Administration', to: '/admin/dashboard' },
    ],
  },
];

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-surface-container-lowest">
      <Navbar />
      <main className="flex-1 pt-16 w-full">
        <Outlet />
      </main>

      <footer className="w-full bg-[#0f172a] text-white mt-20">
        <div className="w-full max-w-[1280px] mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <PenSquare className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">BlogFlow</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                Plateforme de blog professionnelle en français. Articles de qualité sur le développement web, le marketing digital, l'IA et plus encore.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4 text-white/70" />
                  </a>
                ))}
              </div>
            </div>

            {/* Liens */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">{section.title}</p>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} BlogFlow. Tous droits réservés.
            </p>
            <div className="flex items-center gap-5 text-xs text-white/30">
              <a href="#" className="hover:text-white/60 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white/60 transition-colors">Conditions d'utilisation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
