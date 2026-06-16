import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, TrendingUp, MessageSquare, Image as ImageIcon, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All Posts', path: '/admin/articles', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
    { name: 'Comments', path: '/admin/comments', icon: MessageSquare },
    { name: 'Media', path: '/admin/media', icon: ImageIcon },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface-container-low border-r border-outline-variant flex flex-col py-6 gap-2 z-50">
      <div className="px-4 mb-10">
        <h1 className="text-xl font-bold text-on-surface">Editorial Hub</h1>
        <p className="text-sm text-on-surface-variant opacity-70">Premium Plan</p>
      </div>

      <div className="px-4 mb-4">
        <Link 
          to="/admin/articles/create"
          className="w-full bg-primary text-on-primary py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Article
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200 text-sm",
                isActive 
                  ? "bg-primary-fixed/30 text-primary font-semibold" 
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto pt-6 border-t border-outline-variant/30 flex flex-col gap-2">
        <div className="flex items-center gap-3 p-3 mb-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-primary-container font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-on-surface-variant truncate">{user?.email || 'admin@blogflow.pro'}</p>
          </div>
        </div>

        <Link to="/help" className="flex items-center gap-4 text-on-surface-variant px-4 py-2 hover:bg-surface-container-high transition-all duration-200 rounded-lg text-sm">
          <HelpCircle className="w-5 h-5" />
          <span>Help Center</span>
        </Link>
        <button onClick={logout} className="flex flex-row w-full items-center gap-4 text-on-surface-variant px-4 py-2 hover:bg-surface-container-high transition-all duration-200 rounded-lg text-sm">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
