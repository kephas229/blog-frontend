import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { articleService, commentService, type Article, type Comment } from '../../services/api';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const timeAgo = (dateStr: string) => {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
};

interface CommentFormData {
  visitor_name: string;
  visitor_email: string;
  message: string;
}

export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors }, setError: setFormError } =
    useForm<CommentFormData>();

  useEffect(() => {
    if (!id) return;
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await articleService.getOne(id!);
      setArticle(data);
      // Les commentaires sont inclus si la relation est chargée, sinon tableau vide
      setComments((data as any).comments || []);
    } catch (err: any) {
      setError("Article introuvable ou erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  const onCommentSubmit = async (data: CommentFormData) => {
    if (!article) return;
    setCommentLoading(true);
    setCommentSuccess(false);
    try {
      const { data: res } = await commentService.create({
        ...data,
        article_id: article.id,
      });
      setComments((prev) => [...prev, res.comment]);
      reset();
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Impossible de publier le commentaire.';
      setFormError('root', { message: msg });
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-[720px] mx-auto px-6 py-24 text-center">
        <p className="text-on-surface-variant text-lg mb-6">{error || 'Article introuvable.'}</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mx-auto text-primary font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <article className="w-full max-w-[780px] mx-auto px-6 py-16">
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-10 text-sm font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <div className="mb-12">
        {article.category && (
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">
            {article.category.name}
          </span>
        )}
        <h1 className="text-4xl font-bold text-on-surface mb-6 leading-tight">{article.title}</h1>
        <p className="text-xl text-on-surface-variant mb-4">{article.short_description}</p>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-bold text-on-surface-variant text-sm uppercase">
            {article.user?.name?.[0] || '?'}
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">{article.user?.name || 'Auteur inconnu'}</p>
            <p className="text-xs text-on-surface-variant">{formatDate(article.created_at)}</p>
          </div>
        </div>

        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[400px] object-cover rounded-2xl shadow-soft"
          />
        )}
      </div>

      {/* Contenu */}
      <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>

      <hr className="my-16 border-outline-variant" />

      {/* Section Commentaires */}
      <section id="comments">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <MessageSquare className="text-primary w-6 h-6" />
          Commentaires ({comments.length})
        </h3>

        {comments.length > 0 ? (
          <div className="space-y-6 mb-16">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm transition-transform duration-200 hover:translate-x-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-white font-bold text-sm uppercase">
                      {comment.visitor_name?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{comment.visitor_name}</p>
                      <p className="text-xs text-on-surface-variant">{timeAgo(comment.created_at)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">{comment.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant text-sm mb-12">Soyez le premier à commenter.</p>
        )}

        {/* Formulaire commentaire — accessible à tous les visiteurs */}
        <div className="bg-surface-container-high p-8 rounded-xl">
          <h4 className="text-lg font-bold mb-6">Laissez un commentaire</h4>

          {commentSuccess && (
            <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mb-4">
              Commentaire publié avec succès !
            </p>
          )}
          {errors.root && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              {errors.root.message}
            </p>
          )}

          <form onSubmit={handleSubmit(onCommentSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Nom complet"
                className="bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                {...register('visitor_name', { required: true })}
              />
              {errors.visitor_name && <span className="text-xs text-red-500">Champ requis</span>}
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="email"
                placeholder="Adresse email"
                className="bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                {...register('visitor_email', { required: true })}
              />
              {errors.visitor_email && <span className="text-xs text-red-500">Champ requis</span>}
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <textarea
                placeholder="Votre commentaire..."
                rows={4}
                className="bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm resize-none"
                {...register('message', { required: true })}
              />
              {errors.message && <span className="text-xs text-red-500">Champ requis</span>}
            </div>
            <button
              type="submit"
              disabled={commentLoading}
              className="md:col-span-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            >
              {commentLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Publier le commentaire
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </article>
  );
};
