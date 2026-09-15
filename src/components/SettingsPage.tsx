import { useState } from "react";

export default function SettingsPage({ theme, setTheme, lang, setLang }: any){
  const [saved,setSaved]=useState(false);
  const save=(k:string,v:string)=>{
    localStorage.setItem(k,v);
    setSaved(true);
    setTimeout(()=>setSaved(false),1500);
  };
  return(
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black">Parametres</h1>
      <p className="text-sm opacity-50 mt-1">4 langues disponibles</p>
      {saved && <div className="mt-4 bg-emerald-500 text-black px-4 py-2 rounded-full text-sm font-bold w-fit">Sauvegarde!</div>}

      <div className="mt-8 space-y-6">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
          <h2 className="font-black text-lg">Apparence / Appearance / المظهر</h2>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button onClick={()=>{setTheme("dark"); save("detectai_theme","dark")}} className={"p-5 rounded-2xl border text-left "+(theme==="dark"?"bg-white text-black border-white":"bg-slate-950 border-white/10")}><p className="text-2xl">🌙</p><p className="font-black mt-2">Sombre / Dark</p></button>
            <button onClick={()=>{setTheme("light"); save("detectai_theme","light")}} className={"p-5 rounded-2xl border text-left "+(theme==="light"?"bg-white text-black border-white":"bg-slate-950 border-white/10")}><p className="text-2xl">☀️</p><p className="font-black mt-2">Clair / Light</p></button>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
          <h2 className="font-black text-lg">Langue / Language / اللغة</h2>
          <div className="space-y-2 mt-5">
            {[
              {id:"fr", flag:"🇫🇷", name:"Francais"},
              {id:"en", flag:"🇺🇸", name:"English"},
              {id:"es", flag:"🇪🇸", name:"Espanol"},
              {id:"ar", flag:"🇸🇦", name:"العربية - Arabe"},
            ].map(l=>(
              <button key={l.id} onClick={()=>{setLang(l.id); save("detectai_lang", l.id)}} className={"w-full flex items-center justify-between p-4 rounded-2xl border "+(lang===l.id?"bg-white text-black border-white":"bg-slate-950 border-white/10")}>
                <div className="flex items-center gap-3"><span className="text-2xl">{l.flag}</span><p className="font-bold text-base">{l.name}</p></div>
                {lang===l.id && <span className="font-black text-xl">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
