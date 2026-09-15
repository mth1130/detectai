export default function ResultsPage({ result, onBack }: any) {
  if(!result) return null;
  const color = result.score>80? "from-red-500 to-orange-500" : result.score>60? "from-yellow-500 to-orange-500" : result.score>40? "from-yellow-400 to-violet-500" : "from-emerald-500 to-teal-500";
  const bgColor = result.score>80? "bg-red-500/10 border-red-500/20" : result.score>60? "bg-orange-500/10 border-orange-500/20" : "bg-emerald-500/10 border-emerald-500/20";
  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-6 text-white/50 hover:text-white flex items-center gap-2">← Retour dashboard</button>
      
      <div className={`bg-[#151530] border rounded-2xl p- ${bgColor}`}>
        <div className="bg-[#0f0f23] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div><p className="text-white/40 text-xs uppercase tracking-widest">Résultat</p><h2 className="text-2xl font-black mt-1">{result.label}</h2></div>
            <div className={`bg-gradient-to-br ${color} px-5 py-3 rounded-xl`}><p className="text-3xl font-black text-white">{result.score}%</p><p className="text- text-white/70 -mt-1">IA SCORE</p></div>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-6">
            <div className={`h-full bg-gradient-to-r ${color} transition-all duration-1000`} style={{width:`${result.score}%`}}/>
          </div>

          {result.videoPreview && <video src={result.videoPreview} controls playsInline className="w-full rounded-xl bg-black max-h- mb-6"/>}
          {result.videoLink && <a href={result.videoLink} target="_blank" className="block bg-[#0a0a1a] border border-white/10 p-3 rounded-xl mb-6 text-xs text-violet-300 break-all">🔗 {result.videoLink}</a>}

          <div className="space-y-3">
            <h3 className="font-bold text-white/90">🧠 Pourquoi ce score?</h3>
            {(result.reasons||[]).map((r:string,i:number)=>(
              <div key={i} className="flex gap-3 bg-white/[0.03] border border-white/5 p-3 rounded-xl"><span className="text-violet-400">•</span><span className="text-sm text-white/70">{r}</span></div>
            ))}
          </div>

          <div className="mt-6 bg-[#0a0a1a] p-4 rounded-xl">
            <p className="text- text-white/30 uppercase tracking-widest mb-2">Contenu analysé</p>
            <p className="text-sm text-white/60 break-words line-clamp-6">{result.fullText || result.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
