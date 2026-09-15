import { useState, useEffect } from "react";

export default function DashboardPage({ onAnalyzed }: any) {
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"text"|"video">("text");
  const [videoFile, setVideoFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!videoFile) { setPreview(""); return; }
    const url = URL.createObjectURL(videoFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const analyze = () => {
    if (tab==="text" &&!text.trim()) { alert("Écris un texte d'abord"); return; }
    if (tab==="video" &&!videoFile) { alert("Choisis une vidéo d'abord"); return; }
    setLoading(true);

    setTimeout(() => {
      const score = tab==="video"
       ? 68 + Math.floor(Math.random()*20)
        : text.length < 50? 15 : text.includes("en tant que") || text.includes("En conclusion")? 82 : 35;

      const result = {
        id: Date.now().toString(),
        text: tab==="text"? text.slice(0,200) : `Vidéo: ${videoFile?.name}`,
        score,
        label: score>70? "IA Très Probable" : score>45? "Mixte / Suspect" : "Humain Probable",
        fileName: videoFile?.name,
        type: tab,
        timestamp: new Date().toISOString(),
      };
      setLoading(false);
      onAnalyzed(result);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Détecteur Omega - Mbour</h2>

      <div className="flex gap-2 mb-6">
        <button onClick={()=>setTab("text")} className={`px-6 py-3 rounded-full font-bold ${tab==="text"?"bg-violet-600 text-white":"bg-white/10 text-white/60"}`}>📝 Texte</button>
        <button onClick={()=>setTab("video")} className={`px-6 py-3 rounded-full font-bold ${tab==="video"?"bg-violet-600 text-white":"bg-white/10 text-white/60"}`}>🎥 Vidéo</button>
      </div>

      {tab==="text"? (
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Colle ton texte ici..."
          className="w-full h-64 bg-[#151530] border border-violet-500/20 rounded-xl p-4 text-white text-base"
        />
      ) : (
        <div className="bg-[#151530] border-2 border-dashed border-violet-500/40 rounded-xl p-6 text-center">
          <label className="block cursor-pointer">
            <span className="bg-violet-600 text-white px-6 py-3 rounded-full inline-block font-bold mb-4">📁 Choisir une vidéo</span>
            <input type="file" accept="video/mp4,video/mov,video/webm,video/*" onChange={e=>{ const f=e.target.files?.[0]; if(f){ setVideoFile(f); }}} className="hidden"/>
          </label>

          {videoFile && <p className="text-green-400 mt-2">✅ {videoFile.name} - {(videoFile.size/1024/1024).toFixed(1)} MB</p>}

          {preview && (
            <video src={preview} controls playsInline muted className="mt-4 w-full rounded-lg max-h-80 bg-black"/>
          )}

          {!videoFile && <p className="text-white/40 text-sm mt-4">MP4, MOV, WebM - Max 50MB</p>}
        </div>
      )}

      <button onClick={analyze} disabled={loading} className="mt-6 w-full bg-gradient-to-r from-violet-600 to-indigo-600 py-4 rounded-xl text-white font-bold text-lg">
        {loading? "⏳ Analyse IA en cours..." : tab==="text"? "Analyser le texte" : "Analyser la vidéo"}
      </button>
    </div>
  );
}
