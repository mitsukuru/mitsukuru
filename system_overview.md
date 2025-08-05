# ミツクル システム構成図

## 🏗️ 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────┐
│                      Mitsukuru Platform                        │
│         個人開発プロジェクト共有プラットフォーム                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend       │    │    Backend       │    │    Database      │
│   React 18       │◄──►│   Rails 7.0.8    │◄──►│   SQLite3        │
│   Vite + SCSS    │    │   API Only       │    │                  │
│   Port: 5173     │    │   Port: 3000     │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

## 🔐 認証システム（OAuth + Session）

```
1. 新規ユーザーログイン
┌─────────────┐  GitHub OAuth  ┌─────────────┐  認証成功  ┌─────────────┐
│    User     │ ────────────►  │   GitHub    │ ─────────► │   Rails     │
│             │                │    OAuth    │            │  Backend    │
└─────────────┘                └─────────────┘            └─────────────┘
                                                                   │
                                                          ┌────────▼────────┐
                                                          │ User作成 +      │
                                                          │ Session設定     │
                                                          │ onboarding=false│
                                                          └────────┬────────┘
                                                                   │
                                                          ┌────────▼────────┐
                                                          │ Redirect to     │
                                                          │ /onboarding     │
                                                          └─────────────────┘

2. 既存ユーザーログイン
┌─────────────┐  GitHub OAuth  ┌─────────────┐  認証成功  ┌─────────────┐
│    User     │ ────────────►  │   GitHub    │ ─────────► │   Rails     │
│             │                │    OAuth    │            │  Backend    │
└─────────────┘                └─────────────┘            └─────────────┘
                                                                   │
                                                          ┌────────▼────────┐
                                                          │ Session設定     │
                                                          │ onboarding=true?│
                                                          └────────┬────────┘
                                                                   │
                                                          ┌────────▼────────┐
                                                          │ Redirect to     │
                                                          │ /home           │
                                                          └─────────────────┘
```

## 📱 オンボーディングフロー（新規ユーザー）

```
Step 1: リダイレクト
┌─────────────────────────────────────────────────────────────────┐
│ http://localhost:5173/onboarding?user=eyJpZCI6MiwibmFtZS...     │
│                                                                 │
│ URLパラメータにbase64エンコードされたユーザー情報               │
│ {id: 2, name: "masaa0802", email: "...", onboarding: false}    │
└─────────────────────────────────────────────────────────────────┘
                                   │
Step 2: リポジトリ取得              ▼
┌──────────────────┐  API Call   ┌─────────────────────────────────┐
│  Onboarding      │────────────►│ GET /api/v1/onboarding/         │
│  Component       │             │ repositories?user_id=2          │
│                  │◄────────────│                                 │
└──────────────────┘  Response   │ Mock Data:                      │
                                 │ - my-awesome-app (TypeScript)   │
                                 │ - portfolio-site (JavaScript)  │
                                 │ - todo-app (React)              │
                                 └─────────────────────────────────┘
                                   │
Step 3: リポジトリ選択              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Repository Selection UI                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│ │my-awesome-  │ │portfolio-   │ │todo-app     │                │
│ │app         │ │site         │ │             │                │
│ │TypeScript  │ │JavaScript   │ │React        │                │
│ │⭐ 5        │ │⭐ 12        │ │⭐ 8         │                │
│ └─────────────┘ └─────────────┘ └─────────────┘                │
│            ▲                                                   │
│         Selected                                               │
└─────────────────────────────────────────────────────────────────┘
                                   │
Step 4: 投稿作成                   ▼
┌──────────────────┐  API Call   ┌─────────────────────────────────┐
│  Complete        │────────────►│ POST /api/v1/onboarding/        │
│  Onboarding      │             │ complete                        │
│                  │◄────────────│                                 │
└──────────────────┘  Response   │ Creates:                        │
                                 │ - New Post with repo data       │
                                 │ - onboarding_completed = true   │
                                 │ - Redirect to /home             │
                                 └─────────────────────────────────┘
```

## 🗄️ データベース構造

```
┌──────────────────────────────────────────────────────────────────┐
│                          Database Schema                         │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     Users       │         │      Posts      │         │ Authentications │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄─┐   ┌─►│ id (PK)         │         │ id (PK)         │
│ email           │  │   │  │ title           │         │ user_id (FK)    │◄─┐
│ name            │  │   │  │ body            │         │ provider        │  │
│ remote_avatar_  │  │   │  │ description     │         │ uid             │  │
│ url             │  └───┤  │ image_url       │         │ created_at      │  │
│ onboarding_     │      │  │ additional_     │         │ updated_at      │  │
│ completed       │      │  │ images          │         └─────────────────┘  │
│ first_login_at  │      │  │ published_at    │                            │
│ created_at      │      │  │ repository_name │                            │
│ updated_at      │      │  │ repository_url  │                            │
└─────────────────┘      │  │ repository_     │                            │
                         │  │ description     │                            │
                         │  │ user_id (FK)    │────────────────────────────┘
                         │  │ created_at      │
                         │  │ updated_at      │
                         │  └─────────────────┘
                         │
                    Has Many Posts
```

