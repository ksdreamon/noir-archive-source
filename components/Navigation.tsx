import React, { useState, useEffect } from 'react';
import { ViewState, NavItemConfig } from '../types';
import { BookOpen, Mic, Layout, Feather, Eye, Gem, Radio, Moon, Sun, ChevronLeft, Menu, Users, Clock, Fingerprint, Palette, Compass, Sprout, Mail, Settings, Lock } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isVisible: boolean;
  toggleNav: () => void;
  visitorCount: number;
  sessionStartTime: number;
  onOpenSettings: () => void;
  navConfig: NavItemConfig[];
}

// Map IDs to Icons statically
const ICON_MAP: Record<ViewState, React.ElementType> = {
  [ViewState.MANIFESTO]: Feather,
  [ViewState.LEXICON]: Sprout,
  [ViewState.IDENTITY]: Fingerprint,
  [ViewState.ATELIER]: Palette,
  [ViewState.VISION]: Layout,
  [ViewState.GATHERING]: Compass,
  [ViewState.JOURNAL]: BookOpen,
  [ViewState.CULTURAL_GAZE]: Eye,
  [ViewState.SENTIMENTS]: Mail,
  [ViewState.ARTIFACTS]: Gem,
  [ViewState.EPHEMERAL]: Mic,
  [ViewState.SIGNAL]: Radio,
};

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  setView, 
  isDarkMode, 
  toggleTheme, 
  isVisible, 
  toggleNav, 
  visitorCount,
  sessionStartTime,
  onOpenSettings,
  navConfig
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  const handleSecretClick = () => {
    setSecretClicks(prev => prev + 1);
    if (secretClicks + 1 === 5) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - sessionStartTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [isAdmin, sessionStartTime]);

  return (
    <>
      <button
        onClick={toggleNav}
        className={`fixed top-6 left-6 z-[60] p-3 bg-noir/80 backdrop-blur border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all duration-500 ease-in-out shadow-lg ${isVisible ? 'opacity-0 pointer-events-none -translate-x-full' : 'opacity-100 translate-x-0'}`}
        aria-label="Open Navigation"
      >
        <Menu size={20} />
      </button>

      <nav className={`fixed left-0 top-0 h-full w-20 md:w-64 bg-noir/90 backdrop-blur-md border-r border-white/5 z-50 flex flex-col justify-between py-12 transition-transform duration-500 ease-in-out overflow-y-auto scrollbar-hide ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-8 flex justify-between items-start">
          <div 
            onClick={handleSecretClick} 
            className="cursor-pointer select-none"
            title="NOIR ARCHIVE"
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-white hidden md:block leading-none group hover:text-accent transition-colors">
              NOIR<br />ARCHIVE
              {secretClicks > 0 && secretClicks < 5 && (
                 <span className="block h-0.5 bg-accent w-full mt-1 animate-pulse" style={{ width: `${secretClicks * 20}%`}}></span>
              )}
            </h1>
            <span className="font-display text-2xl font-bold text-white md:hidden">NA</span>
          </div>
          <button 
            onClick={toggleNav} 
            className="text-gray-600 hover:text-white transition-colors p-1"
            title="Hide Navigation"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-4 md:px-6 flex-1 justify-center">
          {navConfig.filter(item => item.isVisible).map((item) => {
            const Icon = ICON_MAP[item.id];
            return (
              <button
                key={item.id}
                onClick={() => !item.isLocked && setView(item.id)}
                disabled={item.isLocked}
                className={`group flex items-center gap-4 text-left transition-all duration-500 ${
                  currentView === item.id 
                    ? 'text-accent translate-x-2' 
                    : item.isLocked 
                      ? 'text-gray-700 cursor-not-allowed opacity-50'
                      : 'text-gray-600 hover:text-gray-300'
                }`}
              >
                {item.isLocked ? <Lock size={18} /> : <Icon size={18} className={`stroke-[1.5] ${currentView === item.id ? 'drop-shadow-[0_0_5px_rgba(201,160,80,0.5)]' : ''}`} />}
                <span className={`font-mono text-[10px] md:text-xs tracking-[0.2em] hidden md:block uppercase ${item.isLocked ? 'line-through decoration-red-900' : ''}`}>
                  {item.label}
                </span>
                {item.isLocked && <span className="md:hidden text-[8px] text-red-900">X</span>}
              </button>
            );
          })}
        </div>

        <div className="px-6 mt-8 space-y-6">
          <div className="hidden md:flex items-center gap-3 text-gray-500 border-t border-white/5 pt-4">
             <Users size={14} />
             <div>
               <p className="font-mono text-[9px] uppercase tracking-widest text-gray-600">Daily Witnesses</p>
               <p className="font-mono text-xs text-accent font-serif italic">{visitorCount.toString().padStart(4, '0')}</p>
             </div>
          </div>

          <div className="flex gap-4">
             <button 
              onClick={toggleTheme}
              className="flex items-center gap-4 text-gray-600 hover:text-white transition-colors group"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} className="stroke-[1.5]" /> : <Moon size={18} className="stroke-[1.5]" />}
            </button>

            <button
               onClick={onOpenSettings}
               className="flex items-center gap-4 text-gray-600 hover:text-accent transition-colors group"
               title="Archive Settings"
            >
               <Settings size={18} className="stroke-[1.5]" />
            </button>
          </div>

          <p className="text-[9px] text-gray-800 font-mono hidden md:block opacity-50">
            MULTIDIMENSIONAL<br />
            ENTITY © 2026
          </p>
        </div>
      </nav>
    </>
  );
};

export default Navigation;