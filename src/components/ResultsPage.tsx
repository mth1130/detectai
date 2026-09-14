import { useEffect, useState } from 'react';
import {
  FileText,
  RotateCcw,
  Download,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { type AnalysisResult, getVerdict } from '@/types';

interface ResultsPageProps {
  result: AnalysisResult | null;
  onNewAnalysis: () => void;
}

const defaultResult: AnalysisResult = {
  score: 0,
  metrics: [
    { label: 'Prévisibilité', value: 0, color: 'from-rose-500 to-red-500' },
    { label: 'Rythme des phrases', value: 0, color: 'from-orange-500 to-amber-500' },
    { label: 'Répétitions', value: 0, color: 'from-amber-500 to-yellow-500' },
    { label: 'Manque de naturel', value: 0, color: 'from-orange-400 to-rose-400' },
    { label: 'Vocabulaire', value: 0, color: 'from-red-500 to-rose-600' },
  ],
};

export default function ResultsPage({ result, onNewAnalysis }: ResultsPageProps) {
  const data = result ?? defaultResult;
  const verdict = getVerdict(data.score);

  const [displayScore, setDisplayScore] = useState(0);
  const [barWidths, setBarWidths] = useState<number[]>(data.metrics.map(() => 0));

  useEffect(() => {
    setDisplayScore(0);
    setBarWidths(data.metrics.map(() => 0));
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * data.score));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const barTimer = setTimeout(() => setBarWidths(data.metrics.map((m) => m.value)), 300);
    return () => { cancelAnimationFrame(raf); clearTimeout(barTimer); };
  }, [data]);

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  const toneStyles = {
    high: {
      ring: ['#f43f5e', '#e11d48', '#be123c'],
      badge: 'border-red-500/30 bg-red-500/10 text-red-300',
      badgeIcon: 'text-red-400',
      Icon: AlertTriangle,
    },
    medium: {
      ring: ['#f59e0b', '#f97316', '#ea580c'],
      badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      badgeIcon: 'text-amber-400',
      Icon: AlertCircle,
    },
    low: {
      ring: ['#22c55e', '#16a34a', '#15803d'],
      badge: 'border-green-500/30 bg-green-500/10 text-green-300',
      badgeIcon: 'text-green-400',
      Icon: CheckCircle2,
    },
  }[verdict.tone];

  const gradId = `scoreGrad-${verdict.tone}`;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8 sm:py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-brand-400">Résultats</span>
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Résultats de l'analyse</h1>
          <p className="mt-1.5 text-sm text-gray-400">
            Voici la détection IA générée pour votre texte.
          </p>
        </div>

        {/* Score + verdict */}
        <div
          className="glass mb-6 flex flex-col items-center gap-6 rounded-2xl border border-ink-600/60 p-8 shadow-2xl shadow-black/40 animate-fade-in-up sm:flex-row sm:items-center sm:gap-10"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          <div className="relative flex-shrink-0">
            <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={toneStyles.ring[0]} />
                  <stop offset="50%" stopColor={toneStyles.ring[1]} />
                  <stop offset="100%" stopColor={toneStyles.ring[2]} />
                </linearGradient>
              </defs>
              <circle cx="90" cy="90" r={radius} fill="none" stroke="#1e1e34" strokeWidth="10" />
              <circle
                cx="90" cy="90" r={radius}
                fill="none" stroke={`url(#${gradId})`} strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{displayScore}%</span>
              <span className="mt-1 text-xs text-ink-400">Score IA</span>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 ${toneStyles.badge}`}>
              <toneStyles.Icon className={`h-4 w-4 ${toneStyles.badgeIcon}`} />
              <span className="text-sm font-semibold">{verdict.text}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">{verdict.description}</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink-400 sm:justify-start">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-400" />
                Analyse complète
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-ink-500" />
                5 critères évalués
              </span>
            </div>
          </div>
        </div>

        {/* Metric bars */}
        <div
          className="glass rounded-2xl border border-ink-600/60 p-6 shadow-2xl shadow-black/40 animate-fade-in-up sm:p-7"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-ink-400">
            Détail des critères
          </h2>
          <div className="space-y-5">
            {data.metrics.map((m, i) => (
              <div key={m.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200">{m.label}</span>
                  <span className="text-sm font-semibold text-white">{m.value}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${barWidths[i]}%`, transitionDelay: `${i * 120}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center animate-fade-in-up"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          <button
            onClick={onNewAnalysis}
            className="group flex items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-800/60 px-6 py-3 text-sm font-semibold text-gray-200 transition-all hover:border-ink-500 hover:bg-ink-700/60 hover:text-white active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-180 duration-500" />
            Analyser un autre texte
          </button>
          <button
            className="group relative overflow-hidden rounded-xl gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 active:scale-[0.98]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Exporter PDF
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
