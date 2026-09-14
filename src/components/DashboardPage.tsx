import { useState, ChangeEvent } from 'react';
import {
  ScanSearch,
  Sparkles,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { type AnalysisResult, generateAnalysisResult } from '@/types';

const MAX_CHARS = 10000;

interface DashboardPageProps {
  onAnalyzed: (result: AnalysisResult) => void;
}

export default function DashboardPage({ onAnalyzed }: DashboardPageProps) {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canAnalyze = text.trim().length > 0 && !isOverLimit && !analyzing;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (hasResult) setHasResult(false);
  };

  const handleAnalyze = () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setHasResult(false);
    setTimeout(() => {
      setAnalyzing(false);
      setHasResult(true);
      const r = generateAnalysisResult();
      setTimeout(() => onAnalyzed(r), 600);
    }, 2200);
  };

  const handleClear = () => {
    setText('');
    setHasResult(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8 sm:py-10">
        {/* Page header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-brand-400">Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Nouvelle analyse</h1>
          <p className="mt-1.5 text-sm text-gray-400">
            Collez votre texte ci-dessous et lancez une détection par IA en un clic.
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <StatCard icon={<FileText className="h-4 w-4" />} label="Analyses totales" value="0" />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Dernière analyse" value="—" />
          <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Précision moyenne" value="—" />
        </div>

        {/* Analysis card */}
        <div
          className="glass rounded-2xl border border-ink-600/60 p-6 shadow-2xl shadow-black/40 animate-fade-in-up sm:p-7"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={text}
              onChange={handleChange}
              maxLength={MAX_CHARS + 500}
              placeholder="Collez votre texte ici..."
              className="h-64 w-full resize-none rounded-xl border border-ink-600 bg-ink-850/80 px-4 py-3.5 text-sm leading-relaxed text-gray-100 placeholder-gray-500 transition-all duration-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 sm:h-72"
            />
            <div className="pointer-events-none absolute bottom-3 right-4">
              <span className={`text-xs font-medium ${isOverLimit ? 'text-red-400' : charCount > MAX_CHARS * 0.9 ? 'text-amber-400' : 'text-ink-400'}`}>
                {charCount.toLocaleString('fr-FR')}/{MAX_CHARS.toLocaleString('fr-FR')} car.
              </span>
            </div>
          </div>

          {isOverLimit && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              Limite de {MAX_CHARS.toLocaleString('fr-FR')} caractères dépassée
            </p>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleClear}
              disabled={!text && !hasResult}
              className="rounded-xl border border-ink-600 bg-ink-800/60 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-ink-500 hover:bg-ink-700/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Effacer
            </button>

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="group relative overflow-hidden rounded-xl gradient-brand px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-10"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-2">
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-4 w-4" />
                    Analyser
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Loading / result indicator */}
          {analyzing && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-ink-600 bg-ink-850/60 px-4 py-3.5">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-gray-400">Détection en cours...</span>
            </div>
          )}

          {hasResult && !analyzing && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-600/40 bg-green-950/30 px-4 py-3.5 animate-fade-in-up">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm text-green-300">Analyse terminée — redirection vers les résultats...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass flex items-center gap-3 rounded-xl border border-ink-600/60 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
