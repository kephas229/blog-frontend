import { Image as ImageIcon, Upload, Film, FileText, HardDrive, Plus } from 'lucide-react';

const mockFiles = [
  { name: 'react-19-cover.jpg',       type: 'image', size: '245 KB', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop' },
  { name: 'laravel-api-banner.jpg',   type: 'image', size: '312 KB', url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&auto=format&fit=crop' },
  { name: 'tailwind-v4-hero.jpg',     type: 'image', size: '198 KB', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' },
  { name: 'seo-2025-thumbnail.jpg',   type: 'image', size: '278 KB', url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&auto=format&fit=crop' },
  { name: 'design-system-cover.jpg',  type: 'image', size: '189 KB', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&auto=format&fit=crop' },
  { name: 'startup-france-hero.jpg',  type: 'image', size: '356 KB', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop' },
];

const stats = [
  { label: 'Fichiers',      value: mockFiles.length.toString(), icon: FileText, color: 'bg-blue-50 text-blue-600' },
  { label: 'Images',        value: mockFiles.filter(f => f.type === 'image').length.toString(), icon: ImageIcon, color: 'bg-violet-50 text-violet-600' },
  { label: 'Vidéos',        value: '0',      icon: Film,      color: 'bg-orange-50 text-orange-600' },
  { label: 'Espace utilisé', value: '1.6 MB', icon: HardDrive, color: 'bg-emerald-50 text-emerald-600' },
];

export const Media = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Zone d'upload + grille */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-900">Bibliothèque multimédia</h3>
          <label className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-primary/90 transition-all active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            Uploader
            <input type="file" className="hidden" accept="image/*,video/*" multiple />
          </label>
        </div>

        {/* Grille fichiers */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Carte upload vide */}
          <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-blue-50/30 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary" />
            </div>
            <span className="text-xs text-gray-400 group-hover:text-primary font-medium transition-colors">Ajouter</span>
            <input type="file" className="hidden" accept="image/*,video/*" multiple />
          </label>

          {/* Fichiers */}
          {mockFiles.map((file, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 hover:border-primary/30 transition-all hover:shadow-md cursor-pointer">
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay au hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold truncate">{file.name}</p>
                <p className="text-white/60 text-[10px] mt-0.5">{file.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Cloudinary */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <HardDrive className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">Stockage Cloudinary actif</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Les images uploadées via le formulaire de création d'articles sont automatiquement stockées sur Cloudinary. Cette bibliothèque affiche un aperçu des médias associés à vos articles.
          </p>
        </div>
      </div>
    </div>
  );
};
