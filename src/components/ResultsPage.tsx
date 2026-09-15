export default function ResultsPage({ result, onBack }: any) {
  if(!result) return null;
  const isVideo = result.type==="video";
  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-4 text-white/60 hover:text-white">← Retour</button>
      <div className="bg-[#151530] border border-violet-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2">{result.label}</h2>
        <p className={`text-5xl font-black mb-4 ${result.score>75?"text-red-400": result.score>50?"text-yellow-400":"text-green-400"}`}>{result.score}%</p>

        {isVideo && result.videoPreview && (
          <video src={result.videoPreview} controls playsInline className="w-full rounded-lg bg-black max-h- mb-4"/>
        )}
        {isVideo && result.videoLink && (
          <div className="bg-[#0a0a1a] p-3 rounded-lg mb-4 break-all text-sm">
            <p className="text-white/50 text-xs">Source:</p>
            <a href={result.videoLink} target="_blank" className="text-violet-400 underline">{result.videoLink}</a>
          </div>
        )}

        <p className="bg-[#0a0a1a] p-4 rounded-lg text-white/80 text-sm break-words">{result.text}</p>
        {result.fileName && <p className="text-xs text-white/40 mt-3">📁 {result.fileName}</p>}
      </div>
    </div>
  );
}
