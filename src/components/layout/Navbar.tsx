import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, logout } = useAuth();

  // Initialise avec le query param actuel si on est sur /search
  const [searchQuery, setSearchQuery] = useState(() =>
    location.pathname === '/search' ? (searchParams.get('q') ?? '') : ''
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronise le champ quand on navigue hors de /search
  useEffect(() => {
    if (location.pathname !== '/search') {
      setSearchQuery('');
    }
  }, [location.pathname]);

  // Déclenche la recherche automatiquement après 350ms de pause
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = searchQuery.trim();

    if (!trimmed) {
      // Si on efface tout et qu'on est sur /search, retour à l'accueil
      if (location.pathname === '/search') {
        navigate('/', { replace: true });
      }
      return;
    }

    debounceRef.current = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`, { replace: location.pathname === '/search' });
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    if (location.pathname === '/search') navigate('/', { replace: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant shadow-sm">
      <div className="w-full max-w-[1280px] mx-auto px-6 flex items-center h-16 gap-6">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary shrink-0 mr-2">
          BlogFlow
        </Link>

        {/* Barre de recherche — occupe tout l'espace disponible */}
        <form
          onSubmit={handleSubmit}
          className="hidden md:flex flex-1 relative group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 group-focus-within:text-primary transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des articles, catégories, auteurs..."
            className="w-full bg-surface-container-low pl-11 pr-10 py-2.5 border border-outline-variant rounded-full text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/60"
          />
          {/* Bouton effacer */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Actions — droite */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              <Link
                to="/admin/dashboard"
                className="hidden sm:block text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
              >
                Admin
              </Link>
              <button
                onClick={logout}
                className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
              >
                Déconnexion
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold uppercase">
                {user?.name?.[0] || 'U'}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
              >
                Connexion
              </Link>
              <Link to="/register">
                <Button size="sm">Commencer</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
