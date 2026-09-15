import { useState, useEffect } from "react";

const T: any = {
  fr: { detector:"Detecteur", history:"Historique", settings:"Parametres", title:"DetectAI Omega", sub:"Multi-IA: ChatGPT, Claude, Gemini, Mistral", text:"Texte", video:"Video", file:"Fichier", link:"Lien", phText:"Colle ton texte ici (examen, memoire, article...) - 80 mots min pour rapport precis", phLink:"https://tiktok.com/...", launch:"Lancer l'analyse", analyzing:"Analyse forensique Multi-IA...", verdict:"Verdict Final", why:"Rapport forensique detaille", back:"Retour", appearance:"Apparence", dark:"Sombre", light:"Clair", language:"Langue", saved:"Change!", minChar:"30 caracteres min", chooseVid:"Choisis video", pasteLink:"Colle lien", scoreHigh:"IA Tres Probable", scoreMid:"Probablement IA", scoreLow:"Humain Probable", profile:"Mon profil", clearHist:"Vider", noHist:"Aucune analyse", view:"Voir", delete:"Suppr", analyses:"analyses", personalInfo:"Infos perso", name:"Nom", email:"Email", plan:"Plan", evidence:"Preuve concrete", tech:"Analyse technique", impact:"Poids" },
  en: { detector:"Detector", history:"History", settings:"Settings", title:"DetectAI Omega", sub:"Multi-AI: ChatGPT, Claude, Gemini, Mistral", text:"Text", video:"Video", file:"File", link:"Link", phText:"Paste your text here (exam, essay, article) - 80 words min", phLink:"https://tiktok.com/...", launch:"Run analysis", analyzing:"Multi-AI forensic...", verdict:"Final Verdict", why:"Detailed forensic report", back:"Back", appearance:"Appearance", dark:"Dark", light:"Light", language:"Language", saved:"Changed!", minChar:"30 chars min", chooseVid:"Choose video", pasteLink:"Paste link", scoreHigh:"Very Likely AI", scoreMid:"Probably AI", scoreLow:"Probably Human", profile:"My profile", clearHist:"Clear", noHist:"No analysis", view:"View", delete:"Del", analyses:"analyses", personalInfo:"Personal info", name:"Name", email:"Email", plan:"Plan", evidence:"Concrete evidence", tech:"Technical analysis", impact:"Weight" },
  es: { detector:"Detector", history:"Historial", settings:"Config", title:"DetectAI Omega", sub:"Multi-IA: ChatGPT, Claude, Gemini, Mistral", text:"Texto", video:"Video", file:"Archivo", link:"Enlace", phText:"Pega tu texto aqui...", phLink:"https://tiktok.com/...", launch:"Iniciar analisis", analyzing:"Analizando...", verdict:"Veredicto Final", why:"Informe forense", back:"Volver", appearance:"Apariencia", dark:"Oscuro", light:"Claro", language:"Idioma", saved:"Cambiado!", minChar:"30 caracteres", chooseVid:"Elige video", pasteLink:"Pega enlace", scoreHigh:"Muy Probable IA", scoreMid:"Probablemente IA", scoreLow:"Humano", profile:"Perfil", clearHist:"Borrar", noHist:"Sin analisis", view:"Ver", delete:"Borrar", analyses:"analisis", personalInfo:"Info personal", name:"Nombre", email:"Email", plan:"Plan", evidence:"Prueba concreta", tech:"Tecnica", impact:"Peso" },
  ar: { detector:"الكاشف", history:"السجل", settings:"الاعدادات", title:"DetectAI Omega", sub:"Multi-AI", text:"نص", video:"فيديو", file:"ملف", link:"رابط", phText:"الصق النص...", phLink:"https://tiktok.com/...", launch:"بدء التحليل", analyzing:"جاري التحليل...", verdict:"الحكم النهائي", why:"تقرير مفصل", back:"رجوع", appearance:"المظهر", dark:"داكن", light:"فاتح", language:"اللغة", saved:"تم!", minChar:"30 حرفا", chooseVid:"اختر فيديو", pasteLink:"الصق رابطا", scoreHigh:"ذكاء اصطناعي محتمل", scoreMid:"ربما IA", scoreLow:"بشري", profile:"ملفي", clearHist:"مسح", noHist:"لا يوجد", view:"عرض", delete:"حذف", analyses:"تحليل", personalInfo:"معلومات", name:"الاسم", email:"البريد", plan:"الخطة", evidence:"دليل", tech:"تقني", impact:"تأثير" },
};

function analyzeDeep(text: string, type: string, link: string, file: File|null, lang:string){
  const reasons:any[]=[]; let score=25;
  const lower=text.toLowerCase();
  const words=text.split(/\s+/).filter((w:string)=>w.length>2);
  const sentences=text.split(/[.!?]+/).filter((s:string)=>s.trim().length>15);

  if(type==="text"){

    // 1 - STRUCTURE TROP PARFAITE (vrai signal IA, pas le "bah")
    const avgLen=words.length/sentences.length||12;
    const paras=text.split("\n\n").length;
    const hasPerfectStructure = paras>=3 && sentences.length>=5 && avgLen>14 && avgLen<22;
    
    if(hasPerfectStructure && text.length>300){
      score+=15;
      reasons.push({
        title: lang==="fr"?"1. Structure d'IA - Trop equilibree":"1. AI Structure - Too balanced",
        level:"SUSPECT", color:"bg-orange-500",
        short: lang==="fr"?`${paras} paragraphes parfaits de ${Math.round(avgLen)} mots chacun`:`${paras} perfect paragraphs of ${Math.round(avgLen)} words each`,
        detail: lang==="fr"
          ? `Un humain en examen ecrit 1 gros paragraphe de 120 mots, puis un petit de 30 mots, c'est brouillon. Toi, tu as ${paras} paragraphes qui font tous entre 60 et 90 mots, avec une intro, 2-3 developpements, une conclusion. C'est la structure exacte que ChatGPT, Claude et Gemini utilisent par defaut. Un humain est plus chaotique, meme en examen.`
          : `Human in exam writes 1 big paragraph 120 words, then small 30 words, messy. You have ${paras} paragraphs all 60-90 words, intro, 2-3 body, conclusion. Exact structure ChatGPT, Claude, Gemini use by default.`,
        tech:`Paragraphes: ${paras} / Phrases: ${sentences.length} / Moyenne: ${avgLen.toFixed(1)} mots/phrase = structure IA academique`,
        evidence:`Texte de ${text.length} chars avec structure intro-dev-conclusion parfaite`,
        impact:"+15%"
      });
    }

    // 2 - MARQUEURS MULTI-IA (pas que ChatGPT)
    const aiMarkers=[
      {p:"en tant que modele de langage", ia:"ChatGPT / Mistral"},
      {p:"en tant qu'intelligence artificielle", ia:"ChatGPT / Claude"},
      {p:"il est important de noter", ia:"ChatGPT / Gemini"},
      {p:"il convient de souligner", ia:"Claude / Gemini - tres formel"},
      {p:"il est essentiel de", ia:"Claude / Gemini"},
      {p:"en conclusion", ia:"Toutes les IA"},
      {p:"dans un monde en constante evolution", ia:"ChatGPT / Gemini"},
      {p:"plongee en profondeur", ia:"Gemini"},
      {p:"tapisserie", ia:"Claude - mot prefere de Claude"},
      {p:"en tant qu'ia", ia:"Toutes IA"},
      {p:"as an ai language model", ia:"ChatGPT"},
      {p:"as an ai", ia:"ChatGPT / Claude"}
    ];
    const found=aiMarkers.find(m=>lower.includes(m.p));
    if(found){
      score+=28;
      reasons.push({
        title: lang==="fr"?`2. Signature ${found.ia} detectee`:`2. ${
