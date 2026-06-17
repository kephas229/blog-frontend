import { TrendingUp, BarChart2, Users, Eye, ArrowUpRight } from 'lucide-react';

const mockData = [
  { month: 'Jan', visits: 1200 },
  { month: 'Fév', visits: 1850 },
  { month: 'Mar', visits: 1600 },
  { month: 'Avr', visits: 2200 },
  { month: 'Mai', visits: 1900 },
  { month: 'Juin', visits: 2800 },
];

const maxVisits = Math.max(...mockData.map(d => d.visits));

export const Analytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Cartes métriques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Vues ce mois',    value: '2 841',  delta: '+18%', icon: Eye,      color: 'bg-blue-50 text-blue-600',    ring: 'ring-blue-100' },
          { label: 'Visiteurs uniques', value: '1 203', delta: '+12%', icon: Users,    color: 'bg-violet-50 text-violet-600', ring: 'ring-violet-100' },
          { label: 'Taux de rebond',  value: '42%',    delta: '-5%',  icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-100' },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-4 ${card.color} ${card.ring}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {card.delta}
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Graphique de visites */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-900">Trafic mensuel</h3>
            <p className="text-xs text-gray-400 mt-0.5">Visites sur les 6 derniers mois</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <BarChart2 className="w-4 h-4" />
            Simulation
          </div>
        </div>

        {/* Barres */}
        <div className="flex items-end gap-3 h-48">
          {mockData.map((d, i) => {
            const height = (d.visits / maxVisits) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-gray-400">{d.visits.toLocaleString()}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-blue-400 transition-all duration-500 hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400 font-medium">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-900">Analytiques avancées bientôt disponibles</p>
          <p className="text-xs text-blue-600 mt-0.5">Connectez Google Analytics ou Plausible pour obtenir des données réelles sur votre audience.</p>
        </div>
      </div>
    </div>
  );
};
