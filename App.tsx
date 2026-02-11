import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Manifesto from './components/Manifesto';
import Identity from './components/Identity';
import Atelier from './components/Atelier';
import Gathering from './components/Gathering';
import Journal from './components/Journal';
import Vision from './components/Vision';
import Ephemeral from './components/Ephemeral';
import CulturalGaze from './components/CulturalGaze';
import Artifacts from './components/Artifacts';
import Signal from './components/Signal';
import Lexicon from './components/Lexicon';
import Sentiments from './components/Sentiments';
import IntroLoader from './components/IntroLoader';
import { ViewState, AppSettings } from './types';
import { X, Save, Plus, Trash2, Eye, EyeOff, Lock, Unlock, Moon, Sun } from 'lucide-react';

// Technical Overlay Component to mimic Urbonas' aesthetic
const TechnicalOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] mix-blend-difference opacity-30 select-none">
      {/* Corner Crosshairs */}
      <div className="absolute top-8 left-8 w-4 h-4 border-l border-t border-white"></div>
      <div className="absolute top-8 right-8 w-4 h-4 border-r border-t border-white"></div>
      <div className="absolute bottom-8 left-8 w-4 h-4 border-l border-b border-white"></div>
      <div className="absolute bottom-8 right-8 w-4 h-4 border-r border-b border-white"></div>

      {/* Center Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-12 h-[1px] bg-white"></div>
        <div className="h-12 w-[1px] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Vertical Grid Lines */}
      <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-white opacity-20 hidden md:block"></div>
      <div className="absolute top-0 bottom-0 right-[25%] w-[1px] bg-white opacity-20 hidden md:block"></div>

      {/* Running Data Metrics */}
      <div className="absolute bottom-12 left-12 font-mono text-[9px] flex flex-col gap-1">
        <span>X: 48.2910</span>
        <span>Y: 12.9182</span>
        <span>Z: 00.0000</span>
      </div>
    </div>
  );
};

