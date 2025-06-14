import React from 'react';
import { MessageSquare, Zap, Shield, TrendingUp, Play, ArrowRight, Bot, Video, Share2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kara-AI-ge Tei-AI-shoku</h1>
              <p className="text-xs text-gray-600">AI謝罪動画生成システム</p>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            始める
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>AI技術による自動謝罪システム</span>
          </div>
          
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            もう怒られるのは<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              怖くない
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            AIがあなたに代わって真摯に謝罪します。メッセージの感情を自動検知し、
            あなたの顔写真から謝罪動画を生成。人間関係の修復を迅速にサポートします。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>無料で試してみる</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>デモを見る</span>
            </button>
          </div>

          {/* Process Flow */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. 自動検知</h3>
              <p className="text-gray-600">
                Slack、LINE、DiscordでAIが怒りのメッセージを自動検知し、内容を優しく要約します
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. 動画生成</h3>
              <p className="text-gray-600">
                あなたの顔写真とAI生成の謝罪文から、自然な口の動きで謝罪する動画を作成
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. 自動共有</h3>
              <p className="text-gray-600">
                YouTubeに限定公開でアップロードし、元のプラットフォームに自動で謝罪動画を送信
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">主要機能</h3>
            <p className="text-xl text-gray-600">最新のAI技術による包括的な謝罪支援システム</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">メッセージ連携</h4>
              <p className="text-gray-700">Slack、LINE、Discordと連携し、怒りのメッセージを自動検知・要約</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">AI謝罪文生成</h4>
              <p className="text-gray-700">Gemini AIが状況に応じた適切で誠意のある謝罪文を自動生成</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">動画生成</h4>
              <p className="text-gray-700">D-ID APIであなたの写真から自然な口の動きで謝罪動画を生成</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">自動共有</h4>
              <p className="text-gray-700">YouTube限定公開アップロードと元プラットフォームへの自動送信</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">謝罪の効果的なタイミング</h3>
            <p className="text-xl opacity-90">データに基づく人間関係修復の重要性</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold mb-3">87%</div>
              <div className="text-lg opacity-90">24時間以内の謝罪による関係修復率</div>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold mb-3">3日</div>
              <div className="text-lg opacity-90">謝罪なしでの関係悪化平均期間</div>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-bold mb-3">+150%</div>
              <div className="text-lg opacity-90">2023年退職代行サービス利用増加率</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            今すぐ始めて、人間関係の悩みを解決しましょう
          </h3>
          <p className="text-xl text-gray-600 mb-10">
            無料トライアルで、AIによる謝罪システムの効果を実感してください
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-12 py-4 rounded-xl text-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            無料で始める
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-2xl font-bold">Kara-AI-ge Tei-AI-shoku</h4>
          </div>
          <p className="text-gray-400">
            © 2025 Kara-AI-ge Tei-AI-shoku. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;