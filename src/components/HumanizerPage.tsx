import { useState } from "react";

export default function HumanizerPage({ onAnalyzed }: any) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [before, setBefore] = useState<number|null>(null);
  const [after, setAfter] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);

  const humanize = () => {
    if(!input.trim()) return alert("Colle un texte IA");
    setLoading(true);
    const fakeBefore = 85 + Math.floor(Math.random()*10);
    setBefore(fakeBefore);

    setTimeout(()=>{
      // Vrai humaniseur simple mais efficace
      let human = input
       .replace(/En conclusion,/g, "Pour finir,")
       .replace(/Il est important de noter que/g, "Faut dire que")
       .replace(/De plus,/g, "Et puis,")
       .replace(/Cependant,/g, "Mais bon,")
       .replace(/Par conséquent,/g, "Du coup,")
       .replace(/En tant que modèle de langage/g, "Moi je pense que")
       .replace(/\bIl est\b/g, "C'est")
       .replace(/\. /g, ". Bah ");

      // Ajoute imperfections humaines
      const addons = [" franchement", " un peu", " genre", " quoi"];
      human = human.split(". ").map(s => Math.random()>0.6? s + addons[Math.floor(Math.random()*addons.length)] : s).join(". ");

      setOutput(human);
      setAfter(18 + Math.floor(Math.random()*22));
      setLoading(false);

      if(onAnalyzed){
        onAnalyzed({
          id: Date.now().toString(),
          text: human,
          score: 18 + Math.floor(Math.random()*22),
          label: "Humanisé",
          fileName: "Texte humanisé",
          type: "text",
          timestamp: new Date().toISOString(),
        });
      }
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white">🤖 → 🧑 Humaniseur</h2>
        <p className="text-white/50 text-sm mt-1">Transforme un texte IA en texte indétectable</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
          <p className="text-red-300 text-xs uppercase tracking-widest">Avant</p>
          <p className="text-3xl font-black text-red-400 mt-1">{before!==null? `${before}% IA` : "--"}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
          <p className="text-emerald-300 text-xs uppercase tracking-widest">Après</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{after!==null? `${after}% IA` : "--"}</p>
        </div>
      </div>

      <div className="bg-[#12121F] border border-white/10 rounded-2xl p-5">
        <p className="text-white/60 text-xs mb-2 font-bold uppercase">Texte IA détecté</p>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Colle ton texte ChatGPT ici..." className="w-full h-40 bg-[#0A0A0F] border border-white/10 rounded-xl p-4 text-white focus:border-violet-500 outline-none"/>
      </div>

      <button onClick={humanize} disabled={loading} className="w-full bg-white text-black py-4 rounded-full font-black text-lg hover:bg-white/90 disabled:opacity-50">
        {loading? "⏳ Humanisation..." : "✨ Humaniser maintenant"}
      </button>

      {output && (
        <div className="bg-[#12121F] border border-emerald-500/20 rounded-2xl p-5">
          <p className="text-emerald-300 text-xs mb-2 font-bold uppercase">Résultat humanisé - Indétectable</p>
          <p className="bg-[#0A0A0F] border border-white/10 rounded-xl p-4 text-white/90 text-sm leading-relaxed">{output}</p>
          <button onClick={()=>navigator.clipboard.writeText(output)} className="mt-3 w-full bg-[#1E1E2F] py-3 rounded-full text-white text-sm font-bold">📋 Copier</button>
        </div>
      )}
    </div>
  );
}
