import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant shadow-sm">
      <div className="w-full max-w-[1280px] mx-auto px-6 flex items-center h-16 gap-6">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary shrink-0 mr-2">
          BlogFlow Pro
        </Link>

        {/* Barre de recherche — occupe tout l'espace disponible */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 relative group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 group-focus-within:text-primary transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des articles, catégories, auteurs..."
            className="w-full bg-surface-container-low pl-11 pr-5 py-2.5 border border-outline-variant rounded-full text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/60"
          />
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
