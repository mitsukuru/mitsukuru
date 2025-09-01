# ミツクル（mitsukuru）

**個人開発プロジェクトを共有するソーシャルプラットフォーム**

ミツクル（mitsukuru）は、開発者が個人プロジェクトを発見・共有できるソーシャルプラットフォームです。GitHubと連携し、プロジェクトの信頼性を可視化する機能を提供します。

## ✨ 主な機能

### 🔐 認証システム
- **GitHub OAuth認証**: GitHubアカウントでのシンプルログイン
- **セッション管理**: 安全な認証状態の維持

### 📝 プロジェクト投稿・管理
- **プロジェクト投稿**: タイトル、説明、複数画像のアップロード
- **GitHub連携**: リポジトリURLから自動的にプロジェクト情報を取得
- **タグ機能**: プロジェクトの分類とフィルタリング
- **画像ギャラリー**: 複数画像のスライド表示

### 🔍 GitHub API統合
- **リポジトリ詳細**: スター数、フォーク数、ウォッチャー数
- **コミット履歴**: 最新のコミット情報と開発活動
- **コントリビューター**: プロジェクトへの貢献者情報
- **言語統計**: 使用技術の可視化
- **Issue統計**: プロジェクトの課題管理状況

### ✅ プロジェクト信頼性検証
- **信頼度スコア**: 複数の指標から自動算出（0-100%）
- **証拠の可視化**: 
  - ✅ ソースコード公開状況
  - ✅ 開発アクティビティ
  - ✅ 技術スタックの証明
  - ✅ コラボレーション実績

### 💬 ソーシャル機能
- **コメント機能**: 投稿への議論・フィードバック
- **絵文字リアクション**: 👍 ❤️ 😄 😮 😢 😡 などの反応
- **通知システム**: コメント・リアクションの通知

### 📱 モダンなUI/UX
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- **画像モーダル**: スライド表示とキーボード操作
- **タブインターフェース**: 概要・GitHub詳細・信頼性の3つのビュー
- **ダークモード対応**: 設定によるテーマ切り替え

## 🏗️ 技術スタック

### バックエンド
- **Framework**: Ruby on Rails 7.0.8 (API mode)
- **Database**: SQLite3 (開発環境), PostgreSQL (本番想定)
- **Authentication**: Sorcery gem (GitHub OAuth)
- **File Upload**: CarrierWave
- **External API**: GitHub API v3, OpenAI API (プロジェクト分析)

### フロントエンド
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: SCSS Modules
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite with path aliases

### 開発ツール
- **Linting**: ESLint (React用設定)
- **Version Control**: Git with conventional commits
- **Environment**: dotenv for configuration

## 🚀 セットアップ手順

### 必要な環境
- Ruby 3.1.6
- Node.js 18.x 以上
- Git

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/mitsukuru.git
cd mitsukuru
```

### 2. バックエンドのセットアップ
```bash
# 依存関係のインストール
bundle install

# データベースの作成とマイグレーション
rails db:create
rails db:migrate
rails db:seed

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してGitHub OAuthの設定を追加
```

### 3. フロントエンドのセットアップ
```bash
cd client

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 4. 開発サーバーの起動
```bash
# バックエンド (ターミナル1)
rails server

# フロントエンド (ターミナル2)
cd client && npm run dev
```

アプリケーションにアクセス:
- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:3000

## 🔧 環境変数の設定

`.env`ファイルを作成し、以下の設定を追加:

```env
# GitHub OAuth設定
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OpenAI API (プロジェクト分析機能)
OPENAI_API_KEY=your_openai_api_key

# セキュリティ
SECRET_KEY_BASE=your_secret_key_base
```

### GitHub OAuth アプリの設定
1. GitHub Settings → Developer settings → OAuth Apps
2. 新しいOAuthアプリを作成
3. Authorization callback URL: `http://localhost:3000/api/v1/callback/github`

## 📁 プロジェクト構成