## 🚦 ルーティング構造

### バックエンド（Rails Routes）
```
API Endpoints:
┌─────────────────────────────────────────────────────────────────┐
│ GET    /api/v1/posts              # 投稿一覧                   │
│ POST   /api/v1/posts              # 新規投稿作成               │
│ GET    /api/v1/posts/:id          # 投稿詳細                   │
│ GET    /api/v1/users              # ユーザー一覧               │
│ GET    /api/v1/me                 # 現在のユーザー情報         │
│                                                                 │
│ OAuth:                                                          │
│ GET    /api/v1/github             # GitHub OAuth開始           │
│ GET    /api/v1/callback           # OAuth コールバック         │
│                                                                 │
│ Onboarding:                                                     │
│ GET    /api/v1/onboarding/repositories  # リポジトリ一覧       │
│ POST   /api/v1/onboarding/complete      # オンボーディング完了 │
└─────────────────────────────────────────────────────────────────┘
```

### フロントエンド（React Router）
```
Frontend Routes:
┌─────────────────────────────────────────────────────────────────┐
│ /                    # ランディングページ (requireAuth: false) │
│ /sign_in             # サインインページ (requireAuth: false)   │
│ /auth/loading        # 認証処理中ページ (no protection)        │
│ /onboarding          # オンボーディング (requireAuth: false)   │
│                                                                 │
│ /home                # ホームページ (requireAuth: true)        │
│ /users               # ユーザー一覧 (requireAuth: true)        │
│ /users/:id/posts     # ユーザー投稿 (requireAuth: true)        │
│ /posts/new           # 新規投稿 (requireAuth: true)            │
│ /post/:id            # 投稿詳細 (requireAuth: true)            │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 データフロー（投稿一覧表示）

```
1. ホームページアクセス
┌─────────────┐  Request   ┌─────────────┐  API Call  ┌─────────────┐
│   Browser   │──────────►│   React     │──────────►│   Rails     │
│             │            │   /home     │            │   API       │
└─────────────┘            └─────────────┘            └─────────────┘
                                   ▲                          │
                                   │                          ▼
                           ┌───────────────┐          ┌─────────────┐
                           │  Post Cards   │          │ SQLite DB   │
                           │  - Title      │◄─────────│ posts table │
                           │  - Description│  Response │ users table │
                           │  - Images     │          └─────────────┘
                           │  - User Info  │
                           └───────────────┘

2. 投稿データ構造
{
  "id": 1,
  "title": "TaskManager Pro",
  "description": "Reactで作ったモダンなタスク管理アプリ...",
  "body": "## 技術スタック\n- React 18\n- TypeScript...",
  "repository_name": "task-manager-pro",
  "repository_url": "https://github.com/user/task-manager-pro",
  "all_images": [
    { "url": "/uploads/post/image/1/main.png" },
    { "url": "/uploads/post/additional_images/1/screenshot1.png" }
  ],
  "user": {
    "id": 1,
    "name": "tanaka_dev",
    "remote_avatar_url": "https://avatars.githubusercontent.com/..."
  }
}
```

## 🎨 UI/UX 特徴

```
Design System:
┌─────────────────────────────────────────────────────────────────┐
│ Color Scheme:                                                   │
│ - Gradients: linear-gradient(135deg, #667eea, #764ba2)        │
│ - Text: Black/White contrast                                   │
│ - Backgrounds: Glassmorphism with backdrop-filter             │
│                                                                 │
│ Components:                                                     │
│ - Modern card layouts with hover animations                    │
│ - Image sliders with thumbnail navigation                      │
│ - Responsive grid layouts                                       │
│ - Loading states and error handling                            │
│                                                                 │
│ Technologies:                                                   │
│ - SCSS Modules for component-scoped styling                   │
│ - Lucide React icons                                           │
│ - CSS Grid & Flexbox layouts                                   │
└─────────────────────────────────────────────────────────────────┘
```

## ⚙️ 現在の状態

### ✅ 実装済み機能
- GitHub OAuth認証システム
- 新規ユーザーオンボーディングフロー
- リポジトリ選択機能（モックデータ）
- 投稿作成・一覧表示・詳細表示
- 複数画像アップロード・表示
- ユーザー管理システム
- レスポンシブデザイン

### 🚧 技術的な制約
- GitHub API: アクセストークンが保存されていないため、現在はモックデータを使用
- 認証: セッション + パラメータベースのハイブリッド方式
- データベース: SQLite3（開発環境用）

### 🎯 システムの目的
個人開発者が自分のプロジェクトを簡単に共有し、他の開発者のプロジェクトを発見できるプラットフォームとして機能。GitHub連携により、技術的な詳細情報も含めた総合的なプロジェクト紹介が可能。