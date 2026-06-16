import { motion } from 'motion/react';
import { Settings, TrendingUp, Image as ImageIcon } from 'lucide-react';

export const Analytics = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
        <TrendingUp className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-on-surface mb-4">Analytics</h1>
      <p className="text-on-surface-variant max-w-md">
        Le tableau de bord analytique avancé sera bientôt disponible. Vous pourrez y suivre en détail les performances de vos publications.
      </p>
    </motion.div>
  );
};
