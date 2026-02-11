import React, { useState, useEffect } from 'react';
import { Lock, X, Send, ArrowRight, Radio, Hash, Calendar, ArrowUpRight, Eye, RefreshCw, Database, Printer, Crosshair, Grid } from 'lucide-react';

interface Letter {
  id: string;
  title: string;
  date: string;
  openDate: string; // ISO date string
  content: string;
  visual?: string; // Image URL
  isLocked: boolean;
  tags: string[];
}

const LETTERS: Letter[] = [
  {
    id: '001',
    title: 'Regarding the Noise',
    date: '12.02.2024',
    openDate: '2023-01-01', 
    content: "My Dear Friend,\n\nThe noise of the city is overwhelming today. I found solace in the smell of old ink. The printing press hums a rhythm that feels more human than the digital pulse we are addicted to.\n\nI hope you are finding your own silence in the static.",
    visual: 'https://picsum.photos/400/300?grayscale&blur=1',
    isLocked: false,
    tags: ['REFLECTION', 'CITY']
  },
  {
    id: '002',
    title: 'Bottle No. 492',
    date: '20.05.2024',
    openDate: '2024-05-20',
    content: "To the Finder,\n\nIf you are reading this, the tide has brought us together. I wrote this while watching the rain hit the concrete. It reminded me that even the hardest surfaces change color when they cry.\n\nKeep safe.",
    visual: 'https://picsum.photos/400/301?grayscale',
    isLocked: false,
    tags: ['DRIFT', 'NATURE']
  },
  {
    id: '003',
    title: 'Future Manifesto',
    date: 'PENDING',
    openDate: '2025-12-31',
    content: "Encrypted content...",
    visual: 'https://picsum.photos/400/302?grayscale',
    isLocked: true,
    tags: ['CLASSIFIED', 'FUTURE']
  }
];

