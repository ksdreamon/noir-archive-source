import React, { useState, useRef, useEffect } from 'react';
import { JournalEntry, Language } from '../types';
import { ArrowRight, Heart, ArrowLeft, Share2, Plus, X, Image as ImageIcon, Upload, Save, Feather, Wind, Globe, Scan, Clock } from 'lucide-react';

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    title: 'Cienie w betonie',
    date: 'OCT 12, 2024',
    language: 'PL',
    content: 'Zrozumiałem dziś, że struktura nie polega na podtrzymywaniu rzeczy, ale na definiowaniu miejsc, do których światło nie dociera.\n\nSpacerowałem po starej dzielnicy. Rozkład jest piękniejszy niż nieskazitelność. Pęknięcia w chodniku tworzą mapy miast, które nigdy nie istniały. Patrząc na te bruzdy, widzę historię walki materii z czasem. To właśnie tam, w cieniu wielkiej płyty, odnalazłem spokój, którego nie potrafiły mi dać szklane wieżowce.\n\nBeton jest szczery. Nie udaje, że jest lekki. Jest ciężarem, który, paradoksalnie, pozwala nam stąpać pewniej po ziemi.',
    image: 'https://picsum.photos/600/800',
    tags: ['Refleksja', 'Miasto'],
    status: 'PUBLISHED',
    likes: 42,
    isLiked: false
  },
  {
    id: '2',
    title: 'The Frequency of Silence',
    date: 'NOV 01, 2024',
    language: 'EN',
    content: 'Drafting the new chapter. It deals with silence. How do you design silence? Is it the absence of noise, or a frequency of its own? The character feels lost, much like I do in this vast digital expanse. We build connections, yet the distance between minds seems to grow exponentially with every new platform launched.\n\nI sat in the studio for hours, staring at a blank canvas. The white space wasn\'t empty; it was full of everything I hadn\'t said yet. I realized that the void is not a lack of something, but a space waiting to be inhabited by thought.',
    tags: ['Book', 'Writing'],
    status: 'PUBLISHED',
    likes: 128,
    isLiked: true
  },
  {
    id: '3',
    title: 'Midnight Notes',
    date: 'DEC 05, 2024',
    language: 'ES',
    content: 'El café sabe a hierro. La pantalla brilla. Construir un portafolio es un ejercicio de vanidad, pero necesario. ¿Quiénes somos sino colecciones curadas de nuestros mejores errores?\n\nA veces pienso que mi arquitectura es solo un intento de construir un refugio contra mis propios pensamientos. Un laberinto donde el minotauro soy yo.',
    image: 'https://picsum.photos/600/400',
    tags: ['Vida', 'Noche'],
    status: 'PUBLISHED',
    likes: 89,
    isLiked: false
  }
];

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<Language | 'ALL'>('ALL');

  // Writing State
  const [isWriting, setIsWriting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState<Language>('EN');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftStateRef = useRef({ title: '', content: '', tags: '', language: 'EN' as Language, image: null as string | null });

  // Sync Ref with State for Auto-save (avoids stale closures in setInterval)
  useEffect(() => {
    draftStateRef.current = { 
        title: newTitle, 
        content: newContent, 
        tags: newTags, 
        language: newLanguage, 
        image: newImage 
    };
  }, [newTitle, newContent, newTags, newLanguage, newImage]);

  // URL Handling for Dedicated Page Navigation
  useEffect(() => {
    // On Mount: Check URL for entry ID
    const params = new URLSearchParams(window.location.search);
    const entryId = params.get('entry');
    if (entryId) {
      setSelectedEntryId(entryId);
    }

    // Listen for PopState (Back Button)
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const e = p.get('entry');
      setSelectedEntryId(e);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Restore Draft from LocalStorage on Open
  useEffect(() => {
    if (isWriting) {
        const savedDraft = localStorage.getItem('noir_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                // Only restore if fields are empty to prevent overwriting active session
                if (!newTitle && !newContent) {
                    setNewTitle(parsed.title || '');
                    setNewContent(parsed.content || '');
                    setNewTags(parsed.tags || '');
                    setNewLanguage(parsed.language || 'EN');
                    setNewImage(parsed.image || null);
                    setLastSaved(new Date(parsed.timestamp).toLocaleTimeString());
                }
            } catch (e) {
                console.error("Failed to restore draft", e);
            }
        }
    }
  }, [isWriting]);

  // Auto-save Interval (Every 1 Minute)
  useEffect(() => {
    if (!isWriting) return;

    const interval = setInterval(() => {
        const current = draftStateRef.current;
        // Only save if there is actually content
        if (current.title || current.content) {
            const draftData = { ...current, timestamp: Date.now() };
            localStorage.setItem('noir_draft', JSON.stringify(draftData));
            setLastSaved(new Date().toLocaleTimeString());
        }
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(interval);
  }, [isWriting]);

  // Update URL when entry is selected/deselected
  const navigateToEntry = (id: string) => {
    setSelectedEntryId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('entry', id);
    window.history.pushState({}, '', url);
  };

  const closeEntry = () => {
    setSelectedEntryId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('entry');
    window.history.pushState({}, '', url);
  };

  // Lock Body Scroll when reading
  useEffect(() => {
    if (selectedEntryId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedEntryId]);

  const selectedEntry = entries.find(e => e.id === selectedEntryId);

  const filteredEntries = entries.filter(entry => 
    languageFilter === 'ALL' || entry.language === languageFilter
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!newTitle || !newContent) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: newTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
      language: newLanguage,
      content: newContent,
      image: newImage || undefined,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'PUBLISHED',
      likes: 0,
      isLiked: false
    };

    setEntries([newEntry, ...entries]);
    
    // Clear Draft
    localStorage.removeItem('noir_draft');
    setLastSaved(null);
    
    setIsWriting(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setNewImage(null);
    setNewLanguage('EN');
  };

  // --------------------------------------------------------------------------
  // EDITORIAL READING VIEW (Dedicated Page Overlay)
  // --------------------------------------------------------------------------
  if (selectedEntry) {
    return (
      <div className="fixed inset-0 z-[60] w-full h-full bg-[#f0f0f0] text-black overflow-y-auto animate-fade-in selection:bg-black selection:text-white">
        <div className="p-6 md:p-16 lg:p-24 max-w-[1920px] mx-auto min-h-screen relative">
          
          {/* Navigation Header */}
          <div className="sticky top-0 z-50 bg-[#f0f0f0]/90 backdrop-blur-sm border-b border-black py-4 flex justify-between items-center mb-16">
             <button 
               onClick={closeEntry}
               className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors group"
             >
               <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Chronicles
             </button>
             <span className="font-display font-bold text-lg hidden md:block">NOIR MAGAZINE</span>
             <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard");
                }}
                className="font-mono text-xs uppercase tracking-widest hover:text-accent"
             >
                Share Article
             </button>
          </div>

          <article className="max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 border-b-4 border-black pb-16">
               <div className="lg:col-span-8">
                  <h1 className="font-editorial text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-8 font-bold break-words hyphens-auto">
                    {selectedEntry.title}
                  </h1>
               </div>
               <div className="lg:col-span-4 flex flex-col justify-end font-mono text-xs uppercase tracking-widest space-y-4 text-gray-600">
                  <p>Published: {selectedEntry.date}</p>
                  <p>Language: {selectedEntry.language}</p>
                  <p>Tags: {selectedEntry.tags.join(', ')}</p>
                  <p>Read Time: 4 min</p>
               </div>
            </div>

            {/* Main Content (Multi-Column) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Sidebar / Image */}
              <div className="lg:col-span-4">
                 {selectedEntry.image ? (
                   <figure className="mb-8 group cursor-pointer">
                     <div className="overflow-hidden bg-black relative">
                       <img src={selectedEntry.image} alt="Visual" className="w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700" />
                     </div>
                     <figcaption className="font-mono text-[10px] mt-2 text-gray-500 uppercase flex justify-between">
                       <span>Fig 1.1 — Visual Context</span>
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">Expand</span>
                     </figcaption>
                   </figure>
                 ) : (
                   <div className="w-full aspect-[3/4] bg-[#0a0a0a] relative overflow-hidden group mb-8 border border-black/10 flex items-center justify-center">
                      {/* Static Noise Overlay */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black"></div>
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
                      
                      {/* Scanning Line - Simulating with top/bottom border pulse or similar */}
                      <div className="absolute inset-0 border-y border-white/5 animate-pulse"></div>

                      <div className="z-10 flex flex-col items-center text-gray-700 group-hover:text-white transition-colors duration-700">
                          <Scan size={48} strokeWidth={0.5} className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="flex flex-col items-center gap-3 text-center px-8">
                              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 group-hover:text-accent transition-colors">
                                  [Visual Data Missing]
                              </span>
                              <span className="font-serif text-xs italic text-gray-600 group-hover:text-gray-400 transition-colors">
                                  "The memory exists only in text. The image has dissolved into the archive."
                              </span>
                          </div>
                      </div>
                      
                      {/* Corner marks */}
                      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-gray-800 group-hover:border-accent transition-colors"></div>
                      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-gray-800 group-hover:border-accent transition-colors"></div>
                   </div>
                 )}
                 <div className="font-serif text-xl italic text-gray-600 border-l-2 border-accent pl-6 leading-relaxed">
                   "Writing is the geometry of the soul. We build structures with words to house the feelings that have no name."
                 </div>
              </div>

              {/* Text Body */}
              <div className="lg:col-span-8">
                 <div className="font-serif text-xl md:text-2xl leading-[1.6] text-justify column-layout">
                    <p className="drop-cap whitespace-pre-line mb-8">
                      {selectedEntry.content}
                    </p>
                 </div>
                 
                 <div className="mt-16 pt-8 border-t border-black flex justify-center">
                   <button className="text-4xl hover:scale-110 transition-transform text-red-600">
                      <Heart fill="currentColor" />
                   </button>
                 </div>
              </div>

            </div>
          </article>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TABLE OF CONTENTS (Index View)
  // --------------------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#e8e6e1] p-8 md:p-12 lg:pl-32 flex flex-col relative">
      <header className="mb-16 border-b border-white/20 pb-8 flex flex-col md:flex-row justify-between items-end">
        <div>
          <h2 className="font-display text-5xl md:text-8xl font-bold tracking-tighter">THE CHRONICLES</h2>
          <p className="font-serif text-2xl text-gray-500 mt-2 italic">A collection of temporal thoughts.</p>
        </div>
        <div className="flex flex-col items-end gap-4 mt-6 md:mt-0">
           <div className="font-mono text-xs text-right uppercase tracking-widest text-accent">
            Issue No. 4<br/>Volume: Infinite
           </div>
           
           <div className="flex items-center gap-2 mt-2">
             <span className="font-mono text-[10px] text-gray-500 uppercase flex items-center gap-1">
               <Globe size={10} /> LANG:
             </span>
             {(['ALL', 'PL', 'EN', 'ES', 'DE'] as const).map((lang) => (
               <button
                 key={lang}
                 onClick={() => setLanguageFilter(lang)}
                 className={`font-mono text-[10px] px-2 py-1 border transition-colors ${
                   languageFilter === lang 
                     ? 'border-accent text-accent bg-accent/10' 
                     : 'border-white/10 text-gray-600 hover:border-white/30 hover:text-gray-300'
                 }`}
               >
                 {lang}
               </button>
             ))}
           </div>

           <button 
             onClick={() => setIsWriting(true)}
             className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white hover:text-black border border-white/20 transition-all font-mono text-xs uppercase"
           >
             <Plus size={16} /> Compose Entry
           </button>
        </div>
      </header>

      <div className="max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-12 border-b border-white/30 pb-2 mb-4 font-mono text-[10px] uppercase tracking-widest text-gray-500">
           <div className="col-span-2">Date</div>
           <div className="col-span-1">Lang</div>
           <div className="col-span-6">Title / Synopsis</div>
           <div className="col-span-3 text-right">Action</div>
        </div>

        {filteredEntries.map((entry, index) => (
          <div 
            key={entry.id}
            onClick={() => navigateToEntry(entry.id)}
            className="group grid grid-cols-12 py-8 border-b border-white/10 hover:border-white hover:bg-white/5 transition-all cursor-pointer items-start"
          >
            <div className="col-span-2 font-mono text-xs text-gray-400 group-hover:text-accent mt-1">
               {entry.date}
            </div>
            
            <div className="col-span-1 font-mono text-xs text-gray-600 mt-1">
               {entry.language}
            </div>

            <div className="col-span-6 pr-8">
               <h3 className="font-editorial text-3xl md:text-4xl mb-2 group-hover:translate-x-2 transition-transform duration-300">
                 {entry.title}
               </h3>
               <p className="font-sans text-sm text-gray-500 line-clamp-2 opacity-60 group-hover:opacity-100 transition-opacity">
                 {entry.content}
               </p>
               {entry.image && (
                 <div className="mt-2 text-[10px] font-mono text-accent flex items-center gap-1 opacity-50 group-hover:opacity-100">
                   <ImageIcon size={10} /> Has Attachment
                 </div>
               )}
            </div>

            <div className="col-span-3 flex justify-end items-center h-full">
               <span className="font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                 Read Article <ArrowRight size={12} />
               </span>
            </div>
          </div>
        ))}
        
        {filteredEntries.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-mono text-sm text-gray-600 uppercase tracking-widest">No entries found for this language sector.</p>
          </div>
        )}

        <div className="py-24 text-center">
           <span className="font-display text-8xl text-white/5 select-none">END OF INDEX</span>
        </div>
      </div>

      {/* Compose Modal */}
      {isWriting && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#111] border border-white/10 p-8 md:p-12 relative animate-fade-in shadow-2xl flex flex-col md:flex-row gap-12 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsWriting(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
            >
              <X size={24} />
            </button>
            
            <div className="w-full md:w-2/3">
               <div className="flex justify-between items-baseline mb-8">
                   <h3 className="font-display text-2xl text-white">New Chronicle</h3>
                   {lastSaved && (
                       <span className="font-mono text-[9px] text-accent animate-pulse flex items-center gap-1 uppercase tracking-widest">
                           <Clock size={10} /> Auto-Saved: {lastSaved}
                       </span>
                   )}
               </div>
               
               <input 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Entry Title..."
                  className="w-full bg-transparent border-b border-white/20 py-2 font-editorial text-4xl text-white focus:outline-none focus:border-accent placeholder-gray-700 mb-6"
               />
               
               <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your thoughts..."
                  className="w-full h-64 bg-transparent border-none p-0 font-serif text-lg text-gray-300 focus:outline-none placeholder-gray-700 resize-none leading-relaxed"
               />

               <div className="mt-6 pt-6 border-t border-white/10 flex gap-4">
                 <div className="flex-1">
                   <label className="block font-mono text-[9px] text-gray-500 mb-2 uppercase">Tags (Comma Separated)</label>
                   <input 
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g. Life, Design, Void..."
                      className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs text-white focus:outline-none focus:border-accent"
                   />
                 </div>
                 <div className="w-32">
                   <label className="block font-mono text-[9px] text-gray-500 mb-2 uppercase">Language</label>
                   <select 
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value as Language)}
                      className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs text-white focus:outline-none focus:border-accent"
                   >
                     <option value="EN">EN</option>
                     <option value="PL">PL</option>
                     <option value="ES">ES</option>
                     <option value="DE">DE</option>
                   </select>
                 </div>
               </div>
            </div>

            <div className="w-full md:w-1/3 border-l border-white/10 pl-0 md:pl-12 flex flex-col">
               <h4 className="font-mono text-xs text-gray-500 uppercase mb-4">Visual Attachment</h4>
               
               <div 
                 className="flex-1 min-h-[200px] bg-white/5 border border-dashed border-white/20 hover:border-accent transition-colors flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                 onClick={() => fileInputRef.current?.click()}
               >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="image/*"
                   onChange={handleImageUpload}
                 />
                 
                 {newImage ? (
                   <>
                     <img src={newImage} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="font-mono text-xs text-white">Change Image</span>
                     </div>
                   </>
                 ) : (
                   <div className="text-center p-6">
                      <Upload className="mx-auto mb-2 text-gray-500" size={24} />
                      <p className="font-mono text-[10px] text-gray-500">CLICK TO UPLOAD<br/>VISUAL DATA</p>
                   </div>
                 )}
               </div>
               
               <div className="mt-8">
                 <button 
                   onClick={handlePublish}
                   className="w-full bg-white text-black py-4 font-display text-sm uppercase hover:bg-accent transition-colors flex items-center justify-center gap-2"
                 >
                   <Save size={16} /> Publish to Archive
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;