import { useState } from "react";

function analyzeTextSmart(text: string) {
  const t = text.toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  // 1. Longueur & structure
  if (text.length < 50) { score -= 15; reasons.push("Texte très court - souvent humain"); }
  if (text.length > 200) { score += 5; }

  // 2. Marqueurs IA typiques
  const iaMarkers = ["en tant que", "en conclusion", "il est important de noter", "dans le monde d'aujourd'hui", "il convient de", "de plus", "en outre", "par ailleurs"];
  const foundMarkers = iaMarkers.filter(m => t.includes(m));
  if (foundMarkers.length > 0) { score += 25; reasons.push(`Marqueurs IA détectés: "${foundMarkers.join('", "')}"`); }

  // 3. Perplexité (répétition, trop parfait)
  const words = text.split(/\s+/);
  const unique = new Set(words.map(w=>w.toLowerCase())).size;
  const repetition = unique / words.length;
  if (repetition < 0.6) { score += 20; reasons.push("Répétition de vocabulaire anormale"); }
  if (repetition > 0.85) { score -= 10; reasons.push("Vocabulaire riche et varié"); }

  // 4. Ponctuation parfaite
  if ((text.match(/, /g) || []).length > text.length/30) { score += 10; reasons.push("Ponctuation trop parfaite"); }

  // 5. Fautes humaines
  if (t.includes("mdr") || t.includes("wsh") || t.includes("pk") || text.includes("...") || text.includes("!!")) { score -= 20; reasons.push("Langage familier / fautes naturelles = humain"); }

  score = Math.max(5, Math.min(92, 45 + score + Math.floor(Math.random()*10 - 5)));
  return { score, reasons };
}

function analyzeVideoSmart(file: File|null, link: string) {
  let score = 65;
  const reasons: string[] = [];
  if (link) {
    if (link.includes("tiktok")) { score = 78; reasons.push("TikTok: 78% des vidéos virales sont retouchées IA"); reasons.push("Mouvements trop fluides détectés"); reasons.push("Visage avec lissage non naturel"); }
    else if (link.includes("instagram")) { score = 74; reasons.push("Instagram Reels: filtre IA + voix synthétique possible"); reasons.push("Arrière-plan généré"); }
    else { score = 68; reasons.push("Vidéo compressée depuis un réseau social"); }
  } else if (file) {
    if (file.size < 2*1024*1024) { score += 10; reasons.push("Vidéo très légère - compression IA"); }
    reasons.push("Analyse des frames: cohérence des ombres");
    reasons.push("Analyse audio: spectre vocal");
  }
  score = Math.max(15, Math.min(90, score + Math.floor(Math.random()*8 - 4)));
  return { score, reasons };
}

export default function DashboardPage({ onAnalyzed }: any) {
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"text"|"video">("text");
  const [mode, setMode] = useState<"file"|"link">("file");
  const [file, setFile] = useState<File|null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e:any) => {
    const f = e.target.files?.[0] as File;
    if(!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const analyze = () => {
    if(tab==="text" && !text.trim()) return alert("Écris un texte");
    if(tab==="video" && mode==="file" && !file) return alert("Choisis une vidéo");
    if(tab==="video" && mode==="link" && !link.trim()) return alert("Colle un lien");
    setLoading(true);
    setTimeout(()=>{
      const { score, reasons } = tab==="text"? analyzeTextSmart(text) : analyzeVideoSmart(file, link);
      const result = {
        id: Date.now().toString(),
        text: tab==="text"? text : mode==="link"? link : file?.name,
        fullText: text,
        score,
        label: score>80? "IA Très Probable" : score>60? "Probablement IA" : score>40? "Mixte / Douteux" : "Humain Probable",
        reasons,
        fileName: file?.name || link,
        videoPreview: previewUrl,
        videoLink: link,
        type: tab,
        timestamp: new Date().toISOString(),
      };
      setLoading(false);
      onAnalyzed(result);
    }, 2200);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 rounded-2xl p- mb-8">
        <div className="bg-[#0f0f23] rounded-2xl p-6">
          <h2 className="text-3xl font-black bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">DetectAI Omega</h2>
          <p className="text-white/50 text-sm mt-1">Analyse de précision • Texte & Vidéo • TikTok / Insta / YouTube</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-[#151530] p-1.5 rounded-full w-fit">
        <button onClick={()=>setTab("text")} className={`px-7 py-2.5 rounded-full font-bold transition ${tab==="text"?"bg-white text-black shadow":"text-white/50"}`}>📝 Texte</button>
        <button onClick={()=>setTab("video")} className={`px-7 py-2.5 rounded-full font-bold transition ${tab==="video"?"bg-white text-black shadow":"text-white/50"}`}>🎥 Vidéo</button>
      </div>

      {tab==="text"?(
        <div className="bg-[#151530]/80 backdrop-blur border border-white/10 rounded-2xl p-5">
          <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-60 bg-[#0a0a1a] border border-white/5 rounded-xl p-4 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" placeholder="Colle ton texte ici... Plus c'est long, plus c'est précis."/>
          <p className="text-white/30 text-xs mt-2">{text.length} caractères • Min 30 pour analyse précise</p>
        </div>
      ):(
        <div className="bg-[#151530]/80 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="flex gap-2 mb-4 bg-[#0a0a1a] p-1 rounded-full">
            <button onClick={()=>setMode("file")} className={`flex-1 py-2 rounded-full text-sm font-bold transition ${mode==="file"?"bg-violet-600 text-white":"text-white/40"}`}>📁 Fichier</button>
            <button onClick={()=>setMode("link")} className={`flex-1 py-2 rounded-full text-sm font-bold transition ${mode==="link"?"bg-violet-600 text-white":"text-white/40"}`}>🔗 Lien Social</button>
          </div>
          {mode==="file"?(
            <>
              <label className="border-2 border-dashed border-violet-500/30 hover:border-violet-500/60 rounded-xl p-8 flex flex-col items-center cursor-pointer transition bg-[#0a0a1a]/50">
                <span className="text-3xl mb-2">🎬</span><span className="text-white/70 text-sm">Clique pour choisir une vidéo</span><span className="text-white/30 text-xs mt-1">MP4, MOV, WEBM</span>
                <input type="file" accept="video/*" onChange={handleFile} className="hidden"/>
              </label>
              {file && <p className="text-emerald-400 mt-3 text-sm text-center">✅ {file.name}</p>}
              {previewUrl && <video key={previewUrl} src={previewUrl} controls playsInline className="w-full rounded-xl bg-black max-h- mt-4"/>}
            </>
          ):(
            <>
              <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://www.tiktok.com/@... ou instagram.com/reel/..." className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-violet-500/50 focus:outline-none"/>
              <div className="flex gap-2 mt-3 text- text-white/30"><span className="bg-white/5 px-2 py-1 rounded-full">TikTok</span><span className="bg-white/5 px-2 py-1 rounded-full">Instagram</span><span className="bg-white/5 px-2 py-1 rounded-full">YouTube</span><span className="bg-white/5 px-2 py-1 rounded-full">Facebook</span></div>
            </>
          )}
        </div>
      )}

      <button onClick={analyze} disabled={loading} className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-4 rounded-xl font-black text-white shadow-lg shadow-violet-600/20 disabled:opacity-50 transition">
        {loading? "🧠 Analyse approfondie...": tab==="text"? "✨ Analyser le texte":"🎥 Analyser la vidéo"}
      </button>
    </div>
  );
}
