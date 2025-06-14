import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, Clock, Slack, MessageCircle, Hash, TrendingUp, Users, CheckCircle, Bot, Zap, RefreshCw } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import type { DetectedMessage } from '../types';

interface DashboardProps {
  onMessageSelect: (message: DetectedMessage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onMessageSelect }) => {
  const { messages, loading, error, refetch } = useMessages();
  const { connections } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'slack':
        return <Slack className="w-5 h-5" />;
      case 'line':
        return <MessageCircle className="w-5 h-5" />;
      case 'discord':
        return <Hash className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return '緊急';
      case 'medium':
        return '中程度';
      case 'low':
        return '軽微';
      default:
        return '不明';
    }
  };

  const unprocessedMessages = messages.filter(msg => !msg.processed);
  const processedMessages = messages.filter(msg => msg.processed);
  const connectedPlatforms = connections.filter(conn => conn.connected).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kara-AI-ge Dashboard</h1>
                <p className="text-sm text-gray-600">AI謝罪動画生成システム</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>更新</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{connectedPlatforms}個のプラットフォームと連携中</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">要対応</p>
                <p className="text-2xl font-semibold text-gray-900">{unprocessedMessages.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">解決済み</p>
                <p className="text-2xl font-semibold text-gray-900">{processedMessages.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">修復率</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {messages.length > 0 ? Math.round((processedMessages.length / messages.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">連携済み</p>
                <p className="text-2xl font-semibold text-gray-900">{connectedPlatforms}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                要対応：謝罪案件
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Zap className="w-4 h-4" />
                <span>AI自動検知システム稼働中</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">メッセージを読み込み中...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-red-600 mb-4">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p>メッセージの読み込みに失敗しました</p>
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                再試行
              </button>
            </div>
          ) : unprocessedMessages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">すべて解決済みです！</h3>
              <p className="text-gray-600">現在、対応が必要な謝罪案件はありません。</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {unprocessedMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onMessageSelect(message)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getPlatformIcon(message.platform)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-semibold text-gray-900">{message.sender}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(message.angerLevel)}`}>
                            {getSeverityText(message.angerLevel)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {message.timestamp}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{message.summary}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 capitalize">
                          {message.platform}から受信
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                          <Bot className="w-3 h-3" />
                          <span>AI謝罪動画を作成 →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processed Messages */}
        {processedMessages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                解決済み案件
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {processedMessages.slice(0, 5).map((message) => (
                <div key={message.id} className="p-6 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getPlatformIcon(message.platform)}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{message.sender}</h3>
                        <p className="text-xs text-gray-500">{message.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">解決済み</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;