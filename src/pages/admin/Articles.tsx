import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { articleService, type Article, type PaginatedResponse } from '../../services/api';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export const Articles = () => {
  const [pagination, setPagination] = useState<PaginatedResponse<Article> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const fetchArticles = useCallback(async (pageNum: number, searchStr?: string) => {
    setLoading(true);
    try {
      const { data } = await articleService.getAll(pageNum, searchStr);
      setPagination(data);
    } catch (err) {
      console.error('Erreur chargement articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles(page, search || undefined);
  }, [page, search, fetchArticles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article ? Cette action est irréversible.')) return;
    setDeleting(id);
    try {
      await articleService.delete(id);
      fetchArticles(page, search || undefined);
    } catch (err) {
      alert("Impossible de supprimer l'article.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Tous les Articles</h1>
          <p className="text-on-surface-variant text-sm mt-1">Gérez vos publications, brouillons et archives.</p>
        </div>
        <Link to="/admin/articles/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Créer un article
          </Button>
        </Link>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {/* Barre de recherche */}
        <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low/50">
          <form onSubmit={handleSearch} className="relative w-full md:w-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher par titre..."
                className="pl-9 pr-4 py-2 border border-outline-variant rounded-lg text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface-container-lowest"
              />
            </div>
            <Button type="submit" size="sm" variant="outline">Chercher</Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-container-low text-on-surface-variant font-medium border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4">Titre de l'article</th>
                <th className="px-6 py-4 hidden md:table-cell">Auteur</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && pagination?.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                    Aucun article trouvé.
                  </td>
                </tr>
              )}
              {!loading &&
                pagination?.data.map((article) => (
                  <tr key={article.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 font-semibold text-on-surface truncate max-w-[200px] md:max-w-[300px]">
                      <Link to={`/article/${article.id}`} className="hover:text-primary transition-colors">
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-on-surface-variant">
                      {article.user?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-surface-container-high px-2 py-1 rounded text-xs font-semibold text-on-surface-variant">
                        {article.category?.name || 'Non classé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatDate(article.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/article/${article.id}`}
                          className="p-2 text-outline hover:text-primary hover:bg-primary-fixed/20 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleting === article.id}
                          className="p-2 text-outline hover:text-error hover:bg-error-container/20 rounded-md transition-colors disabled:opacity-50"
                        >
                          {deleting === article.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="p-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant bg-surface-container-low/50">
            <span>
              Affichage de {(pagination.current_page - 1) * pagination.per_page + 1} à{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur{' '}
              {pagination.total} articles
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </Button>
              <span className="text-xs font-semibold text-on-surface px-2">
                {pagination.current_page} / {pagination.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
