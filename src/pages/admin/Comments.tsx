import { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { api, commentService, type Comment } from '../../services/api';

export const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    // L'API ne fournit pas d'endpoint GET /comments dédié,
    // on récupère les commentaires via les articles
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // On récupère tous les articles et on agrège leurs commentaires
      const { data: articlesData } = await api.get('/articles?per_page=100');
      const articles = articlesData.data || [];

      const allComments: (Comment & { article_title?: string })[] = [];
      // Pour chaque article, charger ses commentaires via le détail
      await Promise.all(
        articles.map(async (article: any) => {
          try {
            const { data } = await api.get(`/articles/${article.id}`);
            const articleComments = (data.comments || []).map((c: Comment) => ({
              ...c,
              article_title: data.title,
            }));
            allComments.push(...articleComments);
          } catch {
            // Ignore les erreurs individuelles
          }
        })
      );

      // Trier par date décroissante
      allComments.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setComments(allComments);
    } catch (err) {
      console.error('Erreur chargement commentaires:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    setDeleting(id);
    try {
      await commentService.delete(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Impossible de supprimer ce commentaire.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Gestion des Commentaires</h1>
        <p className="text-on-surface-variant text-sm mt-1">Modérez les interactions des visiteurs.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant font-medium border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 w-[220px]">Visiteur</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4 whitespace-nowrap hidden md:table-cell">Article associé</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-on-surface">
                {comments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                      Aucun commentaire pour le moment.
                    </td>
                  </tr>
                )}
                {comments.map((comment: any) => (
                  <tr key={comment.id} className="hover:bg-surface-container-low transition-colors align-top">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-on-surface">{comment.visitor_name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{comment.visitor_email}</p>
                      <p className="text-xs text-on-surface-variant mt-2 opacity-70">
                        {formatDate(comment.created_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant leading-relaxed max-w-[400px]">
                      {comment.message}
                    </td>
                    <td className="px-6 py-4 text-primary font-medium text-xs underline underline-offset-2 cursor-pointer truncate max-w-[200px] hidden md:table-cell">
                      {comment.article_title || `Article #${comment.article_id}`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deleting === comment.id}
                        className="p-2 text-outline hover:text-error hover:bg-error-container/20 rounded-md transition-colors disabled:opacity-50"
                      >
                        {deleting === comment.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
