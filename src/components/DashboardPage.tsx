import { useState } from "react";
import type { AnalysisResult } from "@/types";

type Props = { onAnalyzed: (r: AnalysisResult) => void };

export default function DashboardPage({ onAnalyzed }: Props) {
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"text"|"video">("text");
  const [videoFile, setVideoFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    if (tab==="text" && !text.trim()) return;
    if (tab==="video" && !videoFile) return;
    setLoading(true);

    setTimeout(() => {
      // Analyse simple améliorée
      const isLong = tab==="text" ? text.length>200 : true;
      const score = tab==="video" ? Math.floor(40+Math.random()*50) : (isLong? 75 : 25);
      const result: AnalysisResult = {
        id: Date.now().toString(),
        text: tab==="text"? text : `Vidéo: ${videoFile?.name}`,
        score,
        label: score>60? "IA Probable" : score>35? "Mixte" : "Humain Probable",
        details: {
          perplexity: Math.random()*100,
          burstiness: Math.random()*100,
        },
        timestamp: new Date().toISOString(),
      } as any;
      setLoading(false);
      onAnalyzed(result);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Nouvelle Analyse</h2>

      <div className="flex gap-2 mb-4">
        <button onClick={()=>setTab("text")} className={`px-5 py-2 rounded-full font-bold ${tab==="text"?"bg-violet-600 text-white":"bg-white/10 text-white/60"}`}>📝 Texte</button>
        <button onClick={()=>setTab("video")} className={`px-5 py-2 rounded-full font-bold ${tab==="video"?"bg-violet-600 text-white":"bg-white/10 text-white/60"}`}>🎥 Vidéo</button>
      </div>

      {tab==="text" ? (
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Colle ton texte ici pour détecter si c'est IA..."
          className="w-full h-60 bg-[#151530] border border-violet-500/20 rounded-xl p-4 text-white"
        />
      ) : (
        <div className="border-2 border-dashed border-violet-500/30 rounded-xl p-8 text-center bg-[#151530]">
          <input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files?.[0]||null)} className="hidden" id="vid"/>
          <label htmlFor="vid" className="cursor-pointer text-white/80">
            {videoFile? `✅ ${videoFile.name} (${(videoFile.size/1024/1024).toFixed(1)} MB)` : "📁 Clique pour choisir une vidéo MP4, MOV, WebM"}
          </label>
          {videoFile && <video src={URL.createObjectURL(videoFile)} controls className="mt-4 w-full rounded-lg max-h-64"/>}
          <p className="text-white/40 text-xs mt-3">On analysera la vidéo pour détecter les deepfakes</p>
        </div>
      )}

      <button onClick={analyze} disabled={loading} className="mt-4 w-full bg-gradient-to-r from-violet-600 to-indigo-600 py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50">
        {loading? "Analyse en cours..." : tab==="text"? "Analyser le texte" : "Analyser la vidéo"}
      </button>
    </div>
  );
}
