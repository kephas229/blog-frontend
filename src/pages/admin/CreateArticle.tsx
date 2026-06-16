import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { articleService, api } from '../../services/api';

interface Category {
  id: number;
  name: string;
}

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

  // Charger les catégories depuis les articles existants
  useEffect(() => {
    api
      .get('/articles?per_page=100')
      .then(({ data }) => {
        const cats = new Map<number, string>();
        (data.data || []).forEach((a: any) => {
          if (a.category?.id) {
            cats.set(a.category.id, a.category.name);
          }
        });
        setCategories(Array.from(cats, ([id, name]) => ({ id, name })));
      })
      .catch(() => {});
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('short_description', shortDescription);
    fd.append('content', content);
    fd.append('category_id', categoryId);
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const handleSubmit = async (status: 'publish' | 'draft') => {
    setError('');
    if (!title.trim() || !shortDescription.trim() || !content.trim() || !categoryId) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await articleService.create(buildFormData());
      navigate('/admin/articles');
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        setError(Object.values(apiErrors).flat().join(' '));
      } else {
        setError(err?.response?.data?.message || "Erreur lors de la création de l'article.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1000px] animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Créer un article</h1>
            <p className="text-on-surface-variant text-sm mt-1">Rédigez et publiez votre contenu.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 hidden sm:flex"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
          >
            Brouillon
          </Button>
          <Button className="gap-2" onClick={() => handleSubmit('publish')} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publier
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-6">
            <Input
              label="Titre de l'article"
              placeholder="Ex. Les meilleures pratiques React..."
              className="text-lg font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="space-y-2">
              <label className="font-label-md text-on-surface-variant ml-1 block">Description courte</label>
              <textarea
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant py-3 px-4 text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                placeholder="Un court résumé affiché dans les cartes d'articles..."
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-on-surface-variant ml-1 block">Contenu principal</label>
              <div className="border border-outline-variant rounded-lg overflow-hidden flex flex-col h-[400px]">
                <div className="bg-surface-container p-2 flex gap-2 border-b border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setContent((c) => c + '**texte en gras**')}
                    className="p-1 hover:bg-surface-container-high rounded"
                  >
                    <span className="font-bold px-2">B</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent((c) => c + '*texte italique*')}
                    className="p-1 hover:bg-surface-container-high rounded"
                  >
                    <span className="italic px-2">I</span>
                  </button>
                  <div className="w-px bg-outline-variant mx-1" />
                  <button
                    type="button"
                    onClick={() => setContent((c) => c + '\n# Titre\n')}
                    className="p-1 hover:bg-surface-container-high rounded"
                  >
                    <span className="px-2 font-mono text-sm">H1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent((c) => c + '\n## Sous-titre\n')}
                    className="p-1 hover:bg-surface-container-high rounded"
                  >
                    <span className="px-2 font-mono text-sm">H2</span>
                  </button>
                </div>
                <textarea
                  className="w-full flex-1 p-4 bg-surface-container-lowest resize-none outline-none text-sm leading-relaxed"
                  placeholder="Commencez à écrire ici..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Image de couverture */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <h3 className="font-semibold text-on-surface mb-4">Image de couverture</h3>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full aspect-[16/10] object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-error text-white text-xs px-2 py-1 rounded-md"
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low transition-colors group w-full"
              >
                <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-on-surface-variant" />
                </div>
                <p className="text-sm font-semibold text-on-surface mb-1">Glissez-déposez votre image</p>
                <p className="text-xs text-on-surface-variant">PNG, JPG, WEBP (Max 2MB)</p>
              </button>
            )}
          </div>

          {/* Paramètres */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
            <h3 className="font-semibold text-on-surface">Paramètres</h3>
            <div className="space-y-2">
              <label className="font-label-sm text-on-surface-variant ml-1 block">Catégorie</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-outline-variant py-2.5 px-4 text-sm bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
