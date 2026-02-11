
export enum ViewState {
  MANIFESTO = 'MANIFESTO',
  IDENTITY = 'IDENTITY', // Who I am, Roots, History
  ATELIER = 'ATELIER', // Art Gallery, Sketches, Process
  GATHERING = 'GATHERING', // Events, Clues, Calendar
  JOURNAL = 'JOURNAL',
  VISION = 'VISION', // Architecture & Portfolio
  EPHEMERAL = 'EPHEMERAL', // Temporary Voice/Video notes
  CULTURAL_GAZE = 'CULTURAL_GAZE', // Reviews, Inspirations, Lapidarium
  ARTIFACTS = 'ARTIFACTS', // Shop/Art
  SENTIMENTS = 'SENTIMENTS', // Postcards, Bottles, Letters
  SIGNAL = 'SIGNAL', // Contact
  LEXICON = 'LEXICON', // The Garden of Ideas / Eden
}

export type Language = 'PL' | 'EN' | 'ES' | 'DE';

export interface NavItemConfig {
  id: ViewState;
  label: string;
  isVisible: boolean; // If false, completely hidden from menu
  isLocked: boolean;  // If true, visible but disabled/crossed out
}

export interface AppSettings {
  issueNumber: number;
  year: number;
  bannerText: string[];
  theme: 'dark' | 'light';
  navigation: NavItemConfig[];
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  content: string;
  language: Language;
  image?: string;
  tags: string[];
  status: 'PUBLISHED' | 'DRAFT';
  likes: number;
  isLiked: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: 'Architecture' | 'Life' | 'Art';
  description: string;
  imageUrl: string;
  details?: string;
}

export interface EphemeralMedia {
  id: string;
  type: 'AUDIO' | 'VIDEO';
  src: string; // URL or base64
  createdAt: number;
  expiresAt: number; // Timestamp
  isArchived: boolean;
  transcription?: string;
  likes: number;
  isLiked: boolean;
}

export interface ManifestoSection {
  title: string;
  text: string;
}

export type CulturalType = 'REVIEW' | 'MUSIC' | 'THOUGHT' | 'CINEMA' | 'VOICE';

export interface CulturalItem {
  id: string;
  type: CulturalType;
  title: string;
  subtitle?: string; // e.g., Artist name or Director
  content: string; // Review text or thought
  rating?: number; // 1-5 stars (abstract representation)
  image?: string;
  link?: string;
}

export interface Artifact {
  id: string;
  title: string;
  type: 'PAINTING' | 'LETTER' | 'OBJECT';
  price?: string;
  status: 'AVAILABLE' | 'SOLD' | 'FUTURE';
  image: string;
  description: string;
}

export interface Artwork {
  id: string;
  title: string;
  type: 'SKETCHBOOK' | 'CANVAS' | 'PLEIN_AIR' | 'PROCESS';
  date: string;
  image: string;
  description?: string;
}

export interface EventItem {
  id: string;
  type: 'MYSTERY' | 'CURATED';
  title: string;
  date: string;
  time: string;
  location?: string; // For Curated
  clue?: string; // For Mystery
  description?: string; // Curator's highlight/reason
  isDecrypted?: boolean; // State for Mystery
  link?: string;
}

export interface IdeaItem {
  id: string;
  term: string;
  type: 'NEOLOGISM' | 'REDEFINITION';
  definition: string;
  etymology?: string; // The "roots"
  visual?: string; // Abstract shape or image
}