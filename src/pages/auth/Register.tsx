import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Edit } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm<RegisterFormData>();
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password, data.confirmPassword);
      navigate('/admin/articles');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        Object.values(err?.response?.data?.errors || {}).flat().join(' ') ||
        "Une erreur s'est produite lors de l'inscription.";
      setError('root', { message });
    }
  };

  return (
    <div className="w-full">
      <div className="bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded-2xl p-8 flex flex-col items-center shadow-soft">

        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-3 shadow-sm">
            <Edit className="w-6 h-6 text-on-primary" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Créer un compte</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Rejoignez BlogFlow</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          <Input
            label="Nom complet"
            icon={<User className="w-5 h-5" />}
            placeholder="Jean Dupont"
            {...register('name', { required: 'Nom requis' })}
            error={errors.name?.message}
          />

          <Input
            label="Adresse Email"
            icon={<Mail className="w-5 h-5" />}
            placeholder="nom@exemple.fr"
            type="email"
            {...register('email', { required: 'Email requis' })}
            error={errors.email?.message}
          />

          <Input
            label="Mot de passe"
            icon={<Lock className="w-5 h-5" />}
            placeholder="••••••••"
            type="password"
            {...register('password', { required: 'Mot de passe requis', minLength: { value: 8, message: '8 caractères minimum' } })}
            error={errors.password?.message}
          />

          <Input
            label="Confirmer le mot de passe"
            icon={<Lock className="w-5 h-5" />}
            placeholder="••••••••"
            type="password"
            {...register('confirmPassword', {
              required: 'Confirmation requise',
              validate: (value) => value === password || 'Les mots de passe ne correspondent pas',
            })}
            error={errors.confirmPassword?.message}
          />

          {errors.root && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" className="w-full h-12 text-base mt-4" isLoading={isLoading}>
            S'inscrire
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant w-full text-center">
          <p className="text-on-surface-variant text-sm">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
