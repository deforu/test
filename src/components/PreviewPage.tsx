import React, { useState } from 'react';
import { ArrowLeft, Play, Share2, Copy, Youtube, RefreshCw, CheckCircle, Send, Loader, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';
import { useMessages } from '../hooks/useMessages';
import type { ApologyData } from '../types';

interface PreviewPageProps {
  apologyData: ApologyData;
  onBack: () => void;
  onRetry: () => void;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ apologyData, onBack, onRetry }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { markMessageProcessed } = useMessages();

  const handleUploadToYouTube = async () => {
    if (!apologyData.videoUrl) {
      setError('動画URLが見つかりません');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const title = `謝罪動画 - ${new Date().toLocaleDateString('ja-JP')}`;
      const result = await apiService.uploadToYouTube(apologyData.videoUrl, title);
      
      if (result.success && result.data) {
        setYoutubeUrl(result.data.youtubeUrl);
      } else {
        setError(result.error || 'YouTubeへのアップロードに失敗しました');
      }
    } catch (err) {
      setError('YouTubeアップロード中にエラーが発生しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (youtubeUrl) {
      try {
        await navigator.clipboard.writeText(youtubeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError('URLのコピーに失敗しました');
      }
    }
  };

  const handleAutoShare = async () => {
    if (!youtubeUrl) {
      setError('YouTubeのURLが必要です');
      return;
    }

    setIsSharing(true);
    setError(null);

    try {
      const result = await apiService.shareToOriginalPlatform(apologyData.messageId, youtubeUrl);
      
      if (result.success) {
        setShared(true);
        markMessageProcessed(apologyData.messageId);
      } else {
        setError(result.error || '自動共有に失敗しました');
      }
    } catch (err) {
      setError('自動共有中にエラーが発生しました');
    } finally {
      setIsSharing(false);
    }
  };

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
              <span>ダッシュボードに戻る</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">謝罪動画プレビュー</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">AI謝罪動画の生成が完了しました！</h3>
              <p className="text-green-700 mt-1">
                以下で動画をプレビューし、YouTubeにアップロードして自動共有できます。
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <h4 className="text-red-800 font-medium">エラーが発生しました</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">動画プレビュー</h2>
            
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
              {apologyData.videoUrl ? (
                <video
                  src={apologyData.videoUrl}
                  controls
                  className="w-full h-full object-cover rounded-lg"
                  poster="/api/placeholder/640/360"
                >
                  <p>このブラウザは動画再生に対応していません</p>
                </video>
              ) : (
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium">AI生成謝罪動画</p>
                  <p className="text-sm opacity-90 mt-1">D-ID APIで生成</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>再生</span>
              </button>
              <button
                onClick={onRetry}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>やり直し</span>
              </button>
            </div>
          </div>

          {/* Apology Text */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">謝罪文</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 leading-relaxed">{apologyData.apologyText}</p>
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>文字数:</span>
                <span>{apologyData.apologyText.length}文字</span>
              </div>
              <div className="flex justify-between">
                <span>推定再生時間:</span>
                <span>約{Math.ceil(apologyData.apologyText.length / 100)}秒</span>
              </div>
              <div className="flex justify-between">
                <span>生成方法:</span>
                <span>Gemini AI + D-ID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">動画の共有</h2>
          
          {!youtubeUrl ? (
            <div className="text-center py-8">
              <Youtube className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">YouTubeにアップロード</h3>
              <p className="text-gray-600 mb-6">
                動画を限定公開でYouTubeにアップロードし、共有用URLを生成します。
              </p>
              
              {isUploading ? (
                <div className="inline-flex items-center space-x-3">
                  <Loader className="animate-spin h-6 w-6 text-red-500" />
                  <span className="text-gray-700">YouTubeにアップロード中...</span>
                </div>
              ) : (
                <button
                  onClick={handleUploadToYouTube}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Youtube className="w-5 h-5" />
                  <span>YouTubeにアップロード</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-green-800">YouTubeアップロード完了！</h3>
                </div>
                
                <p className="text-green-700 mb-4">
                  動画が正常にYouTubeにアップロードされました。以下のURLを使用して共有できます。
                </p>
                
                <div className="bg-white border border-green-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-gray-800 flex-1 mr-4 break-all">{youtubeUrl}</code>
                    <button
                      onClick={handleCopyUrl}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 flex-shrink-0 ${
                        copied
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>コピー済み</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>コピー</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Auto Share Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">自動共有</h3>
                
                {!shared ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Send className="w-6 h-6 text-blue-600 mr-3" />
                      <h4 className="text-lg font-semibold text-blue-800">元のプラットフォームに自動送信</h4>
                    </div>
                    
                    <p className="text-blue-700 mb-4">
                      謝罪動画のYouTubeリンクを、元のメッセージが送信されたプラットフォームに自動で返信します。
                    </p>
                    
                    {isSharing ? (
                      <div className="inline-flex items-center space-x-3">
                        <Loader className="animate-spin h-5 w-5 text-blue-600" />
                        <span className="text-blue-700">自動共有中...</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleAutoShare}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>自動共有を実行</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                      <h4 className="text-lg font-semibold text-green-800">自動共有完了！</h4>
                    </div>
                    <p className="text-green-700">
                      謝罪動画のリンクが元のプラットフォームに正常に送信されました。
                      この案件は解決済みとしてマークされました。
                    </p>
                  </div>
                )}
              </div>

              {/* Manual Share Options */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>他のアプリで共有</span>
                </button>
                <button
                  onClick={() => window.open(youtubeUrl, '_blank')}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>YouTubeで確認</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;