import { useEffect, useState } from 'react';
import { Loader2, Shield, Edit3, Trash2, UserCircle, Users as UsersIcon } from 'lucide-react';
import { userService, type UserWithStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    userService.getAll()
      .then(({ data }) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRoleToggle = async (u: UserWithStats) => {
    if (u.id === currentUser?.id) return;
    const newRole = u.role === 'admin' ? 'author' : 'admin';
    if (!confirm(`Changer le rôle de ${u.name} vers "${newRole === 'admin' ? 'Administrateur' : 'Auteur'}" ?`)) return;
    setUpdating(u.id);
    try {
      const { data } = await userService.updateRole(u.id, newRole);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: data.user.role } : x));
    } catch {
      alert("Impossible de modifier le rôle.");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (u: UserWithStats) => {
    if (u.id === currentUser?.id) return;
    if (!confirm(`Supprimer définitivement ${u.name} ? Ses articles resteront en ligne.`)) return;
    setDeleting(u.id);
    try {
      await userService.delete(u.id);
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch {
      alert("Impossible de supprimer cet utilisateur.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <p className="text-gray-500 text-sm">{users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Légende des rôles */}
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Administrateur — accès complet
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
            Auteur — gère ses propres articles
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.length === 0 && (
              <div className="py-16 flex flex-col items-center gap-3">
                <UsersIcon className="w-10 h-10 text-gray-200" />
                <p className="text-gray-400 text-sm">Aucun utilisateur.</p>
              </div>
            )}
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
                  {u.name?.[0] || '?'}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                    {u.id === currentUser?.id && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Vous</span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.role === 'admin'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {u.role === 'admin' ? '🔑 Admin' : '✏️ Auteur'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{u.email} · {u.articles_count ?? 0} article{(u.articles_count ?? 0) > 1 ? 's' : ''} · Inscrit le {formatDate(u.created_at)}</p>
                </div>

                {/* Actions (désactivées pour soi-même) */}
                {u.id !== currentUser?.id && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={updating === u.id}
                      title={u.role === 'admin' ? 'Rétrograder en auteur' : 'Promouvoir en admin'}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-40"
                    >
                      {updating === u.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Shield className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={deleting === u.id}
                      title="Supprimer cet utilisateur"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {deleting === u.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
