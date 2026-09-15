import { useState } from "react";

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
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const analyze = () => {
    if(tab==="text" &&!text.trim()) return alert("Écris un texte");
    if(tab==="video" && mode==="file" &&!file) return alert("Choisis une vidéo");
    if(tab==="video" && mode==="link" &&!link.trim()) return alert("Colle un lien TikTok/Insta");

    setLoading(true);
    setTimeout(()=>{
      const score = tab==="text"? (text.length>100? 75+Math.floor(Math.random()*15): 30+Math.floor(Math.random()*30)) : 70+Math.floor(Math.random()*20);
      const result = {
        id: Date.now().toString(),
        text: tab==="text"? text.slice(0,200) : mode==="link"? `LIEN: ${link}` : `FICHIER: ${file?.name}`,
        score,
        label: score>75? "IA Très Probable": score>50? "Suspect / Mixte":"Humain Probable",
        fileName: file?.name || link,
        videoPreview: previewUrl,
        videoLink: link,
        type: tab,
        timestamp: new Date().toISOString(),
      };
      setLoading(false);
      onAnalyzed(result);
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-2 mb-6">
        <button onClick={()=>setTab("text")} className={`px-6 py-3 rounded-full font-bold ${tab==="text"?"bg-violet-600":"bg-white/10"}`}>📝 Texte</button>
        <button onClick={()=>setTab("video")} className={`px-6 py-3 rounded-full font-bold ${tab==="video"?"bg-violet-600":"bg-white/10"}`}>🎥 Vidéo</button>
      </div>

      {tab==="text"?(
        <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-60 bg-[#151530] border border-violet-500/20 rounded-xl p-4 text-white" placeholder="Colle ton texte..."/>
      ):(
        <div className="bg-[#151530] border border-violet-500/20 rounded-xl p-5">
          <div className="flex gap-2 mb-4">
            <button onClick={()=>setMode("file")} className={`flex-1 py-2 rounded-full ${mode==="file"?"bg-white text-black":"bg-white/10"}`}>📁 Fichier</button>
            <button onClick={()=>setMode("link")} className={`flex-1 py-2 rounded-full ${mode==="link"?"bg-white text-black":"bg-white/10"}`}>🔗 TikTok/Insta/YT</button>
          </div>

          {mode==="file"?(
            <div>
              <input type="file" accept="video/*" onChange={handleFile} className="block w-full text-sm text-white file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-violet-600 file:text-white"/>
              {file && <p className="text-green-400 mt-2 text-sm">✅ {file.name} - {(file.size/1024/1024).toFixed(1)} Mo</p>}
              {previewUrl && (
                <div className="mt-4">
                  <video key={previewUrl} src={previewUrl} controls playsInline className="w-full rounded-lg bg-black max-h-"/>
                  <p className="text-white/30 text-xs mt-1">Si la vidéo est noire, clique sur Play ▶️</p>
                </div>
              )}
            </div>
          ):(
            <div>
              <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://www.tiktok.com/... ou https://www.instagram.com/reel/..." className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl p-4 text-white text-sm"/>
              {link && <p className="text-green-400 mt-2 text-sm">✅ Lien prêt à analyser</p>}
            </div>
          )}
        </div>
      )}

      <button onClick={analyze} disabled={loading} className="w-full mt-6 bg-violet-600 hover:bg-violet-700 py-4 rounded-xl font-bold disabled:opacity-50">
        {loading? "⏳ Analyse...": "Lancer l'analyse"}
      </button>
    </div>
  );
}