```
mitsukuru/
├── app/                    # Railsアプリケーション
│   ├── controllers/api/v1/ # APIコントローラー
│   ├── models/             # データモデル
│   └── services/           # ビジネスロジック
├── client/                 # Reactフロントエンド
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── api/           # API呼び出し関数
│   │   ├── contexts/      # React Context
│   │   └── assets/        # 静的アセット
│   ├── public/            # 公開ファイル
│   └── package.json       # Node.js依存関係
├── config/                # Rails設定
├── db/                    # データベース関連
│   ├── migrate/          # マイグレーションファイル
│   └── schema.rb         # データベーススキーマ
└── public/uploads/       # アップロードファイル保存先
```

## 🎨 主要な画面・機能

### 🏠 ホーム画面
- プロジェクト一覧とフィルタリング
- タグベースの絞り込み
- リアクション数とコメント数の表示

### 📖 プロジェクト詳細画面
- **概要タブ**: プロジェクト説明と技術スタック
- **GitHub詳細タブ**: リポジトリ統計・コミット履歴・コントリビューター
- **検証・信頼性タブ**: プロジェクトの信頼度評価

### 📝 プロジェクト投稿画面
- マークダウン対応のエディター
- 複数画像のドラッグ&ドロップアップロード
- GitHubリポジトリの自動連携

## 🔌 API エンドポイント

### 認証
- `GET /api/v1/github` - GitHub OAuth開始
- `POST /api/v1/callback` - OAuth コールバック
- `GET /api/v1/auth/status` - 認証状態確認
- `POST /api/v1/auth/logout` - ログアウト

### プロジェクト
- `GET /api/v1/posts` - プロジェクト一覧
- `GET /api/v1/posts/:id` - プロジェクト詳細
- `POST /api/v1/posts` - プロジェクト作成
- `PUT /api/v1/posts/:id` - プロジェクト更新
- `DELETE /api/v1/posts/:id` - プロジェクト削除

### GitHub API統合
- `GET /api/v1/github/repository/:owner/:repo` - リポジトリ詳細
- `GET /api/v1/github/repository/:owner/:repo/commits` - コミット履歴
- `GET /api/v1/github/repository/:owner/:repo/contributors` - コントリビューター
- `GET /api/v1/github/repository/:owner/:repo/languages` - 言語統計
- `GET /api/v1/github/repository/:owner/:repo/issues` - Issue統計

### ソーシャル機能
- `GET /api/v1/posts/:id/comments` - コメント一覧
- `POST /api/v1/posts/:id/comments` - コメント投稿
- `POST /api/v1/posts/:id/reactions/toggle` - リアクション切り替え
- `GET /api/v1/notifications` - 通知一覧

## 🧪 テスト

```bash
# バックエンドテスト
rails test

# フロントエンドリンター
cd client && npm run lint
```

## 🚢 デプロイ

### 本番環境の準備
1. PostgreSQLデータベースの設定
2. 環境変数の本番用設定
3. 画像アップロード先の設定（AWS S3等）

### ビルド
```bash
# フロントエンドビルド
cd client && npm run build

# Rails本番環境
RAILS_ENV=production rails assets:precompile
RAILS_ENV=production rails db:migrate
```

## 🎯 今後の開発予定

- [ ] **リアルタイム通知** - WebSocketによる即座の通知
- [ ] **プロジェクト検索** - Elasticsearch統合の高度検索
- [ ] **フォロー機能** - ユーザー間の関係性
- [ ] **プロジェクトランキング** - 人気度・新着・トレンドの指標
- [ ] **API公開** - 外部開発者向けのREST API
- [ ] **モバイルアプリ** - React Native版の開発

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📞 サポート・お問い合わせ

- **Issues**: [GitHub Issues](https://github.com/your-username/mitsukuru/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/mitsukuru/discussions)
- **Email**: your-email@example.com

---

**Mitsukuru** - 優れた個人開発プロジェクトを見つけ、つながりを作る場所 🚀