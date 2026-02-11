import React, { useState, useEffect } from 'react';
import { Project, IdeaItem } from '../types';
import { generateVisionConcept } from '../services/geminiService';
import { INITIAL_IDEAS } from './Lexicon'; 
import { ArrowRight, Plus, X, Maximize2, Share2, Check, ArrowUpRight, BookOpen, Link, Layers, Orbit } from 'lucide-react';

const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'THE SILENT TOWER',
    category: 'Architecture',
    description: 'A residential concept focusing on acoustic isolation in mega-cities.',
    details: "A monolith of acoustic silence rising above the cacophony of the metropolis. Constructed from sound-absorbing concrete composites, this tower serves as a sanctuary. It is an exercise in Brutalist Empathy—providing a structure that does not comfort with soft lies but supports the inhabitant with hard, silent truths. The exterior rejects visual noise, offering a blank canvas for the rain.",
    imageUrl: 'https://picsum.photos/800/600?grayscale',
  },
  {
    id: 'p2',
    title: 'EPOCH 01',
    category: 'Art',
    description: 'Sculptural series exploring the degradation of plastic over 1000 years.',
    details: "An ongoing study of permanence and decay. This series documents the slow degradation of synthetic materials. It embodies Nostalgia Futures, questioning the legacy of the materials we once thought would define a chrome-plated tomorrow. Each piece is a fossil of the Anthropocene, twisting into organic shapes that challenge our perception of natural versus artificial.",
    imageUrl: 'https://picsum.photos/800/601?grayscale',
  },
  {
    id: 'p3',
    title: 'OBSERVATORY X',
    category: 'Architecture',
    description: 'A brutalist retreat carved into a cliffside.',
    details: "Carved directly into the basalt cliffs of Iceland, Observatory X is a place for solitary reckoning. As night falls, the inhabitant experiences Lunar Drip—the slow sensation of losing gravity and connection to reality as the ocean merges with the sky. The structure forces a confrontation with the sheer indifference of nature.",
    imageUrl: 'https://picsum.photos/800/602?grayscale',
  },
  {
    id: 'p4',
    title: 'LIFE FRAME',
    category: 'Life',
    description: 'The photography of mundane moments turned monumental.',
    details: "A photographic archive of the mundane turned monumental. By framing everyday objects—a coffee cup, a cracked pavement—we create a sense of Velvet Static between the viewer and the subject. It is the texture of intimacy found in silence, elevating the ordinary to the sacred through the act of pure observation.",
    imageUrl: 'https://picsum.photos/800/603?grayscale',
  }
];

