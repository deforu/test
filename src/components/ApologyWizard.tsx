import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, Edit3, Camera, Video, Share2, CheckCircle, Bot, Loader } from 'lucide-react';
import { apiService } from '../services/api';
import type { DetectedMessage, ApologyData } from '../types';

interface ApologyWizardProps {
  message: DetectedMessage;
  onComplete: (data: ApologyData) => void;
  onBack: () => void;
}

const steps = [
  { id: 1, title: '内容確認', icon: MessageSquare },
  { id: 2, title: 'AI謝罪文生成', icon: Edit3 },
  { id: 3, title: '写真アップロード', icon: Camera },
  { id: 4, title: '動画生成', icon: Video },
  { id: 5, title: '共有準備', icon: Share2 }
];

const ApologyWizard: React.FC<ApologyWizardProps> = ({ message, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [apologyText, setApologyText] = useState('');
  const [userPhoto, setUserPhoto] = useState<File | undefined>();
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateApologyText = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.generateApologyText(message.id, message.summary);
      if (result.success && result.data) {
        setApologyText(result.data.apologyText);
        handleNext();
      } else {
        setError(result.error || '謝罪文の生成に失敗しました');
      }
    } catch (err) {
      setError('謝罪文の生成中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルを選択してください');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('ファイルサイズは10MB以下にしてください');
        return;
      }
      setUserPhoto(file);
      setError(null);
    }
  };

  const generateVideo = async () => {
    if (!userPhoto || !apologyText) {
      setError('写真と謝罪文が必要です');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.generateApologyVideo(apologyText, userPhoto);
      if (result.success && result.data) {
        setVideoUrl(result.data.videoUrl);
        handleNext();
      } else {
        setError(result.error || '動画の生成に失敗しました');
      }
    } catch (err) {
      setError('動画生成中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    const apologyData: ApologyData = {
      messageId: message.id,
      apologyText,
      userPhoto,
      videoUrl,
      status: 'ready'
    };
    onComplete(apologyData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                AI検知されたメッセージ
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">送信者:</span>
                  <span className="font-medium">{message.sender}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">プラットフォーム:</span>
                  <span className="font-medium capitalize">{message.platform}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">怒りレベル:</span>
                  <span className="font-medium">
                    {message.angerLevel === 'high' ? '緊急' : 
                     message.angerLevel === 'medium' ? '中程度' : '軽微'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Bot className="w-4 h-4 mr-2" />
                AI要約（優しい表現に変換済み）
              </h4>
              <p className="text-gray-700 mb-4 leading-relaxed">{message.summary}</p>
              
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  元のメッセージを表示
                </summary>
                <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-700 text-sm leading-relaxed">{message.originalMessage}</p>
                </div>
              </details>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                <Bot className="w-5 h-5 mr-2" />
                AI謝罪文生成
              </h3>
              <p className="text-gray-600 mb-6">
                Gemini AIが状況に応じた適切で誠意のある謝罪文を生成します
              </p>
            </div>

            {!apologyText ? (
              <div className="text-center py-8">
                <button
                  onClick={generateApologyText}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>AI謝罪文を生成中...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5" />
                      <span>AI謝罪文を生成</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">生成された謝罪文</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                  <p className="text-gray-800 leading-relaxed">{apologyText}</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">謝罪文の編集（オプション）</h4>
                  <textarea
                    value={apologyText}
                    onChange={(e) => setApologyText(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="必要に応じて謝罪文を編集してください..."
                  />
                  <p className="text-sm text-gray-500">
                    文字数: {apologyText.length} / 500 | 推定読み上げ時間: 約{Math.ceil(apologyText.length / 100)}秒
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">顔写真のアップロード</h3>
              <p className="text-gray-600 mb-6">
                謝罪動画で使用する顔写真をアップロードしてください。正面を向いた鮮明な写真が推奨されます。
              </p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {userPhoto ? userPhoto.name : '写真をアップロード'}
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, WEBP形式をサポート（最大10MB）
                </p>
              </label>
            </div>

            {userPhoto && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">写真がアップロードされました</span>
                </div>
                <div className="mt-2 text-sm text-green-700">
                  ファイル名: {userPhoto.name} ({(userPhoto.size / 1024 / 1024).toFixed(2)}MB)
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                <Video className="w-5 h-5 mr-2" />
                AI謝罪動画生成
              </h3>
              <p className="text-gray-600 mb-6">
                D-ID APIを使用して、あなたの写真から自然な口の動きで謝罪動画を生成します
              </p>
            </div>

            {!videoUrl ? (
              <div className="text-center py-8">
                <button
                  onClick={generateVideo}
                  disabled={loading || !userPhoto || !apologyText}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>動画を生成中...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      <span>謝罪動画を生成</span>
                    </>
                  )}
                </button>
                {loading && (
                  <p className="text-sm text-gray-500 mt-3">
                    通常2-3分程度で完了します
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <h4 className="text-lg font-semibold text-green-800">動画生成完了！</h4>
                </div>
                <p className="text-green-700 mb-4">
                  謝罪動画が正常に生成されました。次のステップで共有準備を行います。
                </p>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <Video className="w-12 h-12 mx-auto mb-2" />
                    <p>生成された謝罪動画</p>
                    <p className="text-sm opacity-75">プレビューは次のステップで確認できます</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">共有準備完了</h3>
              <p className="text-gray-600 mb-8">
                謝罪動画の生成が完了しました。YouTubeへのアップロードと自動共有の準備ができています。
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <h4 className="font-medium text-gray-900">設定確認</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">対象メッセージ:</span>
                  <span className="text-gray-900">{message.sender}からの{message.platform}メッセージ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">謝罪文:</span>
                  <span className="text-gray-900">{apologyText.substring(0, 50)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">顔写真:</span>
                  <span className="text-gray-900">{userPhoto ? 'アップロード済み' : '未設定'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">動画:</span>
                  <span className="text-gray-900">{videoUrl ? '生成済み' : '未生成'}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleComplete}
                disabled={!videoUrl}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                <Share2 className="w-5 h-5" />
                <span>プレビュー画面に進む</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
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
            <h1 className="text-xl font-semibold text-gray-900">AI謝罪動画作成ウィザード</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
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

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>前へ</span>
            </button>

            <button
              onClick={handleNext}
              disabled={
                (currentStep === 2 && !apologyText) ||
                (currentStep === 3 && !userPhoto) ||
                (currentStep === 4 && !videoUrl) ||
                loading
              }
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>次へ</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApologyWizard;