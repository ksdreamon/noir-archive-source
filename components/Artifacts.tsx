import React from 'react';
import { Artifact } from '../types';
import { ShoppingBag, Lock } from 'lucide-react';

const ARTIFACTS: Artifact[] = [
  {
    id: 'a1',
    title: 'The Blue Letter',
    type: 'LETTER',
    status: 'AVAILABLE',
    price: '150.00 USD',
    description: 'Handwritten correspondence on archival paper. Contains truths about the sea.',
    image: 'https://picsum.photos/400/500?grayscale'
  },
  {
    id: 'a2',
    title: 'Void Painting No. 5',
    type: 'PAINTING',
    status: 'SOLD',
    price: '—',
    description: 'Acrylic on raw canvas. 100x120cm. A study of absence.',
    image: 'https://picsum.photos/400/501?grayscale'
  },
  {
    id: 'a3',
    title: 'Collected Poetry Vol. 1',
    type: 'OBJECT',
    status: 'FUTURE',
    description: 'A physical manifestation of digital thoughts. Leather bound.',
    image: 'https://picsum.photos/400/502?grayscale'
  }
];

const Artifacts: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0a0a0a] text-noir dark:text-gray-200 p-8 md:p-12 lg:pl-32 flex flex-col transition-colors duration-500">
       <header className="mb-20 flex flex-col md:flex-row justify-between items-end border-b-2 border-noir dark:border-white/20 pb-8">
        <div>
          <h2 className="font-display text-5xl md:text-7xl font-bold">ARTIFACTS</h2>
          <p className="font-serif text-lg text-gray-600 dark:text-gray-400 mt-2">Acquire pieces of the creator's soul.</p>
        </div>
        <div className="font-mono text-xs text-right mt-4 md:mt-0 text-gray-500 dark:text-gray-500">
          CURATED COLLECTION<br/>
          LIMITED EDITIONS ONLY
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
        {ARTIFACTS.map((item) => (
          <div key={item.id} className="group relative">
            {/* Image Container */}
            <div className="bg-gray-100 dark:bg-[#111] aspect-[4/5] mb-6 overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out" 
              />
              
              {/* Status Overlay */}
              <div className="absolute top-4 left-4">
                 <span className={`font-mono text-[10px] px-2 py-1 border ${
                   item.status === 'AVAILABLE' ? 'border-noir bg-white text-noir' : 'border-gray-400 bg-gray-200 text-gray-500'
                 }`}>
                   {item.status}
                 </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-2xl mb-1 group-hover:text-accent transition-colors text-noir dark:text-gray-100">{item.title}</h3>
                <p className="font-sans text-sm text-gray-500 max-w-[200px]">{item.description}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm mb-3 text-noir dark:text-gray-300">{item.price || 'XXX'}</p>
                
                {item.status === 'AVAILABLE' ? (
                  <button className="flex items-center gap-2 text-xs font-bold border-b border-black dark:border-white pb-1 hover:text-accent hover:border-accent transition-colors text-noir dark:text-white">
                    ACQUIRE <ShoppingBag size={12} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {item.status === 'FUTURE' ? 'COMING SOON' : 'ARCHIVED'} <Lock size={12} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artifacts;