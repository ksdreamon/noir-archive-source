import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CulturalItem, CulturalType } from '../types';
import { Play, Star, Quote, Film, Music, Mic, Plus, X, Save, Share2, Activity, Eye, Grab, Hand, ArrowLeft, Maximize, ExternalLink, GitCommit, CornerDownRight } from 'lucide-react';

const MOCK_GAZE: CulturalItem[] = [
  {
    id: '1',
    type: 'CINEMA',
    title: 'The Zone of Interest',
    subtitle: 'Jonathan Glazer',
    content: 'A masterclass in designing the unseen. The horror is not in the frame, but in the sound design. Brutalist approach to narrative. \n\nWe observe the banality of evil through a lens that refuses to blink. The garden wall becomes the most terrifying structure in cinema history. It separates the idyllic from the infernal, proving that architecture is never neutral. \n\nGlazer does not ask us to sympathize; he asks us to witness the terrifying ease of compartmentalization.',
    rating: 5,
    image: 'https://picsum.photos/id/237/600/600?grayscale' 
  },
  {
    id: '2',
    type: 'THOUGHT',
    title: 'Lapidarium Entry #49',
    content: 'We are all just debris floating in a curated universe. I found a piece of concrete today that looked like a heart. I kept it. \n\nIt was heavy, rough, and cold. Just like the memories I try to suppress but end up displaying on the mantle. Why do we collect fragments? Perhaps to prove that something whole once existed.',
    image: 'https://picsum.photos/id/16/600/600?grayscale' 
  },
  {
    id: '3',
    type: 'MUSIC',
    title: 'On The Nature of Daylight',
    subtitle: 'Max Richter',
    content: 'This piece structures my mornings. It builds a cathedral of melancholy. \n\nThe strings do not weep; they construct a geometry of grief. It is mathematical in its sadness, precise in its ability to dismantle my defenses before the coffee is even brewed.',
    link: 'Spotify',
    image: 'https://picsum.photos/id/39/600/600?grayscale' 
  },
  {
    id: '4',
    type: 'REVIEW',
    title: 'Modernist Failures',
    subtitle: 'Architecture Review',
    content: 'Why do we crave sterile spaces? Perhaps to feel the chaos of our own minds more clearly. \n\nMinimalism is often mistaken for clarity, but sometimes it is just the erasure of the human stain. We polish the concrete until we can see our own distorted reflections, wondering where the warmth went.',
    rating: 4,
  },
  {
    id: '5',
    type: 'VOICE',
    title: 'Late Night Manifesto',
    content: 'Audio log recording... thoughts on the dimensionality of time. \n\nIs the future pulling us forward, or is the past pushing us? I feel like I am standing still while the scenery moves on a conveyor belt. The static in the air tonight is palpable.',
    link: 'Audio_Source_01'
  },
  {
    id: '6',
    type: 'THOUGHT',
    title: 'Digital Decay',
    content: 'Do our digital footprints rust? Or do they just vanish? \n\nImagine a digital archaeology a thousand years from now. Recovering corrupted JPEGs like pottery shards. "Here lies the meme culture of the early 21st century." A tragedy in low resolution.',
    image: 'https://picsum.photos/id/69/600/600?grayscale'
  },
  {
    id: '7',
    type: 'CINEMA',
    title: 'Blade Runner 2049',
    subtitle: 'Dennis Villeneuve',
    content: 'The color orange as an emotion. Loneliness in high definition. \n\nVilleneuve understands that the future is not just chrome; it is dust. It is radiation. It is silence. K walks through the ruins of Las Vegas like a ghost haunting a graveyard of excess.',
    rating: 5,
    image: 'https://picsum.photos/id/55/600/600?grayscale'
  }
];

const TYPES: CulturalType[] = ['REVIEW', 'MUSIC', 'THOUGHT', 'CINEMA', 'VOICE'];

interface LivingNode extends CulturalItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
}

