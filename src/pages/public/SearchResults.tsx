import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { articleService, type Article } from '../../services/api';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const estimateReadTime = (content: string) => {
  const words = content?.split(/\s+/).length || 0;
  return `${Math.max(1, Math.round(words / 200))} min`;
};

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setArticles([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    // Annule la requête précédente si elle est encore en cours
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);

    articleService
      .getAll(1, query)
      .then(({ data }) => {
        setArticles(data.data);
        setTotal(data.total);
      })
      .catch((err) => {
        if (err?.code !== 'ERR_CANCELED') {
          setArticles([]);
          setTotal(0);
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="w-full bg-surface-container-lowest min-h-[80vh] py-16">
      <div className="w-full max-w-[1280px] mx-auto px-6">

        {/* En-tête */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight mb-3">
            Résultats de recherche
          </h1>
          <div className="flex items-center gap-3 h-7">
            {loading ? (
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Recherche en cours pour <strong className="text-on-surface">«&nbsp;{query}&nbsp;»</strong>…</span>
              </div>
            ) : query ? (
              <p className="text-on-surface-variant text-base">
                <span className="font-bold text-on-surface">{total}</span>{' '}
                {total > 1 ? 'résultats trouvés' : 'résultat trouvé'} pour{' '}
                <strong className="text-on-surface">«&nbsp;{query}&nbsp;»</strong>
              </p>
            ) : null}
          </div>
        </div>

        {/* Grille résultats */}
        <AnimatePresence mode="wait">
          {!loading && articles.length > 0 && (
            <motion.div
              key={query}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Link to={`/article/${article.id}`} className="group block mb-6 overflow-hidden rounded-2xl">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full aspect-[16/10] bg-surface-container-high rounded-2xl flex items-center justify-center text-on-surface-variant text-sm">
                        Aucune image
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-col flex-1">
                    <Link to={`/article/${article.id}`} className="group block flex-1">
                      <span className="text-on-surface-variant hover:text-primary font-bold text-xs uppercase tracking-widest mb-3 block transition-colors">
                        {article.category?.name || 'Non classé'}
                      </span>
                      <h4 className="text-xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors leading-[1.3]">
                        {article.title}
                      </h4>
                      <p className="text-on-surface-variant text-base line-clamp-3 mb-6 leading-relaxed">
                        {article.short_description}
                      </p>
                    </Link>
                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-outline-variant/30">
                      <span className="text-xs font-bold text-on-surface">{article.user?.name || 'Inconnu'}</span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        {formatDate(article.created_at)} · {estimateReadTime(article.content)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Squelettes de chargement */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="w-full aspect-[16/10] bg-surface-container-high rounded-2xl" />
                <div className="h-3 bg-surface-container-high rounded w-1/4" />
                <div className="h-5 bg-surface-container-high rounded w-full" />
                <div className="h-4 bg-surface-container-high rounded w-3/4" />
                <div className="h-4 bg-surface-container-high rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && articles.length === 0 && query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-on-surface mb-3">Aucun résultat</h2>
            <p className="text-on-surface-variant">
              Aucun article correspondant à <strong>«&nbsp;{query}&nbsp;»</strong>.<br />
              Essayez d'autres mots-clés.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
