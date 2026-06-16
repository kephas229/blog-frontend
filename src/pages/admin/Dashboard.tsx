import { useEffect, useState } from 'react';
import { Users, FileText, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { dashboardService, type DashboardStats } from '../../services/api';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService
      .getStats()
      .then(({ data }) => setStats(data))
      .catch(() => setError('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-on-surface-variant">
        <p>{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Articles',
      value: stats?.stats.total_articles ?? 0,
      icon: FileText,
    },
    {
      label: 'Commentaires',
      value: stats?.stats.total_comments ?? 0,
      icon: MessageSquare,
    },
    {
      label: 'Utilisateurs',
      value: stats?.stats.total_users ?? 0,
      icon: Users,
    },
    {
      label: 'Taux de croissance',
      value: '—',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Tableau de bord</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Bonjour, voici un résumé des statistiques de votre plateforme.
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-on-primary-fixed-variant" />
                </div>
              </div>
              <div>
                <h4 className="text-on-surface-variant text-sm font-medium mb-1">{stat.label}</h4>
                <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Derniers articles */}
      <Card>
        <CardHeader>
          <CardTitle>Derniers Articles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stats?.latest_articles && stats.latest_articles.length > 0 ? (
            <ul className="divide-y divide-outline-variant">
              {stats.latest_articles.map((article) => (
                <li
                  key={article.id}
                  className="p-4 hover:bg-surface-container-high transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <Link
                      to={`/article/${article.id}`}
                      className="text-sm font-bold text-on-surface truncate block hover:text-primary transition-colors"
                    >
                      {article.title}
                    </Link>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Publié le {formatDate(article.created_at)}
                    </p>
                  </div>
                  <span className="text-xs bg-secondary-fixed text-on-secondary-fixed px-2 py-1 rounded-full font-semibold shrink-0">
                    Public
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-sm text-on-surface-variant">Aucun article pour le moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
