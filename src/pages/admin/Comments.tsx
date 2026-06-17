import { useEffect, useState } from 'react';
import { Trash2, Loader2, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, commentService, type Comment } from '../../services/api';

type EnrichedComment = Comment & { article_title?: string; article_id: number };

export const Comments = () => {
  const [comments, setComments] = useState<EnrichedComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => { fetchComments(); }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data: articlesData } = await api.get('/articles?per_page=100');
      const articles = articlesData.data || [];
      const allComments: EnrichedComment[] = [];

      await Promise.all(
        articles.map(async (article: any) => {
          try {
            const { data } = await api.get(`/articles/${article.id}`);
            (data.comments || []).forEach((c: Comment) => {
              allComments.push({ ...c, article_title: data.title, article_id: article.id });
            });
          } catch { /* ignore */ }
        })
      );

      allComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setComments(allComments);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    setDeleting(id);
    try {
      await commentService.delete(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('Impossible de supprimer ce commentaire.');
    } finally {
      setDeleting(null);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <p className="text-gray-500 text-sm">{comments.length} commentaire{comments.length > 1 ? 's' : ''} au total</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center gap-3">
          <MessageSquare className="w-10 h-10 text-gray-200" />
          <p className="text-gray-400 text-sm">Aucun commentaire pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
                {comment.visitor_name?.[0] || '?'}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{comment.visitor_name}</p>
                    <p className="text-xs text-gray-400">{comment.visitor_email} · {timeAgo(comment.created_at)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleting === comment.id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-40"
                  >
                    {deleting === comment.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-sm text-gray-700 mt-2 leading-relaxed">{comment.message}</p>

                {/* Article associé */}
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <Link
                    to={`/article/${comment.article_id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {comment.article_title || `Article #${comment.article_id}`}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
