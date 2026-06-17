import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Bell, Globe, Shield, CheckCircle } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    {
      title: 'Profil',
      icon: User,
      color: 'bg-blue-50 text-blue-600',
      fields: [
        { label: 'Nom complet',     type: 'text',  value: user?.name  || '',  placeholder: 'Votre nom' },
        { label: 'Adresse email',   type: 'email', value: user?.email || '',  placeholder: 'votre@email.fr' },
      ],
    },
    {
      title: 'Sécurité',
      icon: Lock,
      color: 'bg-violet-50 text-violet-600',
      fields: [
        { label: 'Mot de passe actuel',  type: 'password', value: '', placeholder: '••••••••' },
        { label: 'Nouveau mot de passe', type: 'password', value: '', placeholder: '••••••••' },
        { label: 'Confirmation',         type: 'password', value: '', placeholder: '••••••••' },
      ],
    },
  ];

  const toggleOptions = [
    { icon: Bell,   label: 'Notifications email', desc: 'Recevoir un email à chaque nouveau commentaire', checked: true },
    { icon: Globe,  label: 'Blog public',          desc: 'Rendre le blog accessible à tous',              checked: true },
    { icon: Shield, label: 'Modération auto',      desc: 'Approuver les commentaires avant publication',  checked: false },
  ];

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">

      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Paramètres enregistrés avec succès.
        </div>
      )}

      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.color}`}>
              <section.icon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900">{section.title}</h3>
          </div>
          <div className="p-6 space-y-4">
            {section.fields.map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{field.label}</label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Préférences */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-gray-900">Préférences</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {toggleOptions.map((opt) => (
            <div key={opt.label} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <opt.icon className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" defaultChecked={opt.checked} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton enregistrer */}
      <button
        onClick={handleSave}
        className="w-full bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-[0.98]"
      >
        Enregistrer les modifications
      </button>
    </div>
  );
};
