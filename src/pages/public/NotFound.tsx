import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-500">
      <h1 className="text-9xl font-black text-outline-variant/20 tracking-tighter block">404</h1>
      <h2 className="text-3xl font-bold text-on-surface mt-4">Page non trouvée</h2>
      <p className="text-on-surface-variant mt-3 mb-8 max-w-[400px]">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/">
        <Button size="lg">Retour à l'accueil</Button>
      </Link>
    </div>
  );
};