const DEFAULT_SETTINGS: AppSettings = {
  issueNumber: 1,
  year: 2026,
  bannerText: [
    "POETRY IS ARCHITECTURE WITH WORDS",
    "SYSTEM_STATUS: STABLE",
    "THE ARCHIVE REMEMBERS",
    "DESIGNING SILENCE"
  ],
  theme: 'dark',
  navigation: [
    { id: ViewState.MANIFESTO, label: 'MANIFESTO', isVisible: true, isLocked: false },
    { id: ViewState.LEXICON, label: 'GARDEN OF IDEAS', isVisible: true, isLocked: false },
    { id: ViewState.IDENTITY, label: 'IDENTITY / ORIGIN', isVisible: true, isLocked: false },
    { id: ViewState.ATELIER, label: 'ATELIER / STUDIO', isVisible: true, isLocked: false },
    { id: ViewState.VISION, label: 'ARCH / VISION', isVisible: true, isLocked: false },
    { id: ViewState.GATHERING, label: 'THE GATHERING', isVisible: true, isLocked: false },
    { id: ViewState.JOURNAL, label: 'CHRONICLES', isVisible: true, isLocked: false },
    { id: ViewState.CULTURAL_GAZE, label: 'CULTURAL GAZE', isVisible: true, isLocked: false },
    { id: ViewState.SENTIMENTS, label: 'SENTIMENTS', isVisible: true, isLocked: false },
    { id: ViewState.ARTIFACTS, label: 'ARTIFACTS', isVisible: true, isLocked: false },
    { id: ViewState.EPHEMERAL, label: 'EPHEMERA', isVisible: true, isLocked: false },
    { id: ViewState.SIGNAL, label: 'SIGNAL', isVisible: true, isLocked: false },
  ]
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewState>(ViewState.MANIFESTO);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [visitorCount, setVisitorCount] = useState(0);
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Custom Cursor State
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Track session start time
  const sessionStartTime = useRef<number>(Date.now());
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Load Settings from LocalStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('noir_archive_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with default to ensure new fields (like navigation) exist if loading old data
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save Settings to LocalStorage
  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('noir_archive_settings', JSON.stringify(newSettings));
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings({ ...settings, theme: newTheme });
  };

  useEffect(() => {
    // Visitor Count Logic
    const today = new Date().toISOString().split('T')[0];
    const storageKeyDate = 'noir_archive_date';
    const storageKeyCount = 'noir_archive_count';
    const sessionKey = 'noir_archive_session';

    const lastDate = localStorage.getItem(storageKeyDate);
    let currentCount = parseInt(localStorage.getItem(storageKeyCount) || '342'); 

    if (lastDate !== today) {
      currentCount = Math.floor(Math.random() * 50) + 120;
      localStorage.setItem(storageKeyDate, today);
      localStorage.setItem(storageKeyCount, currentCount.toString());
    }

    if (!sessionStorage.getItem(sessionKey)) {
      currentCount++;
      localStorage.setItem(storageKeyCount, currentCount.toString());
      sessionStorage.setItem(sessionKey, 'true');
    }
    setVisitorCount(currentCount);

    // Clock (Poland Time)
    const interval = setInterval(() => {
      const date = new Date();
      const time = date.toLocaleTimeString('pl-PL', { 
        timeZone: 'Europe/Warsaw', 
        hour12: false,
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      setCurrentTime(time);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Horizontal Scroll Engine
  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      // Allow vertical scroll inside scrollable containers (like journal articles)
      if (target.closest('.overflow-y-auto')) return;

      if (e.deltaY !== 0) {
        container.scrollLeft += e.deltaY;
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Cursor Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.closest('button') || 
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isInteractive);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (view: ViewState) => {
    setActiveView(view);
    const element = document.getElementById(view);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  };

  const SECTIONS = [
    { id: ViewState.MANIFESTO, Component: Manifesto, width: 'w-[100vw]' },
    { id: ViewState.LEXICON, Component: Lexicon, width: 'w-[100vw]' },
    { id: ViewState.IDENTITY, Component: Identity, width: 'w-[100vw]' },
    { id: ViewState.ATELIER, Component: Atelier, width: 'w-[100vw]' },
    { id: ViewState.VISION, Component: Vision, width: 'w-[100vw]' },
    { id: ViewState.GATHERING, Component: Gathering, width: 'w-[100vw] md:w-[150vw]' },
    { id: ViewState.JOURNAL, Component: Journal, width: 'w-[100vw]' },
    { id: ViewState.CULTURAL_GAZE, Component: CulturalGaze, width: 'w-[100vw]' },
    { id: ViewState.SENTIMENTS, Component: Sentiments, width: 'w-[100vw]' },
    { id: ViewState.ARTIFACTS, Component: Artifacts, width: 'w-[100vw]' },
    { id: ViewState.EPHEMERAL, Component: Ephemeral, width: 'w-[100vw]' },
    { id: ViewState.SIGNAL, Component: Signal, width: 'w-[100vw]' },
  ];

  const updateNavItem = (id: ViewState, field: keyof typeof settings.navigation[0], value: any) => {
    const newNav = settings.navigation.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setSettings({ ...settings, navigation: newNav });
  };

  return (
    <div className={`${settings.theme === 'dark' ? 'dark' : ''} bg-[#050505] text-[#e8e6e1]`}>
      <div className="relative overflow-hidden h-screen cursor-none">
        
        {/* Cinematic Overlays */}
        <div className="noise-overlay"></div>
        <div className="scanline"></div>
        <TechnicalOverlay />
        <div 
          className={`custom-cursor ${isHovering ? 'hovered' : ''}`} 
          style={{ left: cursorPos.x, top: cursorPos.y }}
        />

        {isLoading && <IntroLoader onComplete={() => setIsLoading(false)} />}

        <Navigation 
          currentView={activeView} 
          setView={scrollToSection} 
          isDarkMode={settings.theme === 'dark'}
          toggleTheme={toggleTheme}
          isVisible={isNavVisible}
          toggleNav={() => setIsNavVisible(!isNavVisible)}
          visitorCount={visitorCount}
          sessionStartTime={sessionStartTime.current}
          onOpenSettings={() => setIsSettingsOpen(true)}
          navConfig={settings.navigation}
        />
        
        <main 
          ref={mainContainerRef}
          className="h-full w-full flex flex-row overflow-x-auto overflow-y-hidden scroll-smooth relative z-10"
        >
          {SECTIONS.filter(section => {
             // Only render sections that are visible in config, to save resources and hide logic
             const config = settings.navigation.find(n => n.id === section.id);
             return config ? config.isVisible : true; 
          }).map(({ id, Component, width }) => (
            <section 
              key={id} 
              id={id} 
              className={`h-full shrink-0 ${width} relative border-r border-white/5 overflow-y-auto overflow-x-hidden`}
            >
              <div className={`transition-all duration-1000 min-h-full ${isNavVisible ? 'md:pl-64 pl-20' : 'pl-0'}`}>
                <Component />
              </div>
            </section>
          ))}
          
          <div className="w-[50vw] shrink-0 bg-[#050505] flex flex-col items-center justify-center relative">
            <span className="font-display text-4xl text-gray-800 tracking-tighter uppercase mb-4">Fin.</span>
            <span className="font-mono text-[10px] text-gray-700 tracking-[1em] uppercase">Archive Closed</span>
          </div>
        </main>

        {/* Cinematic Footer Ticker */}
        <div className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none mix-blend-difference border-t border-white/10 bg-black/20 backdrop-blur-sm py-2">
           <div className="flex animate-marquee whitespace-nowrap font-mono text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            <span className="mx-8">• ISSUE NO. {settings.issueNumber}</span>
            <span className="mx-8">• WARSAW_TIME: {currentTime}</span>
            <span className="mx-8">• YEAR: {settings.year}</span>
            <span className="mx-8">• VISITOR_ID: {visitorCount}</span>
            {settings.bannerText.map((text, i) => (
              <span key={i} className="mx-8">• "{text}"</span>
            ))}
            {/* Duplicate for smooth loop */}
             <span className="mx-8">• ISSUE NO. {settings.issueNumber}</span>
            <span className="mx-8">• WARSAW_TIME: {currentTime}</span>
            <span className="mx-8">• YEAR: {settings.year}</span>
            <span className="mx-8">• VISITOR_ID: {visitorCount}</span>
            {settings.bannerText.map((text, i) => (
              <span key={`dup-${i}`} className="mx-8">• "{text}"</span>
            ))}
          </div>
        </div>

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-[#111] border border-white/10 p-8 relative animate-fade-in shadow-2xl overflow-y-auto max-h-[90vh] cursor-auto flex flex-col">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="font-display text-2xl text-white mb-8 border-b border-white/10 pb-4">
                SYSTEM CONFIGURATION
              </h3>

              <div className="space-y-12">
                
                {/* 1. Visuals Section */}
                <div>
                   <h4 className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Visual Aesthetics</h4>
                   <div className="flex items-center justify-between bg-white/5 p-4 border border-white/10">
                      <div>
                        <span className="text-white font-mono text-sm block">Interface Theme</span>
                        <span className="text-gray-500 text-xs block mt-1">Toggle between deep void (dark) and paper (light) modes.</span>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs uppercase transition-colors ${
                           settings.theme === 'light' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20'
                        }`}
                      >
                         {settings.theme === 'light' ? <Sun size={14}/> : <Moon size={14}/>}
                         {settings.theme.toUpperCase()} MODE
                      </button>
                   </div>
                </div>

                {/* 2. Navigation Control Section */}
                <div>
                  <h4 className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Navigation Architecture</h4>
                  <div className="bg-white/5 border border-white/10 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-3 border-b border-white/10 font-mono text-[9px] text-gray-500 uppercase">
                       <div className="col-span-1 text-center">Active</div>
                       <div className="col-span-1 text-center">Locked</div>
                       <div className="col-span-3">ID (Fixed)</div>
                       <div className="col-span-7">Display Label (Editable)</div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {settings.navigation.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 p-3 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
                           {/* Visibility Toggle */}
                           <div className="col-span-1 flex justify-center">
                              <button 
                                onClick={() => updateNavItem(item.id, 'isVisible', !item.isVisible)}
                                className={`p-1 rounded transition-colors ${item.isVisible ? 'text-green-500 hover:text-green-400' : 'text-gray-600 hover:text-gray-500'}`}
                                title={item.isVisible ? "Visible to Visitors" : "Hidden from Visitors"}
                              >
                                {item.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                           </div>

                           {/* Locked Toggle */}
                           <div className="col-span-1 flex justify-center">
                              <button 
                                onClick={() => updateNavItem(item.id, 'isLocked', !item.isLocked)}
                                className={`p-1 rounded transition-colors ${item.isLocked ? 'text-red-500 hover:text-red-400' : 'text-gray-700 hover:text-gray-500'}`}
                                title={item.isLocked ? "Locked (Work in Progress)" : "Unlocked"}
                              >
                                {item.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                              </button>
                           </div>

                           {/* ID */}
                           <div className="col-span-3 font-mono text-[10px] text-gray-500 truncate">
                             {item.id}
                           </div>

                           {/* Label Edit */}
                           <div className="col-span-7">
                             <input 
                               type="text" 
                               value={item.label}
                               onChange={(e) => updateNavItem(item.id, 'label', e.target.value)}
                               className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-accent font-mono text-xs text-white focus:outline-none py-1 transition-colors"
                             />
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. General Settings */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block font-mono text-[10px] text-accent mb-2 uppercase">Issue Number</label>
                    <input 
                      type="number" 
                      value={settings.issueNumber}
                      onChange={(e) => setSettings({...settings, issueNumber: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 p-2 font-mono text-sm text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-accent mb-2 uppercase">Archive Year</label>
                    <input 
                      type="number" 
                      value={settings.year}
                      onChange={(e) => setSettings({...settings, year: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 p-2 font-mono text-sm text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Banner Text */}
                <div>
                  <label className="block font-mono text-[10px] text-accent mb-2 uppercase flex justify-between">
                    <span>Banner News / Quotes</span>
                    <button 
                      onClick={() => setSettings({...settings, bannerText: [...settings.bannerText, "NEW ENTRY"]})}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Plus size={10} /> ADD
                    </button>
                  </label>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {settings.bannerText.map((text, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={text}
                          onChange={(e) => {
                            const newBannerText = [...settings.bannerText];
                            newBannerText[index] = e.target.value;
                            setSettings({...settings, bannerText: newBannerText});
                          }}
                          className="flex-1 bg-white/5 border border-white/10 p-2 font-mono text-sm text-white focus:outline-none focus:border-accent"
                        />
                        <button 
                          onClick={() => {
                             const newBannerText = settings.bannerText.filter((_, i) => i !== index);
                             setSettings({...settings, bannerText: newBannerText});
                          }}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                   <button 
                     onClick={() => {
                       saveSettings(settings);
                       setIsSettingsOpen(false);
                     }}
                     className="bg-white text-black px-6 py-3 font-display text-sm uppercase hover:bg-accent transition-colors flex items-center gap-2"
                   >
                     <Save size={16} /> Save Configuration
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;