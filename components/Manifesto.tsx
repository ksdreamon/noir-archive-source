import React, { useState } from 'react';
import { analyzeManifesto } from '../services/geminiService';
import { Sparkles, Edit3 } from 'lucide-react';

const Manifesto: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [manifestoText, setManifestoText] = useState(`I exist in the spaces\nbetween distinct\ndefinitions.`);
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeManifesto(manifestoText);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#e8e6e1] text-[#050505] relative overflow-hidden flex flex-col justify-between p-6 md:p-12">
      
      {/* Background Typography Mesh */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none opacity-5">
         <span className="absolute top-[-10%] left-[-10%] font-display font-bold text-[40vw] leading-none text-black rotate-12">NOIR</span>
         <span className="absolute bottom-[-10%] right-[-10%] font-display font-bold text-[30vw] leading-none text-black -rotate-6">ARCHIVE</span>
      </div>

      {/* Magazine Header */}
      <header className="relative z-10 flex justify-between items-start border-b-2 border-black pb-4">
        <div className="flex flex-col">
           <h1 className="font-display text-4xl md:text-7xl font-bold tracking-tighter leading-none">THE<br/>MANIFESTO</h1>
           <span className="font-mono text-xs mt-2 uppercase tracking-widest">Vol. IV — The Poetics of Void</span>
        </div>
        <div className="hidden md:block text-right font-serif italic text-sm">
           <p>An exploration of<br/>memory, architecture,<br/>and digital silence.</p>
        </div>
      </header>

      {/* Main Content Area - Hypergraphic Layout */}
      <div className="flex-1 relative flex flex-col md:flex-row items-center justify-center my-12">
        
        {/* Giant Main Text */}
        <div className="relative w-full md:w-2/3 group">
           {isEditing ? (
             <textarea
              value={manifestoText}
              onChange={(e) => setManifestoText(e.target.value)}
              className="w-full h-[60vh] bg-transparent text-5xl md:text-8xl font-display font-bold uppercase leading-[0.85] tracking-tight focus:outline-none resize-none placeholder-gray-400 mix-blend-multiply text-black"
             />
           ) : (
            <h2 className="text-6xl md:text-[9rem] font-display font-bold uppercase leading-[0.85] tracking-tight mix-blend-multiply text-black break-words whitespace-pre-line">
              {manifestoText}
            </h2>
           )}
           
           <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-0 right-0 p-2 text-black/50 hover:text-black transition-colors"
            >
              <Edit3 size={24} />
           </button>
        </div>

        {/* Sidebar / Analysis */}
        <div className="w-full md:w-1/3 md:pl-12 mt-12 md:mt-0 flex flex-col justify-end h-full">
           <div className="border-t border-black pt-4 mb-8">
             <p className="font-mono text-[10px] uppercase tracking-widest mb-2">Editorial Note</p>
             <p className="font-serif text-xl leading-relaxed">
               "We build to dismantle. We write to forget. Every project is a chapter, every failure a cornerstone."
             </p>
           </div>

           <div className="bg-black text-[#e8e6e1] p-6 relative">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors mb-4"
              >
               <Sparkles size={12} /> {loading ? "Analyzing Essence..." : "Ask the Oracle"}
              </button>
              
              {analysis && (
                <div className="animate-fade-in">
                  <p className="font-sans text-sm leading-6 opacity-90">{analysis}</p>
                </div>
              )}
              
              {/* Decorative elements */}
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-black"></div>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 flex justify-between items-end border-t-2 border-black pt-4">
         <div className="font-mono text-[10px] uppercase">
            Fig. 01 — Self Definition
         </div>
         <div className="font-display text-4xl font-bold opacity-20">
            2025
         </div>
      </footer>

    </div>
  );
};

export default Manifesto;