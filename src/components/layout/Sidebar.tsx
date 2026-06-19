import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, TrendingUp, MessageSquare,
  Settings, LogOut, PenSquare, ChevronRight, Globe, Users, UserCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const adminLinks = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Articles',        path: '/admin/articles',  icon: FileText },
    { name: 'Commentaires',    path: '/admin/comments',  icon: MessageSquare },
    { name: 'Utilisateurs',    path: '/admin/users',     icon: Users },
    { name: 'Analytiques',     path: '/admin/analytics', icon: TrendingUp },
    { name: 'Paramètres',      path: '/admin/settings',  icon: Settings },
  ];

  const authorLinks = [
    { name: 'Mes articles',    path: '/admin/articles',  icon: FileText },
    { name: 'Mon profil',      path: '/admin/profile',   icon: UserCircle },
  ];

  const links = isAdmin ? adminLinks : authorLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] flex flex-col z-50 bg-[#0f172a] text-white">

      {/* Logo */}
      <div className="px-6 pt-7 pb-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <PenSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">BlogFlow</span>
        </Link>
        <p className="text-xs text-white/40 mt-1 ml-[42px]">
          {isAdmin ? 'Administration' : 'Espace rédacteur'}
        </p>
      </div>

      {/* Bouton nouvel article */}
      <div className="px-4 pt-5 pb-3">
        <Link
          to="/admin/articles/create"
          className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <PenSquare className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
          Menu
        </p>
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <link.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : '')} />
              <span className="flex-1">{link.name}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
            Site public
          </p>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>Voir le blog</span>
          </Link>
        </div>
      </nav>

      {/* Profil utilisateur */}
      <div className="px-4 pb-6 pt-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0 uppercase shadow">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Utilisateur'}</p>
            <p className="text-xs text-white/40 capitalize">
              {user?.role === 'admin' ? '🔑 Administrateur' : '✏️ Auteur'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
