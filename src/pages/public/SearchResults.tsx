import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    articleService
      .getAll(1, query)
      .then(({ data }) => {
        setArticles(data.data);
        setTotal(data.total);
      })
      .catch(() => {
        setArticles([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-surface-container-lowest min-h-[80vh] py-16"
    >
      <div className="max-w-container mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight mb-4">
            Résultats de recherche
          </h1>
          {!loading && (
            <p className="text-lg text-on-surface-variant">
              {total} {total > 1 ? 'résultats trouvés' : 'résultat trouvé'} pour &quot;{query}&quot;
            </p>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    <span className="text-on-surface-variant hover:text-primary font-bold text-xs uppercase tracking-widest mb-3 transition-colors">
                      {article.category?.name || 'Non classé'}
                    </span>
                    <h4 className="text-xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors leading-[1.3] block">
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
          </div>
        )}

        {!loading && articles.length === 0 && query && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold text-on-surface mb-3">Aucun résultat</h2>
            <p className="text-on-surface-variant">
              Nous n'avons trouvé aucun article correspondant à &quot;{query}&quot;. Essayez d'autres mots-clés.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
