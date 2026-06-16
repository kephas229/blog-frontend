import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Edit } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Identifiants incorrects. Vérifiez vos informations.';
      setError('root', { message });
    }
  };

  return (
    <main className="w-full max-w-[440px] px-4 py-10">
      <div className="bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded-xl p-10 flex flex-col items-center shadow-soft">

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl mb-4 shadow-lg">
            <Edit className="w-8 h-8 text-on-primary" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">BlogFlow Pro</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-medium">Contrôlez votre contenu avec précision</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <Input
            label="Adresse Email"
            icon={<Mail className="w-5 h-5" />}
            placeholder="nom@exemple.fr"
            type="email"
            {...register('email', { required: 'Email requis' })}
            error={errors.email?.message}
          />

          <div className="space-y-1">
            <div className="flex justify-end px-1">
              <Link to="#" className="text-xs font-semibold text-primary hover:underline">Oublié ?</Link>
            </div>
            <div className="relative">
              <Input
                label="Mot de passe"
                icon={<Lock className="w-5 h-5" />}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Mot de passe requis' })}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors mt-3"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Erreur globale (identifiants incorrects) */}
          {errors.root && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {errors.root.message}
            </p>
          )}

          <div className="flex items-center gap-2 px-1">
            <input type="checkbox" id="remember" className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary" />
            <label htmlFor="remember" className="text-sm font-semibold text-on-surface-variant cursor-pointer">Se souvenir de moi</label>
          </div>

          <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>
            Se connecter
          </Button>
        </form>

        <div className="mt-10 pt-6 border-t border-outline-variant w-full text-center">
          <p className="text-on-surface-variant text-sm">
            Pas de compte ?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline underline-offset-4">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>

      <footer className="mt-8 flex justify-center gap-6 text-xs font-semibold text-on-surface-variant/60">
        <Link to="#" className="hover:text-primary transition-colors">Aide</Link>
        <Link to="#" className="hover:text-primary transition-colors">Confidentialité</Link>
        <Link to="#" className="hover:text-primary transition-colors">Conditions</Link>
      </footer>
    </main>
  );
};
