import React, { useState } from 'react';
import { IdeaItem } from '../types';
import { Plus, Search, X, Sprout, Leaf, Atom, Wind } from 'lucide-react';

export const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: '1',
    term: 'Nostalgia Futures',
    type: 'NEOLOGISM',
    definition: 'The longing for a future that was promised in the past but never arrived. A specific ache for chrome cities and flying cars that feel vintage before they are even built.',
    etymology: 'Roots: Nostos (return) + Algos (pain) + Future.',
    visual: 'circle'
  },
  {
    id: '2',
    term: 'Velvet Static',
    type: 'REDEFINITION',
    definition: 'Original: Electronic Noise. \nNew Meaning: The comfortable silence shared between two people in a smoky room where nothing needs to be said. The texture of intimacy.',
    etymology: 'Redefined from audio engineering contexts.',
    visual: 'noise'
  },
  {
    id: '3',
    term: 'Brutalist Empathy',
    type: 'NEOLOGISM',
    definition: 'An act of kindness that is raw, unpolished, and structural. It does not comfort with soft lies but supports with hard truths. Like concrete: cold to the touch but bears the weight.',
    etymology: 'Architecture + Psychology.',
    visual: 'square'
  },
  {
    id: '4',
    term: 'Lunar Drip',
    type: 'NEOLOGISM',
    definition: 'The sensation of slowly losing gravity or connection to reality during late-night creative sessions. The slow leak of the soul into the ether.',
    etymology: 'Astronomy slang.',
    visual: 'drop'
  }
];

const Lexicon: React.FC = () => {
  const [ideas, setIdeas] = useState<IdeaItem[]>(INITIAL_IDEAS);
  const [selectedIdea, setSelectedIdea] = useState<IdeaItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'NEOLOGISM' | 'REDEFINITION'>('ALL');

  // Form State
  const [formTerm, setFormTerm] = useState('');
  const [formType, setFormType] = useState<'NEOLOGISM' | 'REDEFINITION'>('NEOLOGISM');
  const [formDef, setFormDef] = useState('');
  const [formEtymology, setFormEtymology] = useState('');

  const handlePlantSeed = () => {
    if (!formTerm || !formDef) return;
    const newIdea: IdeaItem = {
      id: Date.now().toString(),
      term: formTerm,
      type: formType,
      definition: formDef,
      etymology: formEtymology || 'Unknown Origins',
      visual: 'circle'
    };
    setIdeas([newIdea, ...ideas]);
    setIsAdding(false);
    // Reset
    setFormTerm('');
    setFormDef('');
    setFormEtymology('');
  };

  const filteredIdeas = filter === 'ALL' ? ideas : ideas.filter(i => i.type === filter);

  return (
    <div className="w-full min-h-screen bg-noir relative overflow-hidden flex flex-col items-center">
      
      {/* Cenotaph / Spherical Void Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] rounded-full border border-white/5 bg-[radial-gradient(circle,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_70%)] pointer-events-none z-0 shadow-[0_0_100px_rgba(0,0,0,1)]"></div>
      
      {/* Floating Particles/Stars */}
      <div className="absolute inset-0 z-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      <div className="z-10 w-full max-w-6xl p-8 md:p-12 lg:p-24 h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 shrink-0">
          <div>
            <div className="flex items-center gap-3 text-accent mb-2">
              <Sprout className="animate-pulse-slow" size={24} />
              <span className="font-mono text-xs tracking-[0.4em] uppercase">Sector: Eden</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-white mix-blend-difference">
              GARDEN OF<br/>NEW IDEAS
            </h2>
            <p className="font-serif text-xl text-gray-500 italic mt-4 max-w-lg">
              "A laboratory for concepts that do not yet exist, and a sanctuary for words that needed a new soul."
            </p>
          </div>

          <div className="flex gap-4 mt-8 md:mt-0">
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-accent/10 hover:border-accent hover:text-accent transition-all font-mono text-xs uppercase text-gray-400"
            >
              <Plus size={14} /> Plant Seed
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-12 overflow-hidden h-full">
          
          {/* List (Seeds) */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-4 scrollbar-hide pb-24">
            <div className="flex gap-2 mb-4 sticky top-0 bg-noir z-20 py-2">
              <button onClick={() => setFilter('ALL')} className={`text-[10px] font-mono px-2 py-1 border ${filter === 'ALL' ? 'border-accent text-accent' : 'border-transparent text-gray-600'}`}>ALL SPECIES</button>
              <button onClick={() => setFilter('NEOLOGISM')} className={`text-[10px] font-mono px-2 py-1 border ${filter === 'NEOLOGISM' ? 'border-accent text-accent' : 'border-transparent text-gray-600'}`}>NEOLOGISMS</button>
              <button onClick={() => setFilter('REDEFINITION')} className={`text-[10px] font-mono px-2 py-1 border ${filter === 'REDEFINITION' ? 'border-accent text-accent' : 'border-transparent text-gray-600'}`}>GRAFTS</button>
            </div>

            {filteredIdeas.map(idea => (
              <button 
                key={idea.id}
                onClick={() => setSelectedIdea(idea)}
                className={`group text-left p-6 border transition-all duration-500 relative overflow-hidden ${selectedIdea?.id === idea.id ? 'border-accent bg-accent/5' : 'border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-mono text-[9px] uppercase tracking-wider ${selectedIdea?.id === idea.id ? 'text-accent' : 'text-gray-600'}`}>
                    {idea.type}
                  </span>
                  {idea.type === 'NEOLOGISM' ? <Atom size={12} className="text-gray-600"/> : <Leaf size={12} className="text-gray-600"/>}
                </div>
                <h3 className={`font-serif text-2xl transition-colors ${selectedIdea?.id === idea.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {idea.term}
                </h3>
                {selectedIdea?.id === idea.id && (
                  <div className="absolute right-0 bottom-0 opacity-10">
                     <Wind size={64} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Detail (Bloom) */}
          <div className="w-full md:w-2/3 h-full relative border-l border-white/5 md:pl-12 flex flex-col justify-center">
            {selectedIdea ? (
              <div className="animate-fade-in relative">
                {/* Background Symbol */}
                <div className="absolute -top-20 -left-20 opacity-[0.03] text-white pointer-events-none select-none font-display text-[200px] leading-none">
                  {selectedIdea.term.charAt(0)}
                </div>

                <div className="mb-8">
                  <span className="font-mono text-xs text-accent border border-accent/30 px-2 py-1 inline-block mb-4">
                    CATALOG_ID: {selectedIdea.id.padStart(4, '0')}
                  </span>
                  <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-white mb-8 mix-blend-screen">
                    {selectedIdea.term}
                  </h1>
                </div>

                <div className="prose prose-invert max-w-2xl">
                  <p className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-200 border-l-2 border-accent pl-6 italic">
                    {selectedIdea.definition}
                  </p>
                  
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <h4 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Root System (Etymology)</h4>
                    <p className="font-mono text-sm text-gray-400">
                      {selectedIdea.etymology}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-700 opacity-50">
                <div className="w-32 h-32 border border-dashed border-gray-700 rounded-full flex items-center justify-center mb-4 animate-spin-slow">
                  <Atom size={32} />
                </div>
                <p className="font-mono text-xs tracking-widest uppercase">Select a specimen to analyze</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0a0a0a] border border-white/10 p-8 md:p-12 relative animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button 
              onClick={() => setIsAdding(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <h3 className="font-display text-2xl text-white mb-2">Cultivate Idea</h3>
            <p className="font-mono text-xs text-gray-500 mb-8 uppercase">Add to the Library of Alexandria</p>

            <div className="space-y-6">
              <div className="flex gap-4">
                 <button 
                  onClick={() => setFormType('NEOLOGISM')}
                  className={`flex-1 py-2 font-mono text-xs border ${formType === 'NEOLOGISM' ? 'border-accent text-accent' : 'border-white/10 text-gray-500'}`}
                 >
                   NEW SPECIES (NEOLOGISM)
                 </button>
                 <button 
                  onClick={() => setFormType('REDEFINITION')}
                  className={`flex-1 py-2 font-mono text-xs border ${formType === 'REDEFINITION' ? 'border-accent text-accent' : 'border-white/10 text-gray-500'}`}
                 >
                   GRAFT (REDEFINITION)
                 </button>
              </div>

              <input 
                value={formTerm}
                onChange={(e) => setFormTerm(e.target.value)}
                placeholder="The Term..."
                className="w-full bg-transparent border-b border-white/20 py-2 font-display text-2xl text-white focus:outline-none focus:border-accent placeholder-gray-700"
              />

              <textarea 
                value={formDef}
                onChange={(e) => setFormDef(e.target.value)}
                placeholder="The Meaning (Poetic/Technical)..."
                className="w-full h-32 bg-white/5 border border-white/10 p-4 font-serif text-lg text-gray-300 focus:outline-none focus:border-accent placeholder-gray-700 resize-none"
              />

              <input 
                value={formEtymology}
                onChange={(e) => setFormEtymology(e.target.value)}
                placeholder="Origins / Roots..."
                className="w-full bg-transparent border-b border-white/20 py-2 font-mono text-xs text-gray-400 focus:outline-none focus:border-accent placeholder-gray-700"
              />

              <button 
                onClick={handlePlantSeed}
                className="w-full py-4 bg-white text-black font-display uppercase tracking-widest hover:bg-accent transition-colors"
              >
                Bloom
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Lexicon;