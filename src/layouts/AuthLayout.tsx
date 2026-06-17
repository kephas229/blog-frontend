import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex antialiased overflow-hidden">

      {/* ── Panneau gauche : fond visuel ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">

        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&auto=format&fit=crop')" }}
        />
        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70" />

        {/* Orbes animés */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[5%] w-72 h-72 bg-white/10 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-secondary/20 rounded-full blur-[100px]"
        />

        {/* Contenu du panneau gauche */}
        <div className="relative z-10">
          <Link to="/" className="text-2xl font-bold text-white">
            BlogFlow Pro
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed">
            "La création de contenu est un art qui mêle technique, créativité et stratégie."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              SM
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Sophie Marchand</p>
              <p className="text-white/60 text-xs">Rédactrice en chef, BlogFlow Pro</p>
            </div>
          </div>
        </div>

        {/* Statistiques en bas */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            { value: '22+', label: 'Articles publiés' },
            { value: '7', label: 'Catégories' },
            { value: '100%', label: 'Contenu FR' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-white text-2xl font-black">{stat.value}</p>
              <p className="text-white/60 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panneau droit : formulaire ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-surface-container-lowest relative overflow-hidden px-4 py-10">

        {/* Fond subtil côté formulaire */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(at 20% 20%, rgba(0, 88, 190, 0.06) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(107, 56, 212, 0.06) 0px, transparent 50%)',
          }}
        />

        {/* Orbe animé subtil */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative z-10 w-full max-w-[440px]">
          {/* Logo mobile (visible seulement < lg) */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              BlogFlow Pro
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
