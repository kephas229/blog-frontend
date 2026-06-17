import { useEffect, useState } from 'react';
import { FileText, MessageSquare, Users, ArrowUpRight, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardService, type DashboardStats } from '../../services/api';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Articles publiés',
      value: stats?.stats.total_articles ?? '—',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      ring: 'ring-blue-100',
      trend: '+12%',
    },
    {
      label: 'Commentaires',
      value: stats?.stats.total_comments ?? '—',
      icon: MessageSquare,
      color: 'bg-violet-50 text-violet-600',
      ring: 'ring-violet-100',
      trend: '+8%',
    },
    {
      label: 'Utilisateurs',
      value: stats?.stats.total_users ?? '—',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
      ring: 'ring-emerald-100',
      trend: '+3%',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bonjour 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Voici un aperçu de votre plateforme aujourd'hui.</p>
        </div>
        <Link
          to="/admin/articles/create"
          className="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95"
        >
          + Nouvel article
        </Link>
      </div>

      {/* Cartes de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-4 ${card.color} ${card.ring}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {card.trend}
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {loading ? (
                <span className="inline-block w-10 h-8 bg-gray-100 rounded animate-pulse" />
              ) : card.value}
            </p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Derniers articles */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-900">Derniers articles publiés</h3>
          <Link
            to="/admin/articles"
            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            Voir tout <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {stats?.latest_articles?.length ? stats.latest_articles.map((article) => (
              <li key={article.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                {/* Image miniature */}
                <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                  {article.image ? (
                    <img src={article.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/article/${article.id}`}
                    className="text-sm font-semibold text-gray-900 truncate block group-hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(article.created_at)}
                    {article.category && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-semibold">
                        {article.category.name}
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                  Publié
                </span>
              </li>
            )) : (
              <li className="px-6 py-8 text-center text-gray-400 text-sm">Aucun article pour le moment.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
