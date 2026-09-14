export interface MetricResult {
  label: string;
  value: number;
  color: string;
}

export interface AnalysisResult {
  score: number;
  metrics: MetricResult[];
}

const metricLabels: { label: string; color: string }[] = [
  { label: 'Prévisibilité', color: 'from-rose-500 to-red-500' },
  { label: 'Rythme des phrases', color: 'from-orange-500 to-amber-500' },
  { label: 'Répétitions', color: 'from-amber-500 to-yellow-500' },
  { label: 'Manque de naturel', color: 'from-orange-400 to-rose-400' },
  { label: 'Vocabulaire', color: 'from-red-500 to-rose-600' },
];

export function generateAnalysisResult(): AnalysisResult {
  const score = Math.floor(Math.random() * 60) + 35; // 35–94
  const metrics: MetricResult[] = metricLabels.map(({ label, color }) => ({
    label,
    value: Math.min(98, Math.max(40, score + Math.floor(Math.random() * 24) - 12)),
    color,
  }));
  return { score, metrics };
}

export function getVerdict(score: number): {
  text: string;
  description: string;
  tone: 'high' | 'medium' | 'low';
} {
  if (score >= 75) {
    return {
      text: 'Très probable IA détectée',
      description:
        'Le texte présente des caractéristiques fortement associées à une génération par IA. La probabilité de génération artificielle est élevée.',
      tone: 'high',
    };
  }
  if (score >= 50) {
    return {
      text: 'Probabilité modérée',
      description:
        'Le texte présente certaines caractéristiques associées à une génération par IA, mais reste ambigu. Une vérification manuelle est recommandée.',
      tone: 'medium',
    };
  }
  return {
    text: 'Probablement humain',
    description:
      'Le texte présente majoritairement des caractéristiques associées à une écriture humaine. La probabilité de génération par IA est faible.',
    tone: 'low',
  };
}