const Sentiments: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [email, setEmail] = useState('');
  const [keyword, setKeyword] = useState('');
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'PROCESSING' | 'TRANSMITTED'>('IDLE');

  const checkLock = (letter: Letter) => {
    // Logic to verify if date has passed
    const now = new Date();
    const unlock = new Date(letter.openDate);
    // If manually set to locked or date is future
    return letter.isLocked || now < unlock;
  };

  const handleOpenLetter = (letter: Letter) => {
    if (checkLock(letter)) return;
    setSelectedLetter(letter);
    setIsDecrypted(false);
    
    // Simulate decryption/printing process
    setTimeout(() => {
      setIsDecrypted(true);
    }, 1200);
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !keyword) return;

    setRequestStatus('PROCESSING');
    setTimeout(() => {
      setRequestStatus('TRANSMITTED');
      setEmail('');
      setKeyword('');
      setTimeout(() => setRequestStatus('IDLE'), 3000);
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-paper dark:bg-noir text-ink dark:text-paper p-8 md:p-12 lg:pl-32 flex flex-col relative overflow-hidden transition-colors duration-500">
      
      <style>{`
        .halftone-pattern {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 4px 4px;
        }
        .noise-static {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Background Grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.1] border-r border-ink/10 dark:border-white/10 transition-opacity"
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Header Section */}
      <header className="mb-20 flex flex-col md:flex-row justify-between items-end border-b border-ink/20 dark:border-white/20 pb-8 relative z-10 transition-colors">
        <div>
          <div className="flex items-center gap-3 text-accent mb-4">
             <Printer size={16} className="animate-pulse-slow" />
             <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Sector: Print / Archive</span>
          </div>
          <h2 className="font-display text-5xl md:text-8xl font-bold tracking-tighter leading-none">
            SENTIMENTS
          </h2>
        </div>
        <div className="text-right mt-8 md:mt-0">
           <div className="font-mono text-xs text-gray-500 mb-2 uppercase tracking-widest">
             Analog Correspondence
           </div>
           <p className="font-serif italic text-lg text-gray-600 dark:text-gray-400 max-w-sm ml-auto">
             "Messages pressed into existence. The permanence of ink against the ephemeral screen."
           </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 relative z-10 h-full border-t border-ink/10 dark:border-white/10 transition-colors">
        
        {/* Left Column: The Galley (List) */}
        <div className="w-full lg:w-2/3 border-r border-ink/10 dark:border-white/10 pr-0 lg:pr-16 pt-12 transition-colors">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink/10 dark:border-white/10">
              <span className="font-mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
                <Database size={12} /> Galley Proofs
              </span>
              <span className="font-mono text-xs text-gray-500 font-mono uppercase">
                Index_Vol_04
              </span>
           </div>

           <div className="space-y-0">
             {LETTERS.map((letter, index) => {
               const locked = checkLock(letter);
               return (
                 <div 
                   key={letter.id}
                   onClick={() => handleOpenLetter(letter)}
                   className={`group relative py-8 border-b border-ink/10 dark:border-white/10 transition-all cursor-pointer ${locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-ink/5 dark:hover:bg-white/5'}`}
                 >
                   {/* Hover Reveal Image Background */}
                   {!locked && letter.visual && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none overflow-hidden mix-blend-multiply dark:mix-blend-screen">
                        <img src={letter.visual} className="w-full h-full object-cover grayscale blur-sm scale-110" alt="" />
                      </div>
                   )}

                   <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 relative z-10 px-4 md:px-0">
                      <div className="font-mono text-xs text-gray-500 w-24 shrink-0">
                        REF_{letter.id}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-display text-3xl md:text-4xl uppercase mb-2 group-hover:text-accent dark:group-hover:text-white transition-colors text-ink dark:text-gray-300">
                          {letter.title}
                        </h4>
                        <div className="flex items-center gap-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                          <span className={`${locked ? 'text-red-700 dark:text-red-900' : 'text-accent'}`}>
                             {locked ? 'ENCRYPTED' : 'READABLE'}
                          </span>
                          <span>•</span>
                          <span>{letter.date}</span>
                          <span>•</span>
                          <span>{letter.tags.join(' + ')}</span>
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <ArrowRight size={20} className={`transform transition-transform duration-300 ${locked ? 'opacity-0' : 'group-hover:translate-x-4 text-ink dark:text-white opacity-0 group-hover:opacity-100'}`} />
                      </div>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Right Column: The Compositor (Request) */}
        <div className="w-full lg:w-1/3 pt-12">
           <div className="sticky top-12 bg-white dark:bg-[#0a0a0a] border border-ink/10 dark:border-white/10 p-8 shadow-2xl transition-colors">
              {/* Technical Registration Marks */}
              <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-l border-t border-accent"></div>
              <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-r border-t border-accent"></div>
              <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-l border-b border-accent"></div>
              <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-r border-b border-accent"></div>

              <div className="mb-8 border-b border-dashed border-ink/20 dark:border-white/20 pb-4">
                 <span className="font-mono text-xs uppercase tracking-widest text-ink dark:text-white flex items-center gap-2">
                   <Grid size={12} /> Compositor Request
                 </span>
                 <p className="font-mono text-[9px] text-gray-500 mt-2 leading-relaxed">
                   SUBMIT PARAMETERS FOR ANALOG GENERATION. THE PRESS REQUIRES A COORDINATE.
                 </p>
              </div>

              {requestStatus === 'TRANSMITTED' ? (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10">
                   <div className="w-12 h-12 bg-accent text-black rounded-full flex items-center justify-center mb-4">
                     <Printer size={20} />
                   </div>
                   <h3 className="font-display text-xl text-ink dark:text-white mb-2">ORDER QUEUED</h3>
                   <p className="font-mono text-[10px] text-gray-500 uppercase">Ticket #{Math.floor(Math.random() * 9000) + 1000}</p>
                </div>
              ) : (
                <form onSubmit={handleRequest} className="space-y-8">
                  <div className="group">
                    <label className="flex justify-between font-mono text-[9px] uppercase text-gray-500 mb-2 group-focus-within:text-accent transition-colors">
                      <span>Recipient Address</span>
                      <span>[REQ]</span>
                    </label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-fog dark:bg-[#050505] border border-ink/20 dark:border-white/20 p-3 font-mono text-xs text-ink dark:text-white focus:outline-none focus:border-accent transition-colors placeholder-gray-400 dark:placeholder-gray-800"
                      placeholder="IDENTITY@VOID.NET"
                    />
                  </div>

                  <div className="group">
                    <label className="flex justify-between font-mono text-[9px] uppercase text-gray-500 mb-2 group-focus-within:text-accent transition-colors">
                      <span>Thematic Anchor</span>
                      <span>[REQ]</span>
                    </label>
                    <input 
                      type="text"
                      required
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full bg-fog dark:bg-[#050505] border border-ink/20 dark:border-white/20 p-3 font-display text-lg text-ink dark:text-white focus:outline-none focus:border-accent transition-colors placeholder-gray-400 dark:placeholder-gray-800 uppercase"
                      placeholder="NOSTALGIA"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={requestStatus === 'PROCESSING'}
                    className="w-full py-4 bg-ink dark:bg-white text-paper dark:text-black hover:bg-accent dark:hover:bg-accent hover:text-white transition-all font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {requestStatus === 'PROCESSING' ? (
                      <span className="animate-pulse">TYPESETTING...</span>
                    ) : (
                      <>
                        <span className="relative z-10">INITIATE PRINT</span> 
                        <ArrowUpRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform"/>
                      </>
                    )}
                  </button>
                </form>
              )}
           </div>
        </div>

      </div>

      {/* Reading Modal (The Proof) */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-paper/95 dark:bg-[#050505]/95 backdrop-blur-md flex items-center justify-center animate-fade-in p-4 md:p-8">
           
           <div className="w-full h-full max-w-5xl relative flex flex-col bg-white dark:bg-[#111] border border-ink/10 dark:border-white/10 shadow-2xl overflow-hidden transition-colors">
              
              {/* Modal Header / Toolbar */}
              <div className="flex justify-between items-center p-6 border-b border-ink/10 dark:border-white/10 bg-fog dark:bg-[#0a0a0a]">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-mono text-xs uppercase text-gray-500">
                      Viewing Proof: {selectedLetter.id}
                    </span>
                 </div>
                 <button 
                  onClick={() => setSelectedLetter(null)}
                  className="text-gray-500 hover:text-ink dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto relative bg-paper dark:bg-[#151515] text-ink dark:text-gray-200 noise-static transition-colors">
                 
                 {!isDecrypted ? (
                    <div className="absolute inset-0 z-20 bg-paper dark:bg-[#151515] flex flex-col items-center justify-center">
                       <div className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4">
                         Transferring to Plate...
                       </div>
                       <div className="w-48 h-[1px] bg-ink/20 dark:bg-gray-800 relative overflow-hidden">
                          <div className="absolute inset-0 bg-accent w-1/2 animate-[marquee_0.8s_linear_infinite]"></div>
                       </div>
                    </div>
                 ) : (
                    <div className="max-w-3xl mx-auto p-12 md:p-20 relative">
                       {/* Crop Marks for Print Feel */}
                       <div className="absolute top-8 left-8 w-4 h-[1px] bg-ink dark:bg-white/20"></div>
                       <div className="absolute top-8 left-8 h-4 w-[1px] bg-ink dark:bg-white/20"></div>
                       <div className="absolute top-8 right-8 w-4 h-[1px] bg-ink dark:bg-white/20"></div>
                       <div className="absolute top-8 right-8 h-4 w-[1px] bg-ink dark:bg-white/20"></div>
                       <div className="absolute bottom-8 left-8 w-4 h-[1px] bg-ink dark:bg-white/20"></div>
                       <div className="absolute bottom-8 left-8 h-4 w-[1px] bg-ink dark:bg-white/20"></div>
                       <div className="absolute bottom-8 right-8 w-4 h-[1px] bg-ink dark:bg-white/20"></div>
                       <div className="absolute bottom-8 right-8 h-4 w-[1px] bg-ink dark:bg-white/20"></div>

                       {/* Metadata Header */}
                       <div className="flex justify-between items-end border-b-2 border-ink dark:border-white/20 pb-6 mb-12">
                          <div>
                             <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.85] mb-2 tracking-tight">
                               {selectedLetter.title}
                             </h1>
                             <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                               Date: {selectedLetter.date} // Archival Copy
                             </span>
                          </div>
                          <div className="hidden md:block">
                             <Printer size={24} className="text-ink dark:text-white opacity-50" />
                          </div>
                       </div>

                       {/* Content Body */}
                       <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                          <div className="md:col-span-7">
                             <p className="font-typewriter text-sm md:text-base leading-loose whitespace-pre-line text-justify text-ink dark:text-gray-300">
                               {selectedLetter.content}
                             </p>
                          </div>
                          
                          <div className="md:col-span-5">
                             {selectedLetter.visual ? (
                               <div className="relative border border-ink dark:border-white/20 p-2 bg-white dark:bg-black rotate-1 shadow-lg">
                                 <div className="absolute inset-0 halftone-pattern opacity-10 pointer-events-none z-10"></div>
                                 <img 
                                   src={selectedLetter.visual} 
                                   alt="Evidence" 
                                   className="w-full h-auto grayscale contrast-125" 
                                 />
                                 <div className="mt-2 font-mono text-[9px] uppercase text-center border-t border-ink/20 dark:border-white/20 pt-1 text-gray-500">
                                   Figure A.
                                 </div>
                               </div>
                             ) : (
                               <div className="w-full aspect-square border border-dashed border-ink/20 dark:border-white/20 flex items-center justify-center p-8 text-center">
                                 <span className="font-mono text-[9px] uppercase text-gray-500">
                                   [No Visual Data Available]
                                 </span>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Footer */}
                       <div className="mt-24 pt-4 border-t border-ink/10 dark:border-white/10 flex justify-between items-center">
                          <div className="flex gap-2">
                             {selectedLetter.tags.map(tag => (
                               <span key={tag} className="font-mono text-[9px] border border-ink/20 dark:border-white/20 px-2 py-1 uppercase bg-white dark:bg-black text-gray-600 dark:text-gray-400">
                                 {tag}
                               </span>
                             ))}
                          </div>
                          <span className="font-serif italic text-xs text-gray-500">
                            Sentiments Archive • Page 1 of 1
                          </span>
                       </div>

                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Sentiments;