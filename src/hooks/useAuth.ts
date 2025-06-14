import { useState, useEffect } from 'react';
import type { PlatformConnection } from '../types';
import { apiService } from '../services/api';

export const useAuth = () => {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    setLoading(true);
    const result = await apiService.getConnections();
    if (result.success && result.data) {
      setConnections(result.data);
      setError(null);
    } else {
      setError(result.error || 'Failed to fetch connections');
    }
    setLoading(false);
  };

  const connectPlatform = async (platform: string, code: string) => {
    const result = await apiService.authenticatePlatform(platform, code);
    if (result.success) {
      await fetchConnections();
      return true;
    } else {
      setError(result.error || 'Connection failed');
      return false;
    }
  };

  const isConnected = (platform: string) => {
    return connections.some(conn => conn.platform === platform && conn.connected);
  };

  const hasRequiredConnections = () => {
    const requiredPlatforms = ['youtube'];
    const messagingPlatforms = ['slack', 'line', 'discord'];
    
    const hasYoutube = isConnected('youtube');
    const hasMessaging = messagingPlatforms.some(platform => isConnected(platform));
    
    return hasYoutube && hasMessaging;
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return {
    connections,
    loading,
    error,
    connectPlatform,
    isConnected,
    hasRequiredConnections,
    refetch: fetchConnections
  };
};