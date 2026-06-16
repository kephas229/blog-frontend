import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Search, Bell } from 'lucide-react';

export const AdminLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-full bg-surface overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-y-auto bg-surface-container-lowest">
        <header className="sticky top-0 z-40 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-on-surface hidden">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4 ml-auto">
             <div className="relative group hidden md:flex">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search articles..." 
                 className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all outline-none"
               />
             </div>
             <button className="bg-surface-container-low p-2 rounded-full hover:bg-surface-container-high transition-colors">
               <Bell className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="p-8 max-w-container mx-auto w-full flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
