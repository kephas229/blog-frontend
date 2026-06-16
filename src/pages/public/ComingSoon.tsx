import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const ComingSoon = ({ title, description }: { title: string; description: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-8 shadow-sm">
        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-6 tracking-tight">
        {title}
      </h1>
      
      <p className="text-on-surface-variant text-lg max-w-[500px] mb-10 leading-relaxed">
        {description}
        <br/><br/>
        <span className="text-sm opacity-80 italic">Cette page est en cours de construction.</span>
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
         <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
               Retour à l'accueil
            </Button>
         </Link>
         <Button className="w-full sm:w-auto gap-2">
            Me prévenir
            <span className="material-symbols-outlined text-sm">notifications</span>
         </Button>
      </div>
    </motion.div>
  );
};
