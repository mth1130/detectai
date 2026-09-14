import { useState, FormEvent } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ScanSearch,
  ShieldCheck,
  Activity,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!email) {
      next.email = 'Veuillez saisir votre email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Format d\'email invalide';
    }
    if (!password) {
      next.password = 'Veuillez saisir votre mot de passe';
    } else if (password.length < 6) {
      next.password = 'Au moins 6 caractères';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1800);
  };

  const handleDemo = () => {
    setEmail('demo@detectai.io');
    setPassword('demo1234');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand-600/20 blur-[120px] animate-float-slow" />
        <div className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-600/15 blur-[130px] animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-[100px] animate-float-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[420px]">
          {/* Logo + brand */}
          <div className="mb-8 text-center animate-fade-in-up">
            <div className="mb-4 inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl gradient-brand blur-lg opacity-50 animate-pulse-glow" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand shadow-lg shadow-brand-600/30">
                  <ScanSearch className="h-7 w-7 text-white" strokeWidth={2.2} />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Detect<span className="gradient-text">AI</span>
            </h1>
            <p className="mt-1 text-xs font-medium tracking-wide text-ink-400">
              AI-POWERED DETECTION PLATFORM
            </p>
          </div>

          {/* Card */}
          <div
            className="glass rounded-2xl border border-ink-600/60 p-7 shadow-2xl shadow-black/40 animate-fade-in-up"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Bon retour !
              </h2>
              <p className="mt-1.5 text-sm text-gray-400">
                Connectez-vous pour accéder à vos analyses
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-400">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@entreprise.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    className={`input-field ${errors.email ? 'error' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-gray-400">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    className={`input-field pr-11 ${errors.password ? 'error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-gray-200"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-gray-400 select-none">
                  <input type="checkbox" className="peer sr-only" />
                  <span className="flex h-4 w-4 items-center justify-center rounded border border-ink-500 bg-ink-800 transition-all peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-focus:ring-2 peer-focus:ring-brand-500/30">
                    <svg className="h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Se souvenir de moi
                </label>
                <button type="button" className="font-medium text-brand-300 transition-colors hover:text-brand-200">
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl gradient-brand py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Demo link */}
            <div className="mt-5 text-center">
              <button
                onClick={handleDemo}
                className="text-xs font-medium text-gray-400 transition-colors hover:text-brand-300"
              >
                Compte de démo
              </button>
            </div>
          </div>

          {/* Feature strip */}
          <div
            className="mt-6 flex items-center justify-center gap-6 text-[11px] text-ink-400 animate-fade-in"
            style={{ animationDelay: '0.5s', opacity: 0 }}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
              Chiffré de bout en bout
            </span>
            <span className="h-3 w-px bg-ink-600" />
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-brand-400" />
              Temps réel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
