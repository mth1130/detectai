import { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';
import ResultsPage from '@/components/ResultsPage';
import Sidebar, { type SidebarPage } from '@/components/Sidebar';
import { type AnalysisResult } from '@/types';

type AuthState = 'login' | 'app';

function App() {
  const [auth, setAuth] = useState<AuthState>('login');
  const [page, setPage] = useState<SidebarPage>('dashboard');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  if (auth === 'login') {
    return <LoginPage onLogin={() => { setAuth('app'); setPage('dashboard'); }} />;
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-ink-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand-600/12 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-600/8 blur-[130px] animate-float-slow" style={{ animationDelay: '2s' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <Sidebar
        current={page}
        onNavigate={setPage}
        onLogout={() => setAuth('login')}
      />

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {page === 'dashboard' && (
          <DashboardPage
            onAnalyzed={(r) => { setResult(r); setPage('results'); }}
          />
        )}
        {page === 'results' && (
          <ResultsPage
            result={result}
            onNewAnalysis={() => setPage('dashboard')}
          />
        )}
        {page === 'history' && (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Historique — bientôt disponible
          </div>
        )}
        {page === 'settings' && (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Paramètres — bientôt disponibles
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
