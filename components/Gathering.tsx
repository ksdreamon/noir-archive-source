import React, { useState } from 'react';
import { EventItem } from '../types';
import { Compass, MapPin, Lock, Unlock, ExternalLink, Calendar, AlertTriangle, Plus, X, Save, Eye, EyeOff, Map, ArrowLeft, ArrowRight, Activity } from 'lucide-react';

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'm1',
    type: 'MYSTERY',
    title: 'The Silent Symposium',
    date: '2024-11-20',
    time: '23:00',
    clue: 'Where the river cuts the stone in two, beneath the arch that holds *no weight*. Look for the _blue lantern_.',
    isDecrypted: false
  },
  {
    id: 'm2',
    type: 'MYSTERY',
    title: 'Echoes of Plato',
    date: '2024-12-05',
    time: '19:00',
    clue: 'The forgotten library wing. Third floor. The door marked *"Authorized Personnel Only"* will be unlocked for 10 minutes.',
    isDecrypted: false
  },
  {
    id: 'c1',
    type: 'CURATED',
    title: 'Brutalist Architecture Exhibition',
    date: '2024-10-30',
    time: '10:00',
    location: 'Modern Art Museum, Hall B',
    description: 'This collection challenges the notion of comfort. The raw concrete textures remind me of our own unpolished truths. Essential viewing for anyone interested in structural honesty.',
    link: 'https://example.com'
  },
  {
    id: 'c2',
    type: 'CURATED',
    title: 'Lecture: The Void in Cinema',
    date: '2024-11-12',
    time: '20:00',
    location: 'Underground Cinema Club',
    description: 'A rare opportunity to hear about the use of negative space in visual storytelling. I found the speakers previous work transformative for my own design philosophy.',
    link: 'https://example.com'
  }
];