const CulturalGaze: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<LivingNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<CulturalItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  // Interaction Refs
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    hasMoved: boolean;
  } | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Form State
  const [formType, setFormType] = useState<CulturalType>('THOUGHT');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formRating, setFormRating] = useState<number>(0);
  const [formLink, setFormLink] = useState('');
  const [formImage, setFormImage] = useState('');

  // --------------------------------------------------------------------------
  // PHYSICS & INITIALIZATION
  // --------------------------------------------------------------------------
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const initialNodes: LivingNode[] = MOCK_GAZE.map((item) => {
      const baseSize = item.image ? 80 : 50; 
      return {
        ...item,
        x: Math.random() * (width - 200) + 100,
        y: Math.random() * (height - 200) + 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: baseSize + Math.random() * 20,
        mass: baseSize // Mass proportional to size
      };
    });
    setNodes(initialNodes);
  }, []);

  // --------------------------------------------------------------------------
  // GLOBAL MOUSE HANDLERS (For smooth dragging)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      if (dragRef.current) {
        // Calculate distance moved to distinguish click vs drag
        const dist = Math.hypot(e.clientX - dragRef.current.startX, e.clientY - dragRef.current.startY);
        if (dist > 5) {
          dragRef.current.hasMoved = true;
        }
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // --------------------------------------------------------------------------
  // PHYSICS ANIMATION LOOP
  // --------------------------------------------------------------------------
  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      setNodes((prevNodes) => {
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        // Clone nodes to mutate
        const nextNodes = prevNodes.map(n => ({ ...n }));

        // 1. Movement & Wall Collisions
        for (let i = 0; i < nextNodes.length; i++) {
          const node = nextNodes[i];
          const isDragging = dragRef.current?.id === node.id;

          if (isDragging) {
            // Dragging Logic
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            
            // Calculate velocity based on throw speed (difference between frames)
            // Smooth it out slightly
            node.vx = (mx - node.x) * 0.2; 
            node.vy = (my - node.y) * 0.2;

            node.x = mx;
            node.y = my;
          } else {
            // Standard Physics
            if (node.id === hoveredNodeId) {
                // Gentle freeze/slowdown on hover
                node.vx *= 0.9;
                node.vy *= 0.9;
            }

            node.x += node.vx;
            node.y += node.vy;

            // Wall Bounce
            if (node.x <= node.radius) {
                node.x = node.radius;
                node.vx *= -1;
            } else if (node.x >= width - node.radius) {
                node.x = width - node.radius;
                node.vx *= -1;
            }

            if (node.y <= node.radius) {
                node.y = node.radius;
                node.vy *= -1;
            } else if (node.y >= height - node.radius) {
                node.y = height - node.radius;
                node.vy *= -1;
            }
          }
        }

        // 2. Node-to-Node Collisions (Elastic)
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const n1 = nextNodes[i];
            const n2 = nextNodes[j];

            // Ignore collision calculation if one is being dragged (prevents jitter)
            if (dragRef.current?.id === n1.id || dragRef.current?.id === n2.id) continue;

            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = n1.radius + n2.radius;

            if (distance < minDistance) {
              // Collision Detected
              
              // Resolve Overlap (move them apart so they don't stick)
              const overlap = minDistance - distance;
              const nx = dx / distance;
              const ny = dy / distance;
              
              const moveX = nx * overlap * 0.5;
              const moveY = ny * overlap * 0.5;
              
              n1.x -= moveX;
              n1.y -= moveY;
              n2.x += moveX;
              n2.y += moveY;

              // Elastic Collision Response (Swap Velocities roughly)
              const v1n = n1.vx * nx + n1.vy * ny;
              const v2n = n2.vx * nx + n2.vy * ny;

              // If moving apart, skip
              if (v1n - v2n < 0) continue; // Already moving away
              
              // Standard collision impulse
              const m1 = n1.mass;
              const m2 = n2.mass;
              
              const common = (2 * (v1n - v2n)) / (m1 + m2);
              
              n1.vx -= common * m2 * nx;
              n1.vy -= common * m2 * ny;
              n2.vx += common * m1 * nx;
              n2.vy += common * m1 * ny;
            }
          }
        }

        return nextNodes;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredNodeId]); // Re-bind if hover state changes to ensure closure has latest state

  // --------------------------------------------------------------------------
  // INTERACTION HANDLERS
  // --------------------------------------------------------------------------

  const handleMouseDown = (e: React.MouseEvent, node: LivingNode) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
        id: node.id,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        hasMoved: false
    };
  };

  const handleNodeClick = (node: LivingNode) => {
    // Only open if we haven't dragged the node significantly (threshold check in mouseUp logic)
    if (!dragRef.current?.hasMoved) {
        setSelectedNode(node);
    }
  };

  const connections = useMemo(() => {
    const lines: React.ReactElement[] = [];
    const threshold = 350; 

    nodes.forEach((nodeA, i) => {
      nodes.slice(i + 1).forEach((nodeB) => {
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          // Use a non-linear opacity drop-off for subtlety
          const opacity = Math.pow(1 - distance / threshold, 1.5);
          const isHighlight = hoveredNodeId === nodeA.id || hoveredNodeId === nodeB.id;
          
          lines.push(
            <line
              key={`${nodeA.id}-${nodeB.id}`}
              x1={nodeA.x}
              y1={nodeA.y}
              x2={nodeB.x}
              y2={nodeB.y}
              stroke={isHighlight ? "#c9a050" : "rgba(255, 255, 255, 0.15)"}
              strokeWidth={isHighlight ? 1.5 : 1}
              strokeDasharray={isHighlight ? "none" : "4 8"} 
              strokeLinecap="round"
              className={!isHighlight ? "animate-dash" : ""}
              style={{ 
                opacity: isHighlight ? 0.8 : opacity * 0.3, 
                transition: 'opacity 0.3s ease, stroke 0.3s ease',
                filter: isHighlight ? 'drop-shadow(0 0 6px rgba(201,160,80,0.4))' : 'none',
              }}
            />
          );
        }
      });
    });
    return lines;
  }, [nodes, hoveredNodeId]);


  const handlePublish = () => {
    if (!formTitle || !formContent) return;

    const width = containerRef.current?.clientWidth || window.innerWidth;
    const height = containerRef.current?.clientHeight || window.innerHeight;

    const baseSize = formImage ? 80 : 50;

    const newItem: LivingNode = {
      id: Date.now().toString(),
      type: formType,
      title: formTitle,
      subtitle: formSubtitle || undefined,
      content: formContent,
      rating: formRating > 0 ? formRating : undefined,
      link: formLink || undefined,
      image: formImage || undefined,
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 2, // Pop out with speed
      vy: (Math.random() - 0.5) * 2,
      radius: baseSize,
      mass: baseSize
    };

    setNodes(prev => [...prev, newItem]);
    resetForm();
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormType('THOUGHT');
    setFormTitle('');
    setFormSubtitle('');
    setFormContent('');
    setFormRating(0);
    setFormLink('');
    setFormImage('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CINEMA': return <Film size={12} />;
      case 'MUSIC': return <Music size={12} />;
      case 'THOUGHT': return <Quote size={12} />;
      case 'REVIEW': return <Star size={12} />;
      case 'VOICE': return <Mic size={12} />;
      default: return <Quote size={12} />;
    }
  };

  // --------------------------------------------------------------------------
  // FULL SCREEN IMMERSIVE VIEW (Thread View)
  // --------------------------------------------------------------------------
  if (selectedNode) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-paper overflow-y-auto animate-fade-in custom-scrollbar">
         {/* Top Navigation */}
         <div className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 px-8 py-6 flex justify-between items-center">
            <button 
              onClick={() => setSelectedNode(null)}
              className="group flex items-center gap-4 text-gray-500 hover:text-white transition-colors uppercase font-mono text-xs tracking-widest"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> 
              Close Thread
            </button>
            <div className="flex items-center gap-2 text-accent">
               <GitCommit size={14} className="rotate-90" />
               <span className="font-mono text-xs tracking-[0.3em] uppercase">THREAD_ID: {selectedNode.id}</span>
            </div>
         </div>

         {/* Hero Section */}
         <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
            
            {/* Thread Line Visualization */}
            <div className="absolute top-0 bottom-0 left-8 md:left-24 lg:left-1/2 w-[1px] bg-gradient-to-b from-accent/50 to-transparent -z-10 hidden lg:block"></div>

            {/* Visual Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
               <div className="sticky top-32">
                 {selectedNode.image ? (
                   <div className="relative group overflow-hidden border border-white/10">
                     <img 
                      src={selectedNode.image} 
                      alt={selectedNode.title} 
                      className="w-full aspect-[4/5] object-cover grayscale contrast-125 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                     />
                     <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-20 pointer-events-none"></div>
                     <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur px-3 py-1 border border-white/20 font-mono text-[9px] uppercase">
                        Fig. A — Subject Data
                     </div>
                   </div>
                 ) : (
                   <div className="w-full aspect-[4/5] border border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"></div>
                      <div className="text-gray-600 animate-pulse-slow">
                        {getTypeIcon(selectedNode.type)}
                      </div>
                      <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-gray-500">No Visual Artifact</p>
                   </div>
                 )}
                 
                 <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-4">
                    <div className="flex gap-1">
                       {selectedNode.rating && [...Array(5)].map((_, i) => (
                         <Star key={i} size={14} className={i < selectedNode.rating! ? "fill-accent text-accent" : "text-gray-800"} />
                       ))}
                    </div>
                    {selectedNode.link && (
                      <a href={selectedNode.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-accent hover:text-white transition-colors border-b border-accent/50 pb-0.5 hover:border-white">
                        SOURCE LINK <ExternalLink size={12} />
                      </a>
                    )}
                 </div>
               </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 order-1 lg:order-2">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                 <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                    Live Node • {selectedNode.type}
                 </span>
               </div>
               
               <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-6 break-words">
                 {selectedNode.title}
               </h1>
               {selectedNode.subtitle && (
                 <h2 className="font-serif text-2xl md:text-3xl text-gray-400 italic mb-12">
                   {selectedNode.subtitle}
                 </h2>
               )}

               <div className="font-serif text-xl md:text-2xl leading-[1.8] text-gray-300 text-justify border-l-2 border-accent pl-8 md:pl-12 py-2 relative">
                 <CornerDownRight className="absolute -left-[9px] -top-2 text-accent bg-[#050505] p-0.5" size={16} />
                 <p className="drop-cap whitespace-pre-line">
                   {selectedNode.content}
                 </p>
               </div>
               
               {/* Footer of Article */}
               <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="font-mono text-[10px] uppercase text-gray-600 tracking-widest text-center md:text-left">
                    <p>Logged in Sector: {selectedNode.type}</p>
                    <p>Timestamp: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-6">
                    <button className="flex items-center gap-2 font-mono text-xs uppercase hover:text-accent transition-colors">
                      <Share2 size={16} /> Share Thread
                    </button>
                    <button className="flex items-center gap-2 font-mono text-xs uppercase hover:text-accent transition-colors">
                      <Save size={16} /> Archive
                    </button>
                  </div>
               </div>
            </div>

         </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // DEFAULT VIEW (The Constellation)
  // --------------------------------------------------------------------------

  return (
    <div ref={containerRef} className="w-full h-screen bg-[#050505] text-paper relative overflow-hidden cursor-grab active:cursor-grabbing">
      
      {/* Component Specific Styles */}
      <style>{`
        @keyframes dash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 24; }
        }
        .animate-dash {
          animation: dash 60s linear infinite;
        }
      `}</style>

      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)] z-0"></div>

      {/* SVG Network Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {connections}
      </svg>

      {/* Header */}
      <div className="absolute top-8 left-8 md:left-32 z-20 pointer-events-none select-none">
        <h2 className="font-display text-4xl md:text-6xl tracking-widest uppercase text-concrete mix-blend-difference">Cultural Gaze</h2>
        <p className="font-serif italic text-sm md:text-xl mt-2 text-gray-500">
          A constellation of artifacts. Drag to rearrange. Click to expand thread.
        </p>
      </div>

      <div className="absolute top-8 right-8 z-30">
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur border border-white/20 hover:bg-white hover:text-black transition-all font-mono text-xs uppercase rounded-full shadow-lg hover:shadow-accent/20"
        >
          <Plus size={16} /> Add Node
        </button>
      </div>

      {/* Nodes Render */}
      {nodes.map((node) => {
        const isHovered = hoveredNodeId === node.id;
        const size = node.radius * 2;
        const isBeingDragged = dragRef.current?.id === node.id;
        
        return (
          <div
            key={node.id}
            className={`absolute z-10 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group`}
            style={{ 
              left: node.x, 
              top: node.y,
              width: size,
              height: size,
              transition: isBeingDragged ? 'none' : 'width 0.5s, height 0.5s, z-index 0s', // No transition on position during drag for responsiveness
              zIndex: isHovered || isBeingDragged ? 50 : 10,
              cursor: isBeingDragged ? 'grabbing' : 'grab'
            }}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onMouseDown={(e) => handleMouseDown(e, node)}
            onClick={() => handleNodeClick(node)}
          >
            {/* The Planet/Orb */}
            <div className={`
              relative w-full h-full rounded-full border border-white/10 bg-[#0a0a0a] overflow-hidden
              shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-500
              ${isHovered ? 'border-accent scale-110 shadow-[0_0_50px_rgba(201,160,80,0.4)]' : 'hover:border-white/30'}
              ${isBeingDragged ? 'border-white shadow-[0_0_80px_rgba(255,255,255,0.2)]' : ''}
            `}>
              {/* Image Content (Visual Miniature) */}
              {node.image ? (
                <>
                  <img 
                    src={node.image} 
                    alt={node.title} 
                    className={`w-full h-full object-cover transition-all duration-700 pointer-events-none select-none ${isHovered ? 'grayscale-0 scale-110' : 'grayscale scale-100 opacity-60'}`}
                  />
                  {/* Subtle Grain Overlay */}
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none"></div>
                </>
              ) : (
                /* Text/Icon Content (Abstract Planet) */
                <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm p-4 text-center pointer-events-none select-none">
                   <div className={`mb-2 transition-colors ${isHovered ? 'text-accent' : 'text-gray-500'}`}>
                      {getTypeIcon(node.type)}
                   </div>
                   {isHovered && (
                     <span className="font-mono text-[8px] uppercase tracking-widest text-white animate-fade-in">
                       {node.type}
                     </span>
                   )}
                </div>
              )}

              {/* Orbit Ring (Decoration) */}
              <div className={`absolute inset-0 rounded-full border border-white/20 scale-125 opacity-0 transition-all duration-700 pointer-events-none ${isHovered ? 'opacity-100 rotate-180 scale-110' : ''}`}></div>
            </div>

            {/* Label / Tooltip (Floating outside the planet) */}
            <div className={`
              absolute top-full mt-4 bg-black/90 backdrop-blur border-l-2 border-accent px-4 py-3 min-w-[200px] max-w-[300px]
              transition-all duration-300 pointer-events-none z-20 shadow-xl
              ${isHovered && !isBeingDragged ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
            `}>
               <div className="flex justify-between items-start mb-1">
                 <span className="font-mono text-[9px] text-accent tracking-widest uppercase">{node.type}</span>
                 {node.rating && <div className="flex text-accent text-[8px] gap-0.5">{"★".repeat(node.rating)}</div>}
               </div>
               <h4 className="font-display text-sm text-white leading-tight mb-1">{node.title}</h4>
               {node.subtitle && <p className="font-serif italic text-xs text-gray-500">{node.subtitle}</p>}
               
               {isHovered && (
                 <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-accent flex items-center justify-between uppercase">
                   <span>Click to Open Thread</span>
                   <Maximize size={10} />
                 </div>
               )}
            </div>
          </div>
        );
      })}

      {/* Publication Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-auto">
          <div className="bg-[#151515] border border-white/10 w-full max-w-2xl p-8 md:p-12 relative animate-fade-in shadow-2xl">
            <button 
              onClick={() => setIsAdding(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="font-display text-2xl mb-8 text-white">Crystallize Thought</h3>

            <div className="space-y-6">
              {/* Type Selector */}
              <div className="flex flex-wrap gap-2">
                {TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setFormType(type)}
                    className={`flex items-center gap-2 px-3 py-2 font-mono text-[10px] border transition-all uppercase ${formType === type ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                  >
                    {getTypeIcon(type)} {type}
                  </button>
                ))}
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Subject / Title..." 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 p-2 font-serif text-xl focus:outline-none focus:border-accent placeholder-gray-600"
                />
                <input 
                  type="text" 
                  placeholder="Subtitle / Author (Optional)..." 
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 p-2 font-mono text-xs focus:outline-none focus:border-accent placeholder-gray-600"
                />
              </div>

              {/* Content */}
              <textarea 
                placeholder="The critique, the feeling, the observation..." 
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full h-32 bg-white/5 border border-white/10 p-4 font-sans text-sm focus:outline-none focus:border-accent resize-none placeholder-gray-600 text-gray-300"
              />

              {/* Meta Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="relative">
                    <label className="block font-mono text-[9px] text-gray-500 mb-1">RATING (1-5)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          onClick={() => setFormRating(star === formRating ? 0 : star)}
                          className={`text-lg transition-colors ${star <= formRating ? 'text-accent' : 'text-gray-700 hover:text-gray-500'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                 </div>
                 
                 <div className="md:col-span-2">
                    <label className="block font-mono text-[9px] text-gray-500 mb-1">VISUAL / LINK SOURCE</label>
                    <input 
                      type="text" 
                      placeholder="Image URL..." 
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 p-1 font-mono text-xs focus:outline-none focus:border-accent placeholder-gray-700 mb-2"
                    />
                    <input 
                      type="text" 
                      placeholder="External Link..." 
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 p-1 font-mono text-xs focus:outline-none focus:border-accent placeholder-gray-700"
                    />
                 </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handlePublish}
                  className="bg-white text-black px-8 py-3 font-display text-sm hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Save size={16} /> PUBLISH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalGaze;