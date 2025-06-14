export interface DetectedMessage {
  id: string;
  platform: 'slack' | 'line' | 'discord';
  sender: string;
  originalMessage: string;
  summary: string;
  angerLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  channelId?: string;
  processed: boolean;
}

export interface ApologyData {
  messageId: string;
  apologyText: string;
  userPhoto?: File;
  videoUrl?: string;
  youtubeUrl?: string;
  status: 'draft' | 'generating' | 'ready' | 'shared';
}

export interface PlatformConnection {
  platform: 'slack' | 'line' | 'discord' | 'youtube';
  connected: boolean;
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export type AppPage = 'landing' | 'setup' | 'dashboard' | 'wizard' | 'preview';