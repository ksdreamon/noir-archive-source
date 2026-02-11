import React, { useState, useRef, useEffect } from 'react';
import { EphemeralMedia } from '../types';
import { Mic, Video, Archive, Play, Pause, Clock, Square, RotateCcw, Heart, Calendar, Edit2, Check, X } from 'lucide-react';

// Mock Data
const INITIAL_NOTES: EphemeralMedia[] = [
  {
    id: '1',
    type: 'AUDIO',
    src: 'mock-audio',
    createdAt: Date.now() - 1000000,
    expiresAt: Date.now() + 86400000, // Expires in 24h
    isArchived: false,
    transcription: "I felt a shift in the atmosphere today. The design needs more breathing room.",
    likes: 12,
    isLiked: false
  },
  {
    id: '2',
    type: 'VIDEO',
    src: 'mock-video',
    createdAt: Date.now() - 5000000,
    expiresAt: Date.now() - 1000, // Expired
    isArchived: false, // Changed to false to show expired state in Live tab for demo
    likes: 5,
    isLiked: true
  }
];

const Ephemeral: React.FC = () => {
  const [notes, setNotes] = useState<EphemeralMedia[]>(INITIAL_NOTES);
  const [activeTab, setActiveTab] = useState<'LIVE' | 'ARCHIVE'>('LIVE');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'AUDIO' | 'VIDEO' | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Custom Expiration State (Default: 24h from now)
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    // Format to YYYY-MM-DDThh:mm for input type="datetime-local"
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (expiresAt: number) => {
    const diff = expiresAt - currentTime;
    if (diff <= 0) return '00:00:00';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = (created: number, expires: number) => {
    const totalDuration = expires - created;
    const elapsed = currentTime - created;
    const remainingPercentage = 100 - (elapsed / totalDuration) * 100;
    return Math.max(0, Math.min(100, remainingPercentage));
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const expirationTimestamp = new Date(expiryDate).getTime();

        const newNote: EphemeralMedia = {
          id: Date.now().toString(),
          type: 'AUDIO',
          src: audioUrl,
          createdAt: Date.now(),
          expiresAt: expirationTimestamp,
          isArchived: false,
          transcription: "Voice Note " + new Date().toLocaleTimeString(),
          likes: 0,
          isLiked: false
        };
        
        setNotes(prev => [newNote, ...prev]);
        
        // Cleanup tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType('AUDIO');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingType(null);
    }
  };

  const toggleRecording = (type: 'AUDIO' | 'VIDEO') => {
    if (isRecording) {
      // Stop logic
      if (recordingType === 'AUDIO') {
        stopAudioRecording();
      } else {
        // Mock video stop logic
        setIsRecording(false);
        setRecordingType(null);
        
        // Create mock video note
        const expirationTimestamp = new Date(expiryDate).getTime();
        const newNote: EphemeralMedia = {
          id: Date.now().toString(),
          type: 'VIDEO',
          src: 'mock-video',
          createdAt: Date.now(),
          expiresAt: expirationTimestamp,
          isArchived: false,
          likes: 0,
          isLiked: false
        };
        setNotes(prev => [newNote, ...prev]);
      }
    } else {
      // Start logic
      if (type === 'AUDIO') {
        startAudioRecording();
      } else {
        // Mock video start
        setIsRecording(true);
        setRecordingType(type);
      }
    }
  };

  const handlePlay = (note: EphemeralMedia) => {
    if (note.type !== 'AUDIO') return;
    if (editingId === note.id) return; // Disable play while editing

    if (playingId === note.id) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
    } else {
      // Play
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // If mock data, we can't really play it, so just toggle state for UI
      if (note.src === 'mock-audio') {
        setPlayingId(note.id);
        setTimeout(() => setPlayingId(null), 2000); // Auto stop mock
        return;
      }

      const audio = new Audio(note.src);
      audio.onended = () => setPlayingId(null);
      audio.play().catch(e => console.error("Playback error:", e));
      audioRef.current = audio;
      setPlayingId(note.id);
    }
  };

  const toggleArchive = (id: string) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id ? { ...note, isArchived: !note.isArchived } : note
    ));
  };

  const toggleLike = (id: string) => {
    setNotes(prevNotes => prevNotes.map(note => {
      if (note.id === id) {
        return {
          ...note,
          isLiked: !note.isLiked,
          likes: note.isLiked ? note.likes - 1 : note.likes + 1
        };
      }
      return note;
    }));
  };

  // Editing Handlers
  const startEditing = (e: React.MouseEvent, note: EphemeralMedia) => {
    e.stopPropagation();
    setEditingId(note.id);
    setEditContent(note.transcription || '');
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingId) {
      setNotes(prev => prev.map(n => 
        n.id === editingId ? { ...n, transcription: editContent } : n
      ));
      setEditingId(null);
      setEditContent('');
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900 text-white p-8 md:p-12 lg:pl-32 flex flex-col">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-display text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-600">
            EPHEMERA
          </h2>
          <p className="font-mono text-xs mt-2 text-accent">
            THOUGHTS WITH AN EXPIRATION DATE
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('LIVE')}
            className={`font-mono text-sm px-4 py-2 border ${activeTab === 'LIVE' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
          >
            ACTIVE
          </button>
          <button 
            onClick={() => setActiveTab('ARCHIVE')}
            className={`font-mono text-sm px-4 py-2 border ${activeTab === 'ARCHIVE' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
          >
            ARCHIVE (PRIVATE)
          </button>
        </div>
      </header>

      {/* Expiration Configuration */}
      <div className="flex justify-center mb-8 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Calendar size={12} /> Set Self-Destruct Time
          </label>
          <input 
            type="datetime-local" 
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={isRecording}
            className="bg-neutral-800 border border-white/10 text-white font-mono text-sm px-4 py-2 rounded focus:outline-none focus:border-accent disabled:opacity-50"
          />
        </div>
      </div>

      {/* Recording Controls */}
      <div className="mb-16 flex justify-center gap-8">
        <button 
          onClick={() => toggleRecording('AUDIO')}
          disabled={isRecording && recordingType !== 'AUDIO'}
          className={`p-6 rounded-full border border-white/10 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed ${isRecording && recordingType === 'AUDIO' ? 'bg-red-500 animate-pulse border-red-500' : 'hover:bg-white/10'}`}
        >
          {isRecording && recordingType === 'AUDIO' ? <Square size={32} /> : <Mic size={32} />}
        </button>
        <button 
          onClick={() => toggleRecording('VIDEO')}
          disabled={isRecording && recordingType !== 'VIDEO'}
          className={`p-6 rounded-full border border-white/10 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed ${isRecording && recordingType === 'VIDEO' ? 'bg-red-500 animate-pulse border-red-500' : 'hover:bg-white/10'}`}
        >
          {isRecording && recordingType === 'VIDEO' ? <Square size={32} /> : <Video size={32} />}
        </button>
      </div>

      {isRecording && (
        <div className="text-center font-mono text-red-500 animate-pulse mb-8 tracking-widest uppercase">
          {recordingType === 'AUDIO' ? 'Recording Audio Sequence...' : 'Recording Visual Data...'}
        </div>
      )}

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes
          .filter(n => {
            const isExpired = n.expiresAt <= currentTime;
            if (activeTab === 'LIVE') {
              // Live tab only shows active, non-expired, non-archived notes
              return !n.isArchived && !isExpired;
            } else {
              // Archive tab shows manually archived OR expired notes (private archive)
              return n.isArchived || isExpired;
            }
          })
          .map((note) => {
            const isPlaying = playingId === note.id;
            const progress = calculateProgress(note.createdAt, note.expiresAt);
            const timeLeft = formatTimeLeft(note.expiresAt);
            const isExpired = timeLeft === '00:00:00';
            const isEditing = editingId === note.id;
            
            return (
              <div 
                key={note.id} 
                className={`bg-black border p-6 relative group overflow-hidden transition-all duration-500 ${
                  isExpired && !note.isArchived 
                    ? 'border-red-900/50 shadow-[0_0_20px_rgba(127,29,29,0.15)] animate-pulse-slow grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:animate-none' 
                    : 'border-white/10'
                }`}
              >
                {/* Decay Indicator */}
                {!note.isArchived && !isExpired && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                    <div 
                      className="h-full bg-accent transition-all duration-1000 ease-linear"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                
                {/* Expired Overlay */}
                {isExpired && !note.isArchived && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                     <div className="font-display text-4xl md:text-5xl text-red-900/40 -rotate-12 border-4 border-red-900/40 px-6 py-2 uppercase tracking-widest font-bold mix-blend-screen select-none">
                       DECAYED
                     </div>
                     <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay"></div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-2 rounded transition-colors ${isPlaying ? 'bg-accent text-black' : (isExpired && !note.isArchived ? 'bg-white/5 text-gray-600' : 'bg-white/5 text-gray-400')}`}>
                    {note.type === 'AUDIO' ? <Mic size={20} /> : <Video size={20} />}
                  </div>
                  <div className={`font-mono text-[10px] flex items-center gap-1 ${isExpired && !note.isArchived ? 'text-red-700 animate-pulse' : 'text-gray-500'}`}>
                     <Clock size={10} /> 
                     {note.isArchived ? 'ARCHIVED' : (isExpired ? 'SIGNAL LOST' : `DECAY: ${timeLeft}`)}
                  </div>
                </div>

                <div 
                  className={`h-32 flex items-center justify-center bg-white/5 mb-4 transition-colors cursor-pointer relative z-10 ${isExpired && !note.isArchived ? 'bg-red-900/5 group-hover:bg-red-900/10' : 'group-hover:bg-white/10'}`}
                  onClick={() => handlePlay(note)}
                >
                  {isPlaying ? (
                    <Pause size={32} className="text-accent animate-pulse" />
                  ) : (
                    <Play size={32} className={`transition-opacity ${isExpired && !note.isArchived ? 'text-gray-700 opacity-30' : 'opacity-50 group-hover:opacity-100'}`} />
                  )}
                </div>

                {/* Editable Content Area */}
                <div className="relative z-10 mb-4 min-h-[3rem]">
                  {isEditing ? (
                    <div className="flex flex-col gap-2 animate-fade-in">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 p-2 font-serif text-sm text-white focus:outline-none focus:border-accent resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={saveEdit} className="p-1 text-green-500 hover:text-green-400" title="Save">
                          <Check size={16} />
                        </button>
                        <button onClick={cancelEditing} className="p-1 text-red-500 hover:text-red-400" title="Cancel">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group/text relative">
                      {note.transcription ? (
                        <p className={`font-serif italic text-sm line-clamp-2 ${isExpired && !note.isArchived ? 'text-gray-600 line-through decoration-red-900/50' : 'text-gray-400'}`}>
                          "{note.transcription}"
                        </p>
                      ) : (
                        <p className="font-mono text-[10px] text-gray-600 italic">No text content...</p>
                      )}
                      
                      {/* Edit Trigger */}
                      <button 
                        onClick={(e) => startEditing(e, note)}
                        className="absolute top-0 right-0 p-1 text-gray-600 hover:text-white opacity-0 group-hover/text:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded"
                        title="Edit Note"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5 relative z-10">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleLike(note.id);
                     }}
                     className="flex items-center gap-2 group/like"
                   >
                     <Heart size={14} className={`transition-colors ${note.isLiked ? 'fill-accent text-accent' : (isExpired && !note.isArchived ? 'text-gray-700' : 'text-gray-500 group-hover/like:text-white')}`} />
                     <span className={`font-mono text-[10px] ${note.isLiked ? 'text-accent' : (isExpired && !note.isArchived ? 'text-gray-700' : 'text-gray-500')}`}>{note.likes}</span>
                   </button>

                  <div className="flex gap-2">
                    {activeTab === 'LIVE' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleArchive(note.id);
                        }}
                        className={`transition-colors ${isExpired ? 'text-gray-600 hover:text-white' : 'text-gray-600 hover:text-white'}`}
                        title="Archive to Save"
                      >
                        <Archive size={16} />
                      </button>
                    )}

                    {activeTab === 'ARCHIVE' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleArchive(note.id);
                        }}
                        className="text-gray-600 hover:text-accent transition-colors"
                        title="Restore to Live"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {notes.filter(n => {
            const isExpired = n.expiresAt <= currentTime;
            if (activeTab === 'LIVE') return !n.isArchived && !isExpired;
            return n.isArchived || isExpired;
        }).length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-600 font-mono">
             NO DATA IN THIS SECTOR
          </div>
        )}
      </div>
    </div>
  );
};

export default Ephemeral;