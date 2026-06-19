import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { CheckCircle, User, Mail, Lock, Loader2 } from 'lucide-react';

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
      const payload: Record<string, string> = {
        name:  data.name,
        email: data.email,
      };
      if (data.password) {
        payload.password              = data.password;
        payload.password_confirmation = data.password_confirmation ?? '';
      }
      await userService.updateProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Une erreur est survenue.';
      setError('root', { message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6 animate-in fade-in duration-300">

      {/* Badge rôle */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold uppercase">
          {user?.name?.[0] || 'U'}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
          <p className="text-xs text-blue-600 font-medium capitalize">
            {user?.role === 'admin' ? '🔑 Administrateur' : '✏️ Auteur'}
          </p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Profil mis à jour avec succès.
        </div>
      )}

      {errors.root && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            Informations personnelles
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nom complet</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
              {...register('name', { required: 'Nom requis' })}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
              <Mail className="w-3 h-3" /> Adresse email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
              {...register('email', { required: 'Email requis' })}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" />
            Changer le mot de passe
            <span className="text-xs font-normal text-gray-400">(optionnel)</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="Laisser vide pour ne pas changer"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
              {...register('password', { minLength: { value: 8, message: '8 caractères minimum' } })}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
              {...register('password_confirmation', {
                validate: v => !password || v === password || 'Les mots de passe ne correspondent pas',
              })}
            />
            {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-60 active:scale-[0.98]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};
