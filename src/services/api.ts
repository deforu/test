import axios from 'axios';
import type { DetectedMessage, ApologyData, PlatformConnection, APIResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Authentication
  async authenticatePlatform(platform: string, code: string): Promise<APIResponse<PlatformConnection>> {
    try {
      const response = await api.post('/auth/connect', { platform, code });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Authentication failed' };
    }
  },

  async getConnections(): Promise<APIResponse<PlatformConnection[]>> {
    try {
      const response = await api.get('/auth/connections');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch connections' };
    }
  },

  // Messages
  async getDetectedMessages(): Promise<APIResponse<DetectedMessage[]>> {
    try {
      const response = await api.get('/messages/detected');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch messages' };
    }
  },

  async analyzeMessage(messageId: string): Promise<APIResponse<{ summary: string; angerLevel: string }>> {
    try {
      const response = await api.post(`/messages/${messageId}/analyze`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to analyze message' };
    }
  },

  // Apology Generation
  async generateApologyText(messageId: string, summary: string): Promise<APIResponse<{ apologyText: string }>> {
    try {
      const response = await api.post('/apology/generate-text', { messageId, summary });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to generate apology text' };
    }
  },

  async generateApologyVideo(apologyText: string, photoFile: File): Promise<APIResponse<{ videoUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('apologyText', apologyText);
      formData.append('photo', photoFile);

      const response = await api.post('/apology/generate-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to generate video' };
    }
  },

  async uploadToYouTube(videoUrl: string, title: string): Promise<APIResponse<{ youtubeUrl: string }>> {
    try {
      const response = await api.post('/youtube/upload', { videoUrl, title });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to upload to YouTube' };
    }
  },

  async shareToOriginalPlatform(messageId: string, youtubeUrl: string): Promise<APIResponse<void>> {
    try {
      await api.post('/messages/share-response', { messageId, youtubeUrl });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to share response' };
    }
  },

  // Statistics
  async getStats(): Promise<APIResponse<any>> {
    try {
      const response = await api.get('/stats');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch stats' };
    }
  }
};