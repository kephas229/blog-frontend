import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">

      {/* Illustration numérique */}
      <div className="relative mb-10">
        <div className="text-[140px] md:text-[180px] font-black text-outline-variant/10 leading-none select-none tracking-tighter">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Search className="w-9 h-9 text-primary/60" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-on-surface mb-3">
        Page introuvable
      </h1>
      <p className="text-on-surface-variant text-base max-w-[380px] mb-10 leading-relaxed">
        La page que vous cherchez n'existe pas, a été déplacée ou l'URL est incorrecte.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95"
        >
          <Home className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 border border-outline-variant text-on-surface-variant px-6 py-3 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Page précédente
        </button>
      </div>
    </div>
  );
};
