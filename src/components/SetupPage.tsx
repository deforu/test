import React, { useState } from 'react';
import { ArrowLeft, Check, ExternalLink, Slack, MessageCircle, Hash, Youtube, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SetupPageProps {
  onBack: () => void;
  onComplete: () => void;
}

const platforms = [
  {
    id: 'slack',
    name: 'Slack',
    icon: Slack,
    description: 'ワークスペースのメッセージを監視',
    color: 'bg-purple-600',
    required: false
  },
  {
    id: 'line',
    name: 'LINE',
    icon: MessageCircle,
    description: 'LINEメッセージを監視',
    color: 'bg-green-600',
    required: false
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: Hash,
    description: 'Discordサーバーのメッセージを監視',
    color: 'bg-indigo-600',
    required: false
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    description: '謝罪動画のアップロード用',
    color: 'bg-red-600',
    required: true
  }
];

const SetupPage: React.FC<SetupPageProps> = ({ onBack, onComplete }) => {
  const { connections, loading, connectPlatform, isConnected, hasRequiredConnections } = useAuth();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    
    // Simulate OAuth flow
    try {
      // In a real app, this would redirect to OAuth provider
      const mockCode = `mock_code_${platformId}_${Date.now()}`;
      const success = await connectPlatform(platformId, mockCode);
      
      if (success) {
        // Connection successful
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setConnecting(null);
    }
  };

  const canProceed = hasRequiredConnections();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>戻る</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">プラットフォーム連携設定</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            アカウントを連携してください
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            メッセージの監視と謝罪動画の共有のために、以下のプラットフォームとの連携が必要です。
            すべて安全なOAuth認証を使用します。
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {platforms.map((platform) => {
            const connected = isConnected(platform.id);
            const isConnecting = connecting === platform.id;
            const Icon = platform.icon;

            return (
              <div
                key={platform.id}
                className={`bg-white rounded-xl border-2 p-6 transition-all ${
                  connected 
                    ? 'border-green-200 bg-green-50' 
                    : platform.required 
                      ? 'border-red-200' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{platform.name}</span>
                        {platform.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            必須
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  
                  {connected ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">接続済み</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        isConnecting
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isConnecting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                          <span>接続中...</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          <span>接続</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {platform.required && !connected && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>この連携は必須です</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">接続状況</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">YouTube（必須）</span>
              <div className={`flex items-center space-x-2 ${isConnected('youtube') ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected('youtube') ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {isConnected('youtube') ? '接続済み' : '未接続'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">メッセージングプラットフォーム</span>
              <div className={`flex items-center space-x-2 ${
                ['slack', 'line', 'discord'].some(p => isConnected(p)) ? 'text-green-600' : 'text-red-600'
              }`}>
                {['slack', 'line', 'discord'].some(p => isConnected(p)) ? 
                  <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />
                }
                <span className="text-sm font-medium">
                  {['slack', 'line', 'discord'].filter(p => isConnected(p)).length}個接続済み
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onComplete}
            disabled={!canProceed}
            className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canProceed ? 'ダッシュボードに進む' : '必要な連携を完了してください'}
          </button>
          
          {!canProceed && (
            <p className="text-sm text-gray-500 mt-3">
              YouTubeと少なくとも1つのメッセージングプラットフォームの連携が必要です
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupPage;