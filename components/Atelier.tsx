import React, { useState } from 'react';
import { Artwork } from '../types';
import { Palette, Maximize2, X, Brush, Mountain, Book } from 'lucide-react';

const MOCK_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Study of Hands (Midnight)',
    type: 'SKETCHBOOK',
    date: '2024-10-15',
    image: 'https://picsum.photos/600/800?grayscale',
    description: 'Charcoal on rough paper. The anatomy of gripping onto nothing.'
  },
  {
    id: '2',
    title: 'The Blue Hour',
    type: 'PLEIN_AIR',
    date: '2024-11-02',
    image: 'https://picsum.photos/800/600?blur=2',
    description: 'Painted on location at 4 AM. The cold affects the brushstrokes.'
  },
  {
    id: '3',
    title: 'Entropy Vol. 2',
    type: 'CANVAS',
    date: '2024-12-10',
    image: 'https://picsum.photos/600/600?grayscale',
    description: 'Oil and acrylic. A study in destruction.'
  },
  {
    id: '4',
    title: 'Cafe Fragment',
    type: 'SKETCHBOOK',
    date: '2025-01-05',
    image: 'https://picsum.photos/600/900?grayscale',
    description: 'Ink spill turned into a face.'
  },
  {
    id: '5',
    title: 'Studio Floor Texture',
    type: 'PROCESS',
    date: '2025-01-20',
    image: 'https://picsum.photos/800/1200?grayscale',
    description: 'The mess is the art. Paint splatters as constellations.'
  }
];

const Atelier: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'SKETCHBOOK' | 'CANVAS' | 'PLEIN_AIR' | 'PROCESS'>('ALL');
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);

  const filteredArt = filter === 'ALL' ? MOCK_ARTWORKS : MOCK_ARTWORKS.filter(art => art.type === filter);

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] text-paper p-8 md:p-12 lg:pl-32">
      {/* Header */}
      <header className="mb-16 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
        <div>
          <h2 className="font-display text-5xl md:text-8xl text-white">ATELIER</h2>
          <p className="font-serif text-xl text-gray-400 mt-2 italic">
            "The sanctuary of the hand. Where the mind bleeds onto the page."
          </p>
        </div>
        
        <div className="flex gap-2 mt-8 md:mt-0 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 font-mono text-xs border transition-all whitespace-nowrap ${filter === 'ALL' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-500 hover:text-white'}`}
          >
            ALL WORKS
          </button>
          <button 
            onClick={() => setFilter('SKETCHBOOK')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs border transition-all whitespace-nowrap ${filter === 'SKETCHBOOK' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-500 hover:text-white'}`}
          >
            <Book size={12} /> SKETCHES
          </button>
          <button 
            onClick={() => setFilter('CANVAS')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs border transition-all whitespace-nowrap ${filter === 'CANVAS' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-500 hover:text-white'}`}
          >
            <Palette size={12} /> CANVAS
          </button>
          <button 
            onClick={() => setFilter('PLEIN_AIR')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs border transition-all whitespace-nowrap ${filter === 'PLEIN_AIR' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-500 hover:text-white'}`}
          >
            <Mountain size={12} /> PLEIN AIR
          </button>
          <button 
            onClick={() => setFilter('PROCESS')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs border transition-all whitespace-nowrap ${filter === 'PROCESS' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-500 hover:text-white'}`}
          >
            <Brush size={12} /> PROCESS
          </button>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {filteredArt.map((art) => (
          <div 
            key={art.id} 
            className="break-inside-avoid relative group cursor-pointer"
            onClick={() => setSelectedArt(art)}
          >
            <div className="overflow-hidden bg-black">
              <img 
                src={art.image} 
                alt={art.title} 
                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out hover:scale-105 opacity-80 group-hover:opacity-100" 
              />
            </div>
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
               <Maximize2 className="text-white" size={32} />
            </div>

            <div className="mt-2 flex justify-between items-start opacity-50 group-hover:opacity-100 transition-opacity">
               <h3 className="font-display text-lg leading-none">{art.title}</h3>
               <span className="font-mono text-[9px] border border-white/20 px-1">{art.type}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedArt && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in">
          <button 
            onClick={() => setSelectedArt(null)}
            className="absolute top-8 right-8 text-white hover:text-accent transition-colors"
          >
            <X size={32} />
          </button>

          <div className="flex flex-col md:flex-row max-w-7xl w-full h-[90vh]">
            <div className="w-full md:w-3/4 h-full flex items-center justify-center bg-[#050505]">
              <img 
                src={selectedArt.image} 
                alt={selectedArt.title} 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
            <div className="w-full md:w-1/4 p-8 border-l border-white/10 flex flex-col justify-center">
              <span className="font-mono text-accent text-xs mb-4">{selectedArt.date}</span>
              <h2 className="font-display text-4xl mb-6">{selectedArt.title}</h2>
              <div className="w-12 h-1 bg-white mb-6"></div>
              <p className="font-serif text-xl text-gray-400 italic">
                "{selectedArt.description}"
              </p>
              <div className="mt-auto pt-8">
                <span className="font-mono text-[9px] text-gray-600 block mb-2">CATEGORY</span>
                <span className="font-mono text-sm border border-white/30 px-3 py-1 inline-block">{selectedArt.type}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-32 border-t border-white/5 pt-8 text-center">
         <p className="font-mono text-xs text-gray-600">RAW • UNFILTERED • CREATION</p>
      </div>
    </div>
  );
};

export default Atelier;