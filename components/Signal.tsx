import React, { useState, useEffect } from 'react';
import { Send, Radio } from 'lucide-react';

const Signal: React.FC = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  const [glitch, setGlitch] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setStatus('SENDING');
    setGlitch(true);
    
    // Simulate mysterious network delay
    setTimeout(() => {
      setStatus('SENT');
      setMessage('');
      setGlitch(false);
      
      setTimeout(() => setStatus('IDLE'), 3000);
    }, 2000);
  };

  return (
    <div className={`w-full h-screen bg-black text-green-500 p-8 md:p-12 lg:pl-32 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-100 ${glitch ? 'invert' : ''}`}>
      
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20"></div>

      <div className="max-w-2xl w-full z-30">
        <div className="flex items-center gap-4 mb-12 opacity-50">
          <Radio className="animate-pulse" />
          <span className="font-mono text-xs tracking-[0.5em] uppercase">Frequency: 99.9 MHZ (THE VOID)</span>
        </div>

        {status === 'SENT' ? (
          <div className="text-center animate-fade-in">
            <h2 className="font-display text-4xl mb-4">TRANSMISSION RECEIVED</h2>
            <p className="font-serif italic text-gray-500">Your words have been absorbed by the archive.</p>
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write to the entity..."
              className="w-full h-64 bg-transparent border-l-2 border-green-900/50 p-6 font-mono text-lg md:text-xl focus:outline-none focus:border-green-500 text-green-400 placeholder-green-900 resize-none transition-colors"
              spellCheck={false}
            />
            
            <div className="mt-8 flex justify-end">
               <button 
                onClick={handleSend}
                disabled={status === 'SENDING' || !message}
                className="group flex items-center gap-4 font-display text-xl uppercase hover:text-white transition-colors disabled:opacity-30"
               >
                 {status === 'SENDING' ? 'ENCRYPTING...' : 'RELEASE SIGNAL'}
                 <Send size={20} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-12 left-0 w-full text-center">
        <p className="font-mono text-[10px] text-green-900">
           WARNING: MESSAGES SENT HERE MAY ECHO FOR ETERNITY
        </p>
      </div>
    </div>
  );
};

export default Signal;