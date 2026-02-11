import React from 'react';
import { Instagram, Facebook, Youtube, ExternalLink, ArrowDown, Fingerprint, Dna, Scan, Microscope } from 'lucide-react';

const Identity: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#f4f4f4] text-[#121212] selection:bg-black selection:text-white relative overflow-hidden">
      
      {/* Background Grid - Biological Graph Paper */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Hero Section - The Specimen Label */}
      <section className="min-h-screen flex relative z-10">
        <div className="w-24 md:w-32 border-r border-black flex flex-col justify-between py-12 items-center bg-white/50 backdrop-blur-sm">
           <span className="writing-vertical-rl font-display font-bold text-4xl md:text-6xl tracking-tighter uppercase rotate-180">
             SUBJECT: 001
           </span>
           <div className="font-mono text-[9px] uppercase tracking-widest mt-auto mb-12 writing-vertical-rl rotate-180">
             Fig 1.A — Human Form
           </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-8 md:px-24 lg:px-40 relative">
          <div className="absolute top-20 right-20 opacity-20">
             <Dna size={300} strokeWidth={0.5} />
          </div>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-black text-white font-mono text-xs uppercase tracking-widest">Status: Active</span>
              <span className="px-3 py-1 border border-black font-mono text-xs uppercase tracking-widest">Class: Creator</span>
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tighter mb-12">
              BIOLOGICAL<br/>
              ARCHIVE
            </h1>
            
            <div className="border-l-2 border-black pl-8 space-y-6">
              <p className="font-serif text-2xl md:text-3xl italic leading-relaxed">
                "We are distilling the spirit from the noise. The identity is not a fixed point, but a trajectory calculated in real-time."
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                // Analysis of the Self
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Technical Anatomy */}
      <section className="min-h-screen border-t border-black flex flex-col md:flex-row">
         <div className="w-full md:w-1/2 p-12 border-b md:border-b-0 md:border-r border-black relative bg-white">
            <span className="absolute top-4 left-4 font-mono text-[10px] uppercase">Fig 2.0 — Origins</span>
            
            <div className="h-full flex flex-col justify-center">
              <div className="w-full aspect-square bg-gray-200 relative overflow-hidden grayscale contrast-125 mb-8">
                 <img src="https://picsum.photos/800/800?grayscale" alt="Specimen" className="w-full h-full object-cover mix-blend-multiply" />
                 {/* Overlay crosshairs */}
                 <div className="absolute inset-0 border border-black/10 m-4"></div>
                 <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20"></div>
                 <div className="absolute top-0 left-1/2 h-full w-[1px] bg-black/20"></div>
              </div>
              
              <h3 className="font-display text-4xl mb-4">The Substrate</h3>
              <p className="font-sans text-sm leading-7 text-justify">
                Grown in the cracks of brutalist concrete. Fed on static noise and monochromatic dreams. The subject exhibits a high tolerance for ambiguity and a structural need for poetic silence.
              </p>
            </div>
         </div>
         
         <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative bg-[#f4f4f4]">
            <span className="absolute top-4 left-4 font-mono text-[10px] uppercase">Fig 2.1 — Core Functions</span>

            <div className="space-y-12 max-w-md mx-auto">
               <div className="group cursor-pointer">
                  <div className="flex items-center justify-between border-b border-black pb-2 mb-2">
                    <span className="font-mono text-xs uppercase">Function_A</span>
                    <Scan className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  </div>
                  <h4 className="font-display text-2xl mb-1">Radical Authenticity</h4>
                  <p className="font-serif text-gray-600 text-sm italic">Truth as a physiological necessity.</p>
               </div>

               <div className="group cursor-pointer">
                  <div className="flex items-center justify-between border-b border-black pb-2 mb-2">
                    <span className="font-mono text-xs uppercase">Function_B</span>
                    <Microscope className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  </div>
                  <h4 className="font-display text-2xl mb-1">Aesthetic Discipline</h4>
                  <p className="font-serif text-gray-600 text-sm italic">Beauty is a survival mechanism, not a luxury.</p>
               </div>

               <div className="group cursor-pointer">
                  <div className="flex items-center justify-between border-b border-black pb-2 mb-2">
                    <span className="font-mono text-xs uppercase">Function_C</span>
                    <Fingerprint className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  </div>
                  <h4 className="font-display text-2xl mb-1">Eternal Recurrence</h4>
                  <p className="font-serif text-gray-600 text-sm italic">To build, destroy, and build again.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Section 3 - Connectivity Matrix (Socials) */}
      <section className="min-h-[50vh] border-t border-black bg-black text-white p-12 md:p-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 font-mono text-xs text-gray-500 text-right">
            SIGNAL_OUTPUT<br/>
            BROADCASTING...
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/20 border border-white/20">
            {[
              { icon: Instagram, label: "Visual Echoes", sub: "Instagram", link: "#" },
              { icon: Instagram, label: "Human Fragments", sub: "Private", link: "#" },
              { icon: Facebook, label: "The Network", sub: "Facebook", link: "#" },
              { icon: Youtube, label: "Moving Pictures", sub: "Youtube", link: "#" }
            ].map((item, idx) => (
              <a 
                key={idx} 
                href={item.link}
                className="bg-black p-8 hover:bg-white hover:text-black transition-all group flex flex-col justify-between h-48 md:h-64"
              >
                <div className="flex justify-between items-start">
                   <item.icon size={24} />
                   <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                   <span className="font-mono text-[9px] uppercase tracking-widest block mb-1 opacity-50">{item.sub}</span>
                   <span className="font-display text-xl leading-none">{item.label}</span>
                </div>
              </a>
            ))}
         </div>
         
         <div className="mt-12 text-center font-mono text-[10px] text-gray-600 uppercase tracking-[0.5em]">
            End of Specimen Report
         </div>
      </section>

    </div>
  );
};

export default Identity;