export enum Screen {
  Home = 'Home',
  Learn = 'Learn',
  Play = 'Play',
  Nourish = 'Nourish',
  Find = 'Find',
  Tools = 'Tools',
  Chat = 'Chat',
  Blog = 'Blog',
}

export interface Game {
  title: string;
  category: 'Focus' | 'Impulse Control' | 'Calming';
  age: string;
  description: string;
}

export interface Recipe {
    title: string;
    category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    description: string;
    ingredients: string[];
}

export interface Provider {
    name: string;
    address: string;
    phone: string;
    specialization: string;
}

export interface Reminder {
    id: number;
    medication: string;
    time: string;
}

export interface ChecklistItem {
    id: number;
    task: string;
    completed: boolean;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface GroundingChunk {
    web?: {
        uri: string;
        title: string;
    };
    maps?: {
        uri: string;
        title: string;
        placeAnswerSources?: {
            reviewSnippets: {
                uri: string;
                title: string;
            }[];
        }[];
    };
}

export interface Article {
  id: number;
  title: string;
  category: string;
  content: string; // Can contain basic HTML
  createdAt: string; // ISO date string
  isFavorite?: boolean;
}