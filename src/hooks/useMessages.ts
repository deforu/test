import { useState, useEffect } from 'react';
import type { DetectedMessage } from '../types';
import { apiService } from '../services/api';

export const useMessages = () => {
  const [messages, setMessages] = useState<DetectedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const result = await apiService.getDetectedMessages();
    if (result.success && result.data) {
      setMessages(result.data);
      setError(null);
    } else {
      setError(result.error || 'Failed to fetch messages');
    }
    setLoading(false);
  };

  const markMessageProcessed = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, processed: true } : msg
      )
    );
  };

  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
    markMessageProcessed
  };
};