import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      
      <footer className="w-full bg-surface-container-highest border-t border-outline-variant py-8 mt-auto">
        <div className="max-w-container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xl font-bold text-on-surface">BlogFlow Pro</span>
          <p className="text-sm text-on-surface-variant opacity-70">© {new Date().getFullYear()} BlogFlow Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
