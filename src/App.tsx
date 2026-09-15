import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import DashboardPage from "@/components/DashboardPage";
import ResultsPage from "@/components/ResultsPage";
import Sidebar, { type SidebarPage } from "@/components/Sidebar";
import { type AnalysisResult } from "@/types";

type AuthState = "login" | "app";
type Lang = "fr" | "en" | "es" | "de";

const translations = {
  fr: { dashboard: "Tableau de bord", results: "Résultats", history: "Historique", settings: "Paramètres", login: "Connexion" },
  en: { dashboard: "Dashboard", results: "Results", history: "History", settings: "Settings", login: "Login" },
  es: { dashboard: "Panel", results: "Resultados", history: "Historial", settings: "Ajustes", login: "Iniciar sesión" },
  de: { dashboard: "Dashboard", results: "Ergebnisse", history: "Verlauf", settings: "Einstellungen", login: "Anmelden" },
};

function App() {
  const [auth, setAuth] = useState<AuthState>("login");
  const [page, setPage] = useState<SidebarPage>("dashboard");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>((localStorage.getItem("lang") as Lang) || "fr");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("light", theme === "light");
  }, [lang, theme]);

  if (auth === "login") {
    return <LoginPage onLogin={() => { setAuth("app"); setPage("dashboard"); }} />;
  }

  return (
    <div className={`relative flex h-screen overflow-hidden ${theme === "light" ? "bg-gray-100 text-black" : "bg-[#0a0a1a] text-white"}`}>
      {/* BOUTON MOBILE */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden fixed top-4 left-4 z-[100] bg-violet-600 p-3 rounded-lg"
      >
        ☰
      </button>

      {/* SIDEBAR - devient tiroir sur mobile */}
      <div className={`
        fixed md:relative z-[90] h-full transition-all duration-300
        ${menuOpen ? "left-0" : "-left-full"} md:left-0
      `}>
        <Sidebar
          currentPage={page}
          onPageChange={(p) => { setPage(p); setMenuOpen(false); }}
          onLogout={() => setAuth("login")}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          translations={translations}
        />
      </div>

      {/* CONTENU */}
      <main className="flex-1 overflow-y-auto p-4 pt-20 md:pt-6 w-full">
        {page === "dashboard" && (
          <DashboardPage
            onAnalyzed={(r) => { setResult(r); setPage("results"); }}
          />
        )}
        {page === "results" && result && (
          <ResultsPage result={result} onBack={() => setPage("dashboard")} />
        )}
      </main>
    </div>
  );
}

export default App;
