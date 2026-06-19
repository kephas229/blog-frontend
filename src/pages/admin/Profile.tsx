import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { CheckCircle, User, Mail, Lock, Loader2, Shield } from 'lucide-react';

interface ProfileForm {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

export const Profile = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<ProfileForm>({
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  const password = watch('password');

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    setSuccess(false);
    try {
      const payload: Record<string, string> = { name: data.name, email: data.email };
      if (data.password) {
        payload.password              = data.password;
        payload.password_confirmation = data.password_confirmation ?? '';
      }
      await userService.updateProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError('root', { message: err?.response?.data?.message || 'Une erreur est survenue.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">

      {/* Carte identité */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-black uppercase shadow-lg shadow-primary/20 shrink-0">
          {user?.name?.[0] || 'U'}
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
          <span className={`inline-flex items-center gap-1.5 mt-2 text-xs font-bold px-3 py-1 rounded-full ${
            user?.role === 'admin'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            <Shield className="w-3 h-3" />
            {user?.role === 'admin' ? 'Administrateur' : 'Auteur'}
          </span>
        </div>
      </div>

      {/* Alertes */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl px-5 py-4">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">Profil mis à jour avec succès.</span>
        </div>
      )}
      {errors.root && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Grille 2 colonnes sur desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Informations personnelles */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Informations personnelles</h3>
                <p className="text-xs text-gray-400 mt-0.5">Nom et adresse email</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500">Nom complet</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
                {...register('name', { required: 'Nom requis' })}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                Adresse email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
                {...register('email', { required: 'Email requis' })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Mot de passe */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Sécurité</h3>
                <p className="text-xs text-gray-400 mt-0.5">Laisser vide pour ne pas changer</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500">Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="8 caractères minimum"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
                {...register('password', { minLength: { value: 8, message: '8 caractères minimum' } })}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500">Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all"
                {...register('password_confirmation', {
                  validate: v => !password || v === password || 'Les mots de passe ne correspondent pas',
                })}
              />
              {errors.password_confirmation && (
                <p className="text-xs text-red-500 mt-1">{errors.password_confirmation.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bouton enregistrer */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-60 active:scale-[0.98]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};
