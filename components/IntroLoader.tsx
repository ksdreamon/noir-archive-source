import React, { useState, useEffect } from 'react';

interface IntroLoaderProps {
  onComplete: () => void;
}

const WORDS = [
  "INITIALIZING",
  "ARCHIVE_01",
  "MEMORY",
  "VOID",
  "CONCRETE",
  "SILENCE",
  "ECHO",
  "STRUCTURE",
  "NOIR",
  "SYSTEM_READY"
];

const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [invert, setInvert] = useState(false);

  // Counter Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Non-linear increment for organic feel
        return prev + Math.floor(Math.random() * 5) + 1; 
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Rapid Word Cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
      // Random strobe effect
      if (Math.random() > 0.7) {
        setInvert(true);
        setTimeout(() => setInvert(false), 50);
      }
    }, 180); // Fast tempo

    return () => clearInterval(interval);
  }, []);

  // Completion Logic
  useEffect(() => {
    if (count >= 100) {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 1000); // Wait for exit animation
      }, 800);
    }
  }, [count, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-4 md:p-12 cursor-none transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      } ${invert ? 'bg-white text-black' : 'bg-[#050505] text-[#e0e0d8]'}`}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-start font-mono text-[10px] md:text-xs tracking-widest">
        <div className="flex flex-col">
          <span>NOIR_ARCHIVE_SYS</span>
          <span>V.4.0.2</span>
        </div>
        <div className="flex flex-col text-right">
          <span>{new Date().toLocaleDateString()}</span>
          <span>EST_CONN: SECURE</span>
        </div>
      </div>

      {/* Center Focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
        <div className="overflow-hidden">
          <h1 className={`font-display text-5xl md:text-9xl font-bold tracking-tighter transition-all duration-75 ${invert ? 'scale-110' : 'scale-100'}`}>
            {WORDS[wordIndex]}
          </h1>
        </div>
        <div className="mt-4 h-1 w-full max-w-md mx-auto bg-current opacity-20 overflow-hidden">
          <div 
            className="h-full bg-current transition-all duration-75 ease-linear"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end font-mono text-[10px] md:text-xs tracking-widest uppercase">
        <div className="w-32">
          {count < 100 ? 'LOADING_ASSETS...' : 'DECRYPTION_COMPLETE'}
        </div>
        
        <div className="text-6xl md:text-8xl font-display font-bold leading-none">
          {Math.min(count, 100)}%
        </div>
      </div>

      {/* Random Glitch Elements */}
      <div className="absolute top-1/3 left-10 w-2 h-2 bg-current animate-ping" />
      <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-current animate-ping delay-150" />
      
      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10" />
    </div>
  );
};

export default IntroLoader;