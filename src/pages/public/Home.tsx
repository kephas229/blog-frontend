import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { articleService, type Article } from '../../services/api';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const estimateReadTime = (content: string) => {
  const words = content?.split(/\s+/).length || 0;
  return `${Math.max(1, Math.round(words / 200))} min`;
};

export const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [categories, setCategories] = useState<string[]>(['Tout']);

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const fetchArticles = async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const { data } = await articleService.getAll(pageNum);
      const fetched = data.data;

      // Extraire les catégories uniques
      const cats = Array.from(
        new Set(fetched.map((a) => a.category?.name).filter(Boolean))
      ) as string[];
      setCategories(['Tout', ...cats]);

      setArticles((prev) => (reset || pageNum === 1 ? fetched : [...prev, ...fetched]));
      setHasMore(data.current_page < data.last_page);
      setPage(data.current_page);
    } catch (err) {
      console.error('Erreur chargement articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchArticles(page + 1);
  };

  const filteredArticles =
    activeCategory === 'Tout'
      ? articles
      : articles.filter((a) => a.category?.name === activeCategory);

  const [featured, ...rest] = filteredArticles;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-surface-container-lowest"
    >
      {/* Catégories */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/30 pt-6 sticky top-16 z-30">
        <div className="max-w-container mx-auto px-6 overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-10 text-[15px] font-semibold text-on-surface whitespace-nowrap">
            {categories.map((cat, idx) => (
              <li
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer pb-4 transition-colors relative ${
                  activeCategory === cat ? 'text-primary' : 'text-on-surface hover:text-primary'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-md"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 py-16">
        {/* Skeleton chargement initial */}
        {loading && articles.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="w-full aspect-[16/10] bg-surface-container-high rounded-2xl" />
                <div className="h-4 bg-surface-container-high rounded w-1/3" />
                <div className="h-6 bg-surface-container-high rounded w-full" />
                <div className="h-4 bg-surface-container-high rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Article featured */}
        {featured && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-8 lg:gap-16 mb-24 items-center"
          >
            <Link
              to={`/article/${featured.id}`}
              className="w-full md:w-[60%] relative group overflow-hidden rounded-2xl"
            >
              {featured.image ? (
                <img
                  src={featured.image}
                  className="w-full h-auto aspect-[4/3] sm:aspect-[16/10] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  alt={featured.title}
                />
              ) : (
                <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-surface-container-high rounded-2xl flex items-center justify-center text-on-surface-variant text-sm">
                  Aucune image
                </div>
              )}
            </Link>
            <div className="w-full md:w-[40%] flex flex-col justify-center">
              <Link to={`/article/${featured.id}`} className="group block">
                <span className="text-on-surface-variant hover:text-primary font-bold text-xs uppercase tracking-widest mb-4 block transition-colors">
                  {featured.category?.name || 'Non classé'}
                </span>
                <h2 className="text-3xl lg:text-4xl lg:leading-[1.2] font-black text-on-surface group-hover:text-primary transition-colors mb-6">
                  {featured.title}
                </h2>
              </Link>
              <p className="text-on-surface-variant mb-8 text-lg leading-relaxed">
                {featured.short_description}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high border-[1.5px] border-outline-variant/30 shadow-sm flex items-center justify-center font-bold text-on-surface-variant text-sm uppercase">
                  {featured.user?.name?.[0] || '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{featured.user?.name || 'Auteur inconnu'}</p>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {formatDate(featured.created_at)} · {estimateReadTime(featured.content)} de lecture
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grille articles */}
        {rest.length > 0 && (
          <>
            <div className="mb-12">
              <h3 className="text-2xl font-black text-on-surface relative inline-block">
                Derniers articles
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full" />
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {rest.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex flex-col h-full"
                >
                  <Link
                    to={`/article/${article.id}`}
                    className="group block mb-6 overflow-hidden rounded-2xl"
                  >
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
          </>
        )}

        {/* Message si aucun article */}
        {!loading && filteredArticles.length === 0 && (
          <div className="py-20 text-center text-on-surface-variant">
            Aucun article disponible pour le moment.
          </div>
        )}

        {/* Bouton Voir plus */}
        {hasMore && !loading && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={loadMore}
              className="px-8 py-3 rounded-full border border-outline-variant hover:border-primary hover:text-primary font-bold text-sm transition-all text-on-surface bg-surface-container-lowest shadow-sm hover:shadow-md"
            >
              Voir plus d'articles
            </button>
          </div>
        )}

        {loading && articles.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
