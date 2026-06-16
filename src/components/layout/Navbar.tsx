import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-6 max-w-container mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-primary flex-shrink-0">BlogFlow Pro</Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center max-w-xl mx-8">
           <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des articles..." 
                className="bg-surface-container-lowest pl-11 pr-4 py-2.5 border-2 border-outline-variant rounded-full text-sm w-full focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-on-surface font-medium placeholder:text-on-surface-variant/70 shadow-sm" 
              />
           </form>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-on-surface-variant hover:text-primary text-sm px-4 py-2 transition-all duration-200 font-medium">
            Sign In
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
