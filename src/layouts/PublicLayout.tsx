import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      {/* pt-16 compense la navbar fixe */}
      <main className="flex-1 pt-16 w-full">
        <Outlet />
      </main>

      <footer className="w-full bg-surface-container-highest border-t border-outline-variant py-8 mt-auto">
        <div className="w-full max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xl font-bold text-on-surface">BlogFlow</span>
          <p className="text-sm text-on-surface-variant opacity-70">
            © {new Date().getFullYear()} BlogFlow. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};
