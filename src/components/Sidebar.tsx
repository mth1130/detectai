import {
  ScanSearch,
  LayoutDashboard,
  FileText,
  History,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export type SidebarPage = 'dashboard' | 'results' | 'history' | 'settings';

interface SidebarProps {
  current: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'results' as const, label: 'Résultats', icon: FileText },
  { id: 'history' as const, label: 'Historique', icon: History },
  { id: 'settings' as const, label: 'Paramètres', icon: Settings },
];

export default function Sidebar({ current, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-ink-700/60 bg-ink-900/80 glass">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg gradient-brand blur-md opacity-40" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg gradient-brand">
            <ScanSearch className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Detect<span className="gradient-text">AI</span>
        </span>
      </div>

      {/* Menu */}
      <nav className="mt-2 flex-1 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
          Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = current === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-brand-500/15 text-brand-300'
                      : 'text-gray-400 hover:bg-ink-800/60 hover:text-gray-200'
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] transition-colors ${active ? 'text-brand-400' : 'text-ink-400 group-hover:text-gray-300'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5 text-brand-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile */}
      <div className="border-t border-ink-700/60 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-sm font-semibold text-white">
            DA
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">Admin Demo</p>
            <p className="truncate text-xs text-ink-400">admin@detectai.io</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
