import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Loader2, X, Bold, Italic, Heading1, Heading2 } from 'lucide-react';
import { articleService, api } from '../../services/api';

interface Category { id: number; name: string; }

export const CreateArticle = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/articles?per_page=100').then(({ data }) => {
      const cats = new Map<number, string>();
      (data.data || []).forEach((a: any) => {
        if (a.category?.id) cats.set(a.category.id, a.category.name);
      });
      setCategories(Array.from(cats, ([id, name]) => ({ id, name })));
    }).catch(() => {});
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError('');
    if (!title.trim() || !shortDescription.trim() || !content.trim() || !categoryId) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('short_description', shortDescription);
      fd.append('content', content);
      fd.append('category_id', categoryId);
      if (imageFile) fd.append('image', imageFile);
      await articleService.create(fd);
      navigate('/admin/articles');
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      setError(apiErrors ? Object.values(apiErrors).flat().join(' ') : err?.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const insertMarkdown = (syntax: string) => setContent(c => c + syntax);

  return (
    <div className="max-w-4xl animate-in fade-in duration-300">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-60 active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publier l'article
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-5">

          {/* Titre */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'article..."
              className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-300 outline-none border-none bg-transparent"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Description courte *</label>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Un résumé accrocheur affiché sur les cartes d'articles..."
              className="w-full text-sm text-gray-700 placeholder:text-gray-300 outline-none border-none bg-transparent resize-none leading-relaxed"
            />
          </div>

          {/* Éditeur de contenu */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Barre d'outils */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">Contenu</span>
              {[
                { icon: Bold,     label: 'Gras',       syntax: '**texte**' },
                { icon: Italic,   label: 'Italique',   syntax: '*texte*' },
                { icon: Heading1, label: 'Titre H1',   syntax: '\n# Titre\n' },
                { icon: Heading2, label: 'Titre H2',   syntax: '\n## Titre\n' },
              ].map(({ icon: Icon, label, syntax }) => (
                <button
                  key={label}
                  type="button"
                  title={label}
                  onClick={() => insertMarkdown(syntax)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez votre article ici..."
              className="w-full min-h-[400px] p-6 text-sm text-gray-700 placeholder:text-gray-300 outline-none border-none bg-transparent resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-5">

          {/* Catégorie */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Catégorie *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full py-2.5 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all appearance-none"
            >
              <option value="">Choisir une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Image de couverture */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Image de couverture</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Aperçu" className="w-full aspect-video object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary/40 hover:text-primary hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold">Cliquer pour uploader</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">PNG, JPG, WEBP — max 2MB</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
