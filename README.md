# Kara-AI-ge Tei-AI-shoku

AI謝罪動画生成システム - AIがあなたに代わって真摯に謝罪します。

## 概要

Kara-AI-ge Tei-AI-shokuは、メッセージングプラットフォーム（Slack、LINE、Discord）で受信した怒りのメッセージを自動検知し、AIが適切な謝罪動画を生成・共有する革新的なシステムです。

## 主要機能

### 1. メッセージ自動検知
- Slack、LINE、Discordとの連携
- Gemini AIによる感情分析
- 怒りのメッセージを優しい表現で要約

### 2. AI謝罪文生成
- 状況に応じた適切な謝罪文を自動生成
- ユーザーによる編集・カスタマイズ可能

### 3. 謝罪動画生成
- D-ID APIを使用した高品質な動画生成
- ユーザーの顔写真から自然な口の動きを再現

### 4. 自動共有システム
- YouTube限定公開アップロード
- 元のプラットフォームへの自動返信

## 技術スタック

### フロントエンド
- React 18 + TypeScript
- Tailwind CSS
- Lucide React (アイコン)
- Vite (ビルドツール)

### API連携
- **AI分析・生成**: Google Gemini API
- **動画生成**: D-ID API
- **メッセージング**: Slack API, LINE Messaging API, Discord API
- **動画共有**: YouTube Data API v3

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.example`を`.env`にコピーし、必要なAPIキーを設定してください。

```bash
cp .env.example .env
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

## API設定

### 必要なAPIキー
1. **Google Gemini API**: テキスト分析・生成用
2. **D-ID API**: 動画生成用
3. **YouTube Data API**: 動画アップロード用
4. **各プラットフォームAPI**: メッセージ連携用
   - Slack API
   - LINE Messaging API
   - Discord API

### OAuth設定
各プラットフォームでOAuthアプリケーションを作成し、適切なスコープを設定してください。

## 使用方法

1. **プラットフォーム連携**: 必要なサービスとアカウントを連携
2. **自動監視**: AIがメッセージを監視し、怒りを検知
3. **謝罪動画作成**: ウィザードに従って謝罪動画を生成
4. **自動共有**: YouTubeアップロード後、元のプラットフォームに自動送信

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── LandingPage.tsx
│   ├── SetupPage.tsx
│   ├── Dashboard.tsx
│   ├── ApologyWizard.tsx
│   └── PreviewPage.tsx
├── hooks/              # カスタムフック
│   ├── useAuth.ts
│   └── useMessages.ts
├── services/           # API連携
│   └── api.ts
├── types/              # TypeScript型定義
│   └── index.ts
└── App.tsx
```

## ライセンス

© 2025 Kara-AI-ge Tei-AI-shoku. All rights reserved.