import { motion } from 'motion/react';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
        <SettingsIcon className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-on-surface mb-4">Paramètres</h1>
      <p className="text-on-surface-variant max-w-md">
        Les paramètres du compte et les options de configuration de la plateforme seront bientôt disponibles.
      </p>
    </motion.div>
  );
};
