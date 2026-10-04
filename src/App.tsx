"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// CONFIG - NE PAS TOUCHER - C'est la version qui marche avec Vercel
const supabaseUrl = (typeof import.meta.env!== "undefined" && import.meta.env.VITE_SUPABASE_URL) || "https://gostyskhyzhgrsrbbgfu.supabase.co"
const supabaseAnonKey = (typeof import.meta.env!== "undefined" && import.meta.env.VITE_SUPABASE_ANON_KEY) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type TabType = "detection" | "history" | "settings"
type ScanType = "text" | "image" | "link" | "email"
type LangType = "fr" | "en" | "ar"

const translations = {
  fr: {
    detection: "Détection",
    history: "Historique",
    settings: "Paramètres",
    pro: "PRO",
    subscription: "Abonnement",
    plan: "Plan actuel",
    manage: "Gérer l'abonnement",
    language: "Langue",
    theme: "Thème",
    dark: "Sombre",
    light: "Clair",
    selectLang: "Choisissez votre langue",
    account: "Mon compte",
    logout: "Déconnexion",
    welcome: "Bienvenue sur DetectAI"
  },
  en: {
    detection: "Detection",
    history: "History",
    settings: "Settings",
    pro: "PRO",
    subscription: "Subscription",
    plan: "Current plan",
    manage: "Manage subscription",
    language: "Language",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    selectLang: "Choose your language",
    account: "My account",
    logout: "Logout",
    welcome: "Welcome to DetectAI"
  },
  ar: {
    detection: "الكشف",
    history: "السجل",
    settings: "الإعدادات",
    pro: "برو",
    subscription: "الاشتراك",
    plan: "الخطة الحالية",
    manage: "إدارة الاشتراك",
    language: "اللغة",
    theme: "المظهر",
    dark: "داكن",
    light: "فاتح",
    selectLang: "اختر لغتك",
    account: "حسابي",
    logout: "تسجيل خروج",
    welcome: "مرحبا بكم في DetectAI"
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("detection")
  const [lang, setLang] = useState<LangType>("fr")
  const [isDark, setIsDark] = useState(false)
  const [user, setUser] = useState<any>(null)

  const t = translations[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user?? null)
    })
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") setIsDark(true)
    const savedLang = localStorage.getItem("lang") as LangType
    if (savedLang) setLang(savedLang)
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", isDark? "dark" : "light")
    if (isDark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDark])

  const handleLangChange = (newLang: LangType) => {
    setLang(newLang)
    localStorage.setItem("lang", newLang)
  }

  return (
    <div className={`min-h-screen flex ${isDark? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* SIDEBAR */}
      <div className={`w-64 p-4 border-r ${isDark? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
        <h1 className="font-bold text-xl mb-8">DETECTAI <span className="bg-black text-white text-xs px-2 py-1 rounded ml-2">PRO</span></h1>

        <div className="space-y-2">
          <button onClick={() => setActiveTab("detection")} className={`w-full text-left p-3 rounded ${activeTab === "detection"? "bg-black text-white" : ""}`}>🔍 {t.detection}</button>
          <button onClick={() => setActiveTab("history")} className={`w-full text-left p-3 rounded ${activeTab === "history"? "bg-black text-white" : ""}`}>📜 {t.history}</button>
          <button onClick={() => setActiveTab("settings")} className={`w-full text-left p-3 rounded ${activeTab === "settings"? "bg-black text-white" : ""}`}>⚙️ {t.settings}</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">{t.settings}</h2>

            <div className={`p-6 rounded-xl mb-4 border ${isDark? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className="font-semibold mb-2">{t.subscription}</h3>
              <p className="text-sm opacity-70 mb-4">{t.plan}: PRO</p>
              <button className="bg-black text-white px-4 py-2 rounded text-sm">{t.manage}</button>
            </div>

            <div className={`p-6 rounded-xl mb-4 border ${isDark? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className="font-semibold mb-2">{t.language}</h3>
              <p className="text-sm opacity-70 mb-4">{t.selectLang}</p>
              <div className="flex gap-2">
                <button onClick={() => handleLangChange("fr")} className={`px-4 py-2 rounded border ${lang === "fr"? "bg-black text-white" : ""}`}>Français</button>
                <button onClick={() => handleLangChange("en")} className={`px-4 py-2 rounded border ${lang === "en"? "bg-black text-white" : ""}`}>English</button>
                <button onClick={() => handleLangChange("ar")} className={`px-4 py-2 rounded border ${lang === "ar"? "bg-black text-white" : ""}`}>العربية</button>
              </div>
            </div>

            <div className={`p-6 rounded-xl mb-4 border ${isDark? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className="font-semibold mb-2">{t.theme}</h3>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setIsDark(false)} className={`px-4 py-2 rounded border flex items-center gap-2 ${!isDark? "bg-black text-white" : ""}`}>☀️ {t.light}</button>
                <button onClick={() => setIsDark(true)} className={`px-4 py-2 rounded border flex items-center gap-2 ${isDark? "bg-black text-white" : ""}`}>🌙 {t.dark}</button>
              </div>
            </div>

          </div>
        )}

        {activeTab === "detection" && (
          <div>
            <h2 className="text-2xl font-bold">{t.welcome}</h2>
            <p className="mt-4">Colle ton texte ici pour détecter...</p>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 className="text-2xl font-bold">{t.history}</h2>
          </div>
        )}
      </div>
    </div>
  )
}
