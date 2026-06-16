import { motion } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';

export const Media = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
        <ImageIcon className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-on-surface mb-4">Bibliothèque Multimédia</h1>
      <p className="text-on-surface-variant max-w-md">
        Votre gestionnaire de médias centralisé est en construction. Gérez vos images, vidéos et documents au même endroit.
      </p>
    </motion.div>
  );
};
