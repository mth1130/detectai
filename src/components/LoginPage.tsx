import { useState } from "react";

type Props = { onLogin: () => void };

export default function LoginPage({ onLogin }: Props) {
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    const users = JSON.parse(localStorage.getItem("detectai_users") || "[]");
    if (!email ||!pass) { setError("Remplis email et mot de passe"); return; }

    if (mode === "signup") {
      if (users.find((u:any)=>u.email===email)) { setError("Compte déjà existant"); return; }
      users.push({ email, pass });
      localStorage.setItem("detectai_users", JSON.stringify(users));
      localStorage.setItem("detectai_current", email);
      onLogin();
    } else {
      // Login: accepte ancien compte test + nouveaux comptes
      if (email==="test@test.com" || users.find((u:any)=>u.email===email && u.pass===pass)) {
        localStorage.setItem("detectai_current", email);
        onLogin();
      } else {
        setError("Email ou mot de passe incorrect. Inscris-toi d'abord!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
      <div className="bg-[#151530] border border-violet-500/20 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2">DetectAI Omega</h1>
        <p className="text-white/60 mb-6">{mode==="login"? "Connecte-toi" : "Crée ton compte - Mbour"}</p>

        <div className="flex gap-2 mb-6">
          <button onClick={()=>setMode("login")} className={`flex-1 py-2 rounded ${mode==="login"? "bg-violet-600 text-white":"bg-white/10 text-white/60"}`}>Connexion</button>
          <button onClick={()=>setMode("signup")} className={`flex-1 py-2 rounded ${mode==="signup"? "bg-violet-600 text-white":"bg-white/10 text-white/60"}`}>Inscription</button>
        </div>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white mb-3"/>
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Mot de passe" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white mb-4"/>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button onClick={handle} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 py-3 rounded-lg text-white font-bold">
          {mode==="login"? "Se connecter" : "S'inscrire"}
        </button>

        <p className="text-white/40 text-xs mt-4 text-center">Test rapide: test@test.com / 1234</p>
      </div>
    </div>
  );
}