const Vision: React.FC = () => {
  const [visionPrompt, setVisionPrompt] = useState('');
  const [aiVision, setAiVision] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeLexiconTerm, setActiveLexiconTerm] = useState<IdeaItem | null>(null);
  const [highlightedCards, setHighlightedCards] = useState<Set<string>>(new Set());

  // Handle Scroll Lock when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setActiveLexiconTerm(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGenerate = async () => {
    if (!visionPrompt) return;
    setGenerating(true);
    const result = await generateVisionConcept(visionPrompt);
    setAiVision(result);
    setGenerating(false);
  };

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const link = `${window.location.href.split('?')[0]}?project=${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCardHighlight = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHighlightedCards(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
  };

  const renderTextWithLexicon = (text: string) => {
    if (!text) return null;
    const sortedTerms = [...INITIAL_IDEAS].sort((a, b) => b.term.length - a.term.length);
    const pattern = new RegExp(`(${sortedTerms.map(i => i.term).join('|')})`, 'gi');
    const parts = text.split(pattern);

    return parts.map((part, index) => {
      const matchedTerm = INITIAL_IDEAS.find(i => i.term.toLowerCase() === part.toLowerCase());
      if (matchedTerm) {
        return (
          <span 
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setActiveLexiconTerm(matchedTerm);
            }}
            className="text-accent cursor-pointer border-b border-dashed border-accent hover:bg-accent hover:text-black transition-all duration-300 relative group z-20"
            title="Click to decode definition"
          >
            {part}
            <span className="inline-block align-top text-[8px] ml-0.5 opacity-70"><BookOpen size={8} /></span>
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#e8e6e1] relative flex flex-col p-8 md:p-12 lg:pl-32 pb-32">
      
      {/* Background Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }}></div>

      {/* Header */}
      <div className="shrink-0 z-10 flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b border-white/20 pb-8">
        <div>
          <h2 className="font-display text-5xl md:text-8xl uppercase tracking-tighter">Studio Vision</h2>
          <p className="font-mono text-xs text-gray-500 mt-2 uppercase tracking-[0.3em]">
             Sector 4: Conceptual Fabrication
          </p>
        </div>
        
        {/* Mini AI Tool */}
        <div className="hidden lg:flex flex-col w-96 bg-white/5 p-4 border border-white/10 backdrop-blur-sm mt-8 md:mt-0">
           <label className="font-mono text-[10px] uppercase text-accent mb-2">AI Architect</label>
           <div className="flex gap-2">
             <input 
              type="text" 
              value={visionPrompt}
              onChange={(e) => setVisionPrompt(e.target.value)}
              placeholder="Input parameters..." 
              className="bg-transparent border-b border-gray-600 text-sm w-full focus:outline-none focus:border-white pb-1 font-mono"
             />
             <button onClick={handleGenerate} disabled={generating}>
               {generating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : <Plus size={16}/>}
             </button>
           </div>
           {aiVision && (
             <p className="mt-3 text-xs text-gray-300 font-mono leading-snug animate-fade-in border-l border-accent pl-2">"{aiVision}"</p>
           )}
        </div>
      </div>

      {/* Levitating Grid Layout */}
      <div className="space-y-32 max-w-7xl mx-auto w-full">
        {PROJECTS.map((project, index) => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            className={`group relative w-full flex flex-col md:flex-row gap-12 items-center cursor-pointer ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* The Visual Plate */}
            <div className="w-full md:w-1/2 aspect-[4/3] relative">
               <div className="absolute inset-0 border border-white/20 transition-all duration-500 group-hover:border-accent group-hover:scale-105 z-10"></div>
               <div className="w-full h-full overflow-hidden bg-gray-900 relative">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0"
                  />
                  
                  {/* Technical Overlays */}
                  <div className="absolute top-4 left-4 font-mono text-[9px] bg-black text-white px-1 z-20">FIG {index + 1}.0</div>
                  <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Maximize2 size={24} className="text-white drop-shadow-lg" />
                  </div>
               </div>
               {/* Shadow for levitation effect */}
               <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/50 blur-xl rounded-full transition-all duration-500 group-hover:w-[90%] group-hover:bg-accent/20"></div>
            </div>

            {/* The Data Plate */}
            <div className="w-full md:w-1/2 md:px-12">
               <div className="border-l border-white/20 pl-6 group-hover:border-accent transition-colors duration-500">
                 <span className="font-mono text-accent text-xs tracking-widest mb-2 block">{project.category.toUpperCase()}</span>
                 <h3 className="font-display text-4xl md:text-5xl text-white mb-6 leading-none">{project.title}</h3>
                 
                 <p className="font-serif text-xl text-gray-400 leading-relaxed mb-8 group-hover:text-gray-200 transition-colors">
                   {highlightedCards.has(project.id) ? renderTextWithLexicon(project.description) : project.description}
                 </p>

                 <div className="flex flex-wrap items-center gap-6 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-2 font-mono text-xs uppercase hover:text-accent transition-colors">
                       <ArrowUpRight size={14} /> View Schematics
                    </button>
                    <button 
                        onClick={(e) => toggleCardHighlight(e, project.id)}
                        className={`flex items-center gap-2 font-mono text-xs uppercase hover:text-accent transition-colors ${highlightedCards.has(project.id) ? 'text-accent' : ''}`}
                    >
                       <Link size={14} /> {highlightedCards.has(project.id) ? 'Disconnect' : 'Connect'}
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, project.id)}
                      className="flex items-center gap-2 font-mono text-xs uppercase hover:text-accent transition-colors"
                    >
                       <Share2 size={14} /> Share
                    </button>
                    {copiedId === project.id && (
                      <span className="font-mono text-[10px] text-accent animate-fade-in">
                        COPIED
                      </span>
                    )}
                 </div>
               </div>
            </div>

          </div>
        ))}
      </div>

      {/* Global Lexicon Definition Popup (When no modal is open) */}
      {activeLexiconTerm && !selectedProject && (
        <div className="fixed bottom-8 right-8 z-[70] max-w-sm w-full bg-[#0a0a0a]/90 backdrop-blur-md border border-accent p-6 animate-fade-in shadow-[0_0_50px_rgba(201,160,80,0.2)]">
          <button 
            onClick={() => setActiveLexiconTerm(null)}
            className="absolute top-4 right-4 text-accent/50 hover:text-accent"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent text-black rounded-full shrink-0">
               <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] uppercase text-accent tracking-widest">
                  LEXICON ENTRY
                </span>
                <span className="font-mono text-[10px] text-gray-500 border border-gray-600 px-1 rounded">
                  {activeLexiconTerm.type}
                </span>
              </div>
              <h4 className="font-display text-2xl text-white mb-2">{activeLexiconTerm.term}</h4>
              <p className="font-serif text-lg text-gray-300 italic mb-4">
                {activeLexiconTerm.definition}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedProject(null);
              setActiveLexiconTerm(null);
            }
          }}
        >
          <button 
            onClick={() => {
              setSelectedProject(null);
              setActiveLexiconTerm(null);
            }}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2 border border-transparent hover:border-white/20 rounded-full bg-black/20 backdrop-blur-md"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-7xl h-[85vh] bg-[#0a0a0a] border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative animate-fade-in ring-1 ring-white/10">
            {/* Modal Image */}
            <div className="w-full md:w-1/2 h-1/3 md:h-full relative overflow-hidden bg-gray-900 group">
              <img 
                src={selectedProject.imageUrl} 
                alt={selectedProject.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] ease-in-out scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r pointer-events-none opacity-80" />
              <div className="absolute bottom-6 left-6 font-mono text-xs text-white/70 bg-black/60 backdrop-blur px-3 py-1 border border-white/10">
                REF_ID: {selectedProject.id.toUpperCase()} // {selectedProject.category.toUpperCase()}
              </div>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto flex flex-col justify-center scrollbar-hide relative bg-[#0a0a0a]">
              {/* Abstract Background Icon */}
              <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none transform rotate-12">
                 <Maximize2 size={300} strokeWidth={0.5} />
              </div>

              <div className="relative z-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <span className="font-mono text-accent text-xs tracking-[0.3em] mb-6 block border-b border-white/10 pb-4 w-fit">
                  PROJECT ARCHIVE
                </span>
                
                <h2 className="font-display text-4xl md:text-6xl mb-8 leading-none text-white mix-blend-difference">
                  {selectedProject.title}
                </h2>
                
                <p className="font-serif text-xl md:text-3xl text-gray-300 leading-relaxed mb-12 italic border-l-2 border-accent pl-6">
                  "{renderTextWithLexicon(selectedProject.description)}"
                </p>
                
                <div className="space-y-8 bg-white/5 p-6 border border-white/5 rounded-sm">
                   <h4 className="font-mono text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                     <Check size={12} className="text-accent" /> Specifications & Narrative
                   </h4>
                   <p className="font-sans text-gray-400 leading-8 text-sm md:text-lg font-light text-justify">
                     {selectedProject.details ? renderTextWithLexicon(selectedProject.details) : "Details classified."}
                   </p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
                  <button className="px-8 py-3 bg-white text-black hover:bg-accent hover:text-black transition-all font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                    VIEW BLUEPRINTS <ArrowRight size={14} />
                  </button>
                  <button 
                    onClick={(e) => handleShare(e, selectedProject.id)}
                    className="px-8 py-3 border border-white/20 hover:bg-white/10 transition-all font-mono text-xs uppercase tracking-widest flex items-center gap-2"
                  >
                    SHARE CONCEPT <Share2 size={14} />
                  </button>
                  {copiedId === selectedProject.id && (
                    <span className="text-accent text-xs font-mono animate-fade-in self-center">LINK COPIED</span>
                  )}
                </div>
              </div>

              {activeLexiconTerm && (
                <div className="absolute bottom-0 left-0 w-full bg-accent/10 backdrop-blur-md border-t border-accent p-8 animate-fade-in shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
                  <button 
                    onClick={() => setActiveLexiconTerm(null)}
                    className="absolute top-4 right-4 text-accent/50 hover:text-accent"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent text-black rounded-full">
                       <BookOpen size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] uppercase text-accent tracking-widest">
                          LEXICON ENTRY DETECTED
                        </span>
                        <span className="font-mono text-[10px] text-gray-500 border border-gray-600 px-1 rounded">
                          {activeLexiconTerm.type}
                        </span>
                      </div>
                      <h4 className="font-display text-2xl text-white mb-2">{activeLexiconTerm.term}</h4>
                      <p className="font-serif text-lg text-gray-300 italic mb-4">
                        {activeLexiconTerm.definition}
                      </p>
                    </div>
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

export default Vision;