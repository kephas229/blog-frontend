import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/admin/dashboard':       'Tableau de bord',
  '/admin/articles':        'Articles',
  '/admin/articles/create': 'Nouvel article',
  '/admin/comments':        'Commentaires',
  '/admin/analytics':       'Analytiques',
  '/admin/media':           'Médias',
  '/admin/settings':        'Paramètres',
  '/admin/users':           'Utilisateurs',
  '/admin/profile':         'Mon profil',
};

export const AdminLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  const pageTitle = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? 'Administration';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9fb]">
      <Sidebar />
      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-bold text-gray-900">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden lg:flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/20 w-52 transition-all"
              />
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold uppercase shadow">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-900 leading-none">{user?.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{user?.role === 'admin' ? 'Administrateur' : 'Auteur'}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