const Gathering: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [decrypting, setDecrypting] = useState<string | null>(null);
  const [activeSector, setActiveSector] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');
  
  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formType, setFormType] = useState<'MYSTERY' | 'CURATED'>('MYSTERY');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formClue, setFormClue] = useState(''); // Mystery only
  const [formLocation, setFormLocation] = useState(''); // Curated only
  const [formLink, setFormLink] = useState(''); // Curated only
  const [formDescription, setFormDescription] = useState(''); // Highlight / Reason

  const handleRevealToggle = (id: string, currentlyDecrypted?: boolean) => {
    if (currentlyDecrypted) {
      // Hide immediately
      setEvents(prev => prev.map(e => e.id === id ? { ...e, isDecrypted: false } : e));
    } else {
      // Reveal with delay
      setDecrypting(id);
      setTimeout(() => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, isDecrypted: true } : e));
        setDecrypting(null);
      }, 1500); // 1.5s Decryption time
    }
  };

  const openModal = (type: 'MYSTERY' | 'CURATED') => {
    setFormType(type);
    setIsAdding(true);
    // Reset form
    setFormTitle('');
    setFormDate('');
    setFormTime('');
    setFormClue('');
    setFormLocation('');
    setFormLink('');
    setFormDescription('');
  };

  const handleSave = () => {
    if (!formTitle || !formDate || !formTime) return;

    const newEvent: EventItem = {
      id: Date.now().toString(),
      type: formType,
      title: formTitle,
      date: formDate,
      time: formTime,
      clue: formType === 'MYSTERY' ? formClue : undefined,
      location: formType === 'CURATED' ? formLocation : undefined,
      link: formType === 'CURATED' ? formLink : undefined,
      description: formDescription || undefined,
      isDecrypted: false // Default for mystery
    };

    setEvents([newEvent, ...events]);
    setIsAdding(false);
  };

  // Helper to parse simple markdown (*bold*, _italic_)
  const formatRichText = (text: string) => {
    const formatted = text
      .replace(/\*(.*?)\*/g, '<strong class="text-white font-normal">$1</strong>')
      .replace(/_(.*?)_/g, '<em class="text-accent">$1</em>')
      .replace(/\n/g, '<br />');
    return { __html: formatted };
  };

  const addToCalendar = (event: EventItem) => {
    const startTime = new Date(`${event.date}T${event.time}`).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDateObj = new Date(new Date(`${event.date}T${event.time}`).getTime() + 2 * 60 * 60 * 1000);
    const endTime = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const details = event.type === 'MYSTERY' 
      ? `CLUE: ${event.clue}` 
      : `${event.description || ''}`;
      
    const location = event.location || 'Unknown Coordinates';
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    window.open(url, '_blank');
  };

  const openMap = (location: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900 text-paper p-8 md:p-12 lg:pl-32 flex flex-col relative overflow-hidden">
      
      {/* Creation Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-white/10 w-full max-w-lg p-8 relative animate-fade-in shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAdding(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="font-display text-2xl mb-2 text-white">
              {formType === 'MYSTERY' ? 'Construct Labyrinth' : 'Log Radar Signal'}
            </h3>
            <p className="font-mono text-xs text-accent mb-8 uppercase tracking-widest">
              {formType === 'MYSTERY' ? 'Internal Sector' : 'External Sector'}
            </p>

            <div className="space-y-6">
              <input 
                type="text" 
                placeholder="Event Title..." 
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 p-2 font-serif text-xl focus:outline-none focus:border-accent placeholder-gray-600"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block font-mono text-[9px] text-gray-500 mb-1">DATE</label>
                   <input 
                    type="date" 
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 p-2 font-mono text-sm focus:outline-none focus:border-accent text-white"
                  />
                </div>
                <div>
                   <label className="block font-mono text-[9px] text-gray-500 mb-1">TIME</label>
                   <input 
                    type="time" 
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 p-2 font-mono text-sm focus:outline-none focus:border-accent text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-accent mb-1 uppercase">
                  Curator's Highlights / Why Attend?
                </label>
                <textarea 
                  placeholder="Share your personal reason for archiving this event..." 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full h-24 bg-white/5 border border-white/10 p-3 font-sans text-sm focus:outline-none focus:border-accent resize-none placeholder-gray-600 text-gray-300 italic"
                />
              </div>

              {formType === 'MYSTERY' ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-mono text-[9px] text-gray-500">CRYPTIC CLUE</label>
                    <span className="font-mono text-[9px] text-gray-600">Supports *bold* and _italic_</span>
                  </div>
                  <textarea 
                    placeholder="Where the shadow falls..." 
                    value={formClue}
                    onChange={(e) => setFormClue(e.target.value)}
                    className="w-full h-32 bg-white/5 border border-white/10 p-4 font-serif text-sm focus:outline-none focus:border-accent resize-none placeholder-gray-600 text-gray-300"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-mono text-[9px] text-gray-500 mb-1">LOCATION / VENUE</label>
                    <input 
                      type="text" 
                      placeholder="e.g. The Old Factory..." 
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 p-2 font-sans text-sm focus:outline-none focus:border-accent placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-gray-500 mb-1">EXTERNAL LINK</label>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 p-2 font-mono text-sm focus:outline-none focus:border-accent placeholder-gray-600"
                    />
                  </div>
                </>
              )}

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="bg-white text-black px-8 py-3 font-display text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Save size={16} /> INJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTOR CONTROL CAROUSEL NAV */}
      <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6 z-10 relative">
        <h2 className="font-display text-4xl md:text-5xl text-white">THE GATHERING</h2>
        <div className="flex items-center gap-6">
           <button 
             onClick={() => setActiveSector('INTERNAL')}
             className={`font-mono text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeSector === 'INTERNAL' ? 'text-accent border-b border-accent pb-1' : 'text-gray-600 hover:text-white'}`}
           >
             <Compass size={14} /> Internal
           </button>
           <div className="h-4 w-[1px] bg-gray-800"></div>
           <button 
             onClick={() => setActiveSector('EXTERNAL')}
             className={`font-mono text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeSector === 'EXTERNAL' ? 'text-accent border-b border-accent pb-1' : 'text-gray-600 hover:text-white'}`}
           >
             <Activity size={14} /> External
           </button>
        </div>
      </div>

      {/* CAROUSEL CONTAINER */}
      <div className="relative w-full overflow-hidden flex-1">
        <div 
          className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: activeSector === 'INTERNAL' ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          
          {/* SECTOR 1: THE LABYRINTH (Internal) */}
          <div className="w-full min-w-full md:pr-12 opacity-100 transition-opacity duration-500" style={{ opacity: activeSector === 'INTERNAL' ? 1 : 0.3 }}>
            <div className="flex justify-between items-start mb-12">
               <div className="max-w-md">
                 <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-4">Mystery Calendar</p>
                 <p className="font-serif text-xl text-gray-500 italic">
                   "To find the destination, you must understand the journey. Follow the clues. The location is a test."
                 </p>
               </div>
               <button 
                 onClick={() => openModal('MYSTERY')}
                 className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all group"
                 title="Add Mystery"
               >
                 <Plus size={20} className="group-hover:rotate-90 transition-transform" />
               </button>
            </div>

            <div className="space-y-12 max-w-4xl">
              {events.filter(e => e.type === 'MYSTERY').map(event => (
                <div key={event.id} className="relative pl-6 border-l border-white/20 hover:border-accent transition-colors group/event">
                  <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full border transition-colors ${event.isDecrypted ? 'bg-accent border-accent' : 'bg-neutral-900 border-red-900'}`}></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-accent text-xs">{event.date} // {event.time}</span>
                    {event.isDecrypted ? <Unlock size={14} className="text-accent"/> : <Lock size={14} className="text-red-900"/>}
                  </div>
                  
                  <h3 className="font-display text-3xl mb-4 group-hover/event:text-white text-gray-300 transition-colors">{event.title}</h3>
                  
                  {event.description && (
                     <p className="font-serif text-sm text-gray-500 mb-4 italic border-l border-white/10 pl-3">
                       "{event.description}"
                     </p>
                  )}

                  <div className={`bg-black/40 border relative overflow-hidden group transition-all duration-500 ${event.isDecrypted ? 'border-accent/30 p-6' : 'border-white/5 py-8'}`}>
                    {event.isDecrypted ? (
                      <div className="animate-fade-in">
                        <p 
                          className="font-serif text-xl text-gray-300 leading-relaxed mb-6"
                          dangerouslySetInnerHTML={formatRichText(event.clue || '')}
                        />
                        
                        <div className="flex justify-between items-end border-t border-white/5 pt-4">
                           <div className="flex gap-4">
                             <div className="flex items-center gap-2 text-accent font-mono text-[10px] uppercase">
                               <MapPin size={12} /> Data Revealed
                             </div>
                             <button 
                                onClick={() => addToCalendar(event)}
                                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-[10px] uppercase"
                             >
                                <Calendar size={12} /> Add to Calendar
                             </button>
                           </div>
                           
                           <button
                             onClick={() => handleRevealToggle(event.id, true)}
                             className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors font-mono text-[10px] uppercase"
                           >
                             <EyeOff size={12} /> Hide Signal
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <p className="font-mono text-[10px] text-red-900 mb-4 tracking-[0.3em] uppercase">
                          {decrypting === event.id ? 'DECRYPTING...' : 'SIGNAL ENCRYPTED'}
                        </p>
                        <button 
                          onClick={() => handleRevealToggle(event.id, false)}
                          disabled={!!decrypting}
                          className="group flex items-center gap-2 border border-white/10 text-gray-400 hover:border-accent hover:text-accent px-6 py-2 font-mono text-xs uppercase transition-all"
                        >
                          {decrypting === event.id ? (
                            <span className="animate-pulse">PROCESSING</span>
                          ) : (
                            <>
                              REVEAL CLUE <Eye size={12} className="group-hover:text-accent" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Navigation to Next Sector */}
            <div className="mt-24 flex justify-end">
               <button onClick={() => setActiveSector('EXTERNAL')} className="flex items-center gap-2 text-gray-500 hover:text-white font-mono text-xs uppercase transition-colors">
                  Next Sector <ArrowRight size={14} />
               </button>
            </div>
          </div>

          {/* SECTOR 2: THE RADAR (External) */}
          <div className="w-full min-w-full md:pl-12 opacity-100 transition-opacity duration-500" style={{ opacity: activeSector === 'EXTERNAL' ? 1 : 0.3 }}>
            <div className="flex justify-between items-start mb-12">
               <div className="max-w-md">
                 <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-4">Public Radar</p>
                 <p className="font-serif text-xl text-gray-500 italic">
                   "Curated signals from the outside world. Exhibitions, lectures, and phenomena worth observing."
                 </p>
               </div>
               <button 
                 onClick={() => openModal('CURATED')}
                 className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all group"
                 title="Add Curated Event"
               >
                 <Plus size={20} className="group-hover:rotate-90 transition-transform" />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              {events.filter(e => e.type === 'CURATED').map(event => (
                <div 
                  key={event.id} 
                  className="block bg-[#151515] border border-white/5 p-8 hover:bg-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-xs text-gray-500 group-hover:text-white transition-colors">
                      {event.date} • {event.time}
                    </span>
                    {event.link && (
                      <a href={event.link} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} className="text-gray-400 hover:text-white transition-colors"/>
                      </a>
                    )}
                  </div>
                  
                  <h3 className="font-sans text-2xl font-light text-gray-200 mb-2 group-hover:text-accent transition-colors">
                    {event.title}
                  </h3>
                  
                  {event.description && (
                    <div className="my-6 pl-4 border-l border-white/20">
                      <p className="font-serif text-sm text-gray-400 italic leading-relaxed">
                        "{event.description}"
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-mono flex-1">
                      <MapPin size={12} />
                      {event.location}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => event.location && openMap(event.location)}
                        className="p-2 border border-white/10 hover:border-accent hover:text-accent rounded-sm transition-colors"
                        title="View on Maps"
                      >
                        <Map size={14} />
                      </button>
                      <button 
                        onClick={() => addToCalendar(event)}
                        className="p-2 border border-white/10 hover:border-white hover:text-white rounded-sm transition-colors text-gray-500"
                        title="Add to Google Calendar"
                      >
                        <Calendar size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 border border-yellow-900/30 bg-yellow-900/5 flex items-start gap-4 max-w-2xl">
               <AlertTriangle className="text-yellow-700 shrink-0" size={20} />
               <div>
                 <h4 className="font-mono text-xs text-yellow-700 uppercase mb-1">Disclaimer</h4>
                 <p className="font-sans text-xs text-yellow-900/60 leading-relaxed">
                   External coordinates are subject to change. The Archive is not responsible for the cancellation of reality.
                 </p>
               </div>
            </div>

            {/* Quick Navigation to Prev Sector */}
            <div className="mt-12">
               <button onClick={() => setActiveSector('INTERNAL')} className="flex items-center gap-2 text-gray-500 hover:text-white font-mono text-xs uppercase transition-colors">
                  <ArrowLeft size={14} /> Previous Sector
               </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Gathering;