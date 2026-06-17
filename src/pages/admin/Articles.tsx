import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    } catch {
      /* ignore */
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
    } catch {
      alert("Impossible de supprimer l'article.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagination ? `${pagination.total} article${pagination.total > 1 ? 's' : ''} au total` : ''}
          </p>
        </div>
        <Link
          to="/admin/articles/create"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Créer un article
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Barre de recherche */}
        <div className="px-5 py-4 border-b border-gray-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher par titre..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
            >
              Chercher
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Article</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Auteur</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && pagination?.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Aucun article trouvé.</p>
                  </td>
                </tr>
              )}
              {!loading && pagination?.data.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                        {article.image ? (
                          <img src={article.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/article/${article.id}`}
                        className="font-semibold text-gray-900 hover:text-primary transition-colors truncate max-w-[240px] block"
                      >
                        {article.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 hidden md:table-cell text-sm">
                    {article.user?.name || '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      {article.category?.name || 'Non classé'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{formatDate(article.created_at)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/article/${article.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deleting === article.id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        {deleting === article.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
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
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              {(pagination.current_page - 1) * pagination.per_page + 1}–
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur {pagination.total}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={pagination.current_page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-gray-700 px-2">
                {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
