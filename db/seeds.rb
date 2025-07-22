# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "シードデータを作成中..."

# ユーザーデータ（多様なパターン）
users_data = [
  {
    name: "tanaka_dev",
    email: "tanaka@example.com",
    remote_avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4",
    onboarding_completed: true,
    first_login_at: 30.days.ago
  },
  {
    name: "yamada_coder",
    email: "yamada@example.com",
    remote_avatar_url: "https://avatars.githubusercontent.com/u/23456?v=4",
    onboarding_completed: true,
    first_login_at: 25.days.ago
  },
  {
    name: "suzuki_engineer",
    email: "suzuki@example.com",
    remote_avatar_url: "https://avatars.githubusercontent.com/u/34567?v=4",
    onboarding_completed: true,
    first_login_at: 20.days.ago
  },
  {
    name: "sato_fullstack",
    email: "sato@example.com",
    remote_avatar_url: "https://avatars.githubusercontent.com/u/45678?v=4",
    onboarding_completed: true,
    first_login_at: 15.days.ago
  },
  {
    name: "ito_react",
    email: "ito@example.com",
    remote_avatar_url: "https://avatars.githubusercontent.com/u/56789?v=4",
    onboarding_completed: true,
    first_login_at: 10.days.ago
  }
]

users = []
users_data.each do |user_data|
  user = User.find_or_create_by(email: user_data[:email]) do |u|
    u.name = user_data[:name]
    u.remote_avatar_url = user_data[:remote_avatar_url]
    u.onboarding_completed = user_data[:onboarding_completed]
    u.first_login_at = user_data[:first_login_at]
  end
  users << user
  puts "ユーザー作成: #{user.name}"
end

# 投稿データ（多様なパターン）
posts_data = [
  {
    title: "TaskManager Pro",
    description: "Reactで作ったモダンなタスク管理アプリです。ドラッグ&ドロップ機能やリアルタイム同期を実装しました。",
    body: "## 技術スタック\n- React 18\n- TypeScript\n- Tailwind CSS\n- Firebase\n\n## 主な機能\n- ドラッグ&ドロップによるタスク移動\n- リアルタイム同期\n- レスポンシブデザイン\n\n[GitHub](https://github.com/tanaka_dev/task-manager-pro) | [デモ](https://taskmanager-pro.vercel.app)",
    user_index: 0,
    created_days_ago: 1
  },
  {
    title: "Weather Dashboard",
    description: "Vue.jsで作った天気予報ダッシュボード。複数都市の天気を一覧表示し、美しいアニメーションを実装。",
    body: "## 技術スタック\n- Vue.js 3\n- Composition API\n- CSS3 Animations\n- OpenWeather API\n\n## 主な機能\n- 複数都市の天気表示\n- 美しいアニメーション\n- 7日間の天気予報\n\n[GitHub](https://github.com/yamada_coder/weather-dashboard) | [デモ](https://weather-dash-vue.netlify.app)",
    user_index: 1,
    created_days_ago: 2
  },
  {
    title: "Portfolio Site",
    description: "Next.jsで作った自分のポートフォリオサイト。SSGとダークモードに対応しています。",
    body: "## 技術スタック\n- Next.js 14\n- TypeScript\n- Tailwind CSS\n- Framer Motion\n\n## 主な機能\n- SSG（Static Site Generation）\n- ダークモード切り替え\n- スムーズなアニメーション\n\n[GitHub](https://github.com/suzuki_engineer/portfolio) | [デモ](https://suzuki-portfolio.vercel.app)",
    user_index: 2,
    created_days_ago: 3
  },
  {
    title: "Chat App Realtime",
    description: "Socket.ioとReactで作ったリアルタイムチャットアプリ。グループチャットとプライベートメッセージに対応。",
    body: "## 技術スタック\n- React 18\n- Socket.io\n- Node.js\n- Express\n\n## 主な機能\n- リアルタイムメッセージング\n- グループチャット\n- プライベートメッセージ\n\n[GitHub](https://github.com/sato_fullstack/chat-app) | [デモ](https://realtime-chat-sato.herokuapp.com)",
    user_index: 3,
    created_days_ago: 4
  },
  {
    title: "Recipe Finder",
    description: "Angular+TypeScriptで作ったレシピ検索アプリ。食材から料理を検索できます。",
    body: "## 技術スタック\n- Angular 16\n- TypeScript\n- RxJS\n- Material UI\n\n## 主な機能\n- 食材からレシピ検索\n- お気に入り機能\n- 栄養情報表示\n\n[GitHub](https://github.com/ito_react/recipe-finder) | [デモ](https://recipe-finder-angular.vercel.app)",
    user_index: 4,
    created_days_ago: 5
  },
  {
    title: "Expense Tracker",
    description: "家計簿アプリをReact + TypeScriptで実装。グラフ表示とカテゴリー管理機能付き。",
    body: "## 技術スタック\n- React 18\n- TypeScript\n- Chart.js\n- Tailwind CSS\n\n## 主な機能\n- 支出・収入の記録管理\n- カテゴリー別グラフ表示\n- 月別・年別統計\n- データエクスポート機能\n\n[GitHub](https://github.com/tanaka_dev/expense-tracker) | [デモ](https://expense-tracker-tan.vercel.app)",
    user_index: 0,
    created_days_ago: 6
  },
  {
    title: "Music Player",
    description: "Web Audio APIを使った音楽プレイヤー。プレイリスト機能とビジュアライザー付き。",
    body: "## 技術スタック\n- Vanilla JavaScript\n- Web Audio API\n- HTML5 Canvas\n- CSS3 Animations\n\n## 主な機能\n- 音楽ファイル再生\n- リアルタイム音声ビジュアライザー\n- プレイリスト管理\n- イコライザー機能\n\n[GitHub](https://github.com/yamada_coder/music-player) | [デモ](https://web-music-player.netlify.app)",
    user_index: 1,
    created_days_ago: 7
  },
  {
    title: "Code Snippet Manager",
    description: "開発者向けのコードスニペット管理アプリ。シンタックスハイライト対応。",
    body: "## 技術スタック\n- Vue.js 3\n- Prism.js\n- IndexedDB\n- Tailwind CSS\n\n## 主な機能\n- コードスニペット保存・管理\n- 多言語シンタックスハイライト\n- タグ・カテゴリー分類\n- 検索・フィルター機能\n\n[GitHub](https://github.com/suzuki_engineer/snippet-manager) | [デモ](https://code-snippets-manager.vercel.app)",
    user_index: 2,
    created_days_ago: 8
  },
  {
    title: "Markdown Editor",
    description: "リアルタイムプレビュー付きMarkdownエディター。ダークモードとエクスポート機能付き。",
    body: "## 技術スタック\n- React 18\n- TypeScript\n- Marked.js\n- CodeMirror\n\n## 主な機能\n- リアルタイムMarkdownプレビュー\n- シンタックスハイライト\n- ダークモード切り替え\n- HTML/PDFエクスポート\n\n[GitHub](https://github.com/sato_fullstack/markdown-editor) | [デモ](https://md-editor-realtime.vercel.app)",
    user_index: 3,
    created_days_ago: 9
  },
  {
    title: "Habit Tracker",
    description: "習慣管理アプリ。進捗をビジュアル化し、目標達成をサポートします。",
    body: "## 技術スタック\n- Vue.js 3\n- Chart.js\n- Local Storage\n- Vuetify\n\n## 主な機能\n- 習慣の記録・追跡\n- 進捗の可視化グラフ\n- ストリーク計算\n- 目標設定・達成通知\n\n[GitHub](https://github.com/ito_react/habit-tracker) | [デモ](https://habit-tracker-vue.netlify.app)",
    user_index: 4,
    created_days_ago: 10
  },
  {
    title: "QR Code Generator",
    description: "QRコード生成アプリ。カスタマイズオプションとバッチ生成機能付き。",
    body: "## 技術スタック\n- React 18\n- QRCode.js\n- Canvas API\n- Material-UI\n\n## 主な機能\n- QRコード生成・カスタマイズ\n- 色・サイズ・フォーマット変更\n- バッチ生成機能\n- ダウンロード・共有機能\n\n[GitHub](https://github.com/tanaka_dev/qr-generator) | [デモ](https://qr-gen-custom.vercel.app)",
    user_index: 0,
    created_days_ago: 11
  },
  {
    title: "Password Manager",
    description: "セキュアなパスワード管理アプリ。暗号化と生成機能を実装。",
    body: "## 技術スタック\n- React 18\n- Crypto.js\n- IndexedDB\n- PWA (Service Worker)\n\n## 主な機能\n- パスワード暗号化保存\n- 強力なパスワード生成\n- カテゴリー別管理\n- オフライン対応\n\n[GitHub](https://github.com/yamada_coder/password-manager) | [デモ](https://secure-pass-manager.netlify.app)",
    user_index: 1,
    created_days_ago: 12
  },
  {
    title: "Timer & Pomodoro",
    description: "ポモドーロテクニック対応のタイマーアプリ。統計機能とアラーム付き。",
    body: "## 技術スタック\n- Vue.js 3\n- Composition API\n- Chart.js\n- Web Audio API\n\n## 主な機能\n- ポモドーロテクニック対応\n- 作業時間統計表示\n- カスタマイズ可能アラーム\n- 集中度トラッキング\n\n[GitHub](https://github.com/suzuki_engineer/pomodoro-timer) | [デモ](https://pomodoro-focus.vercel.app)",
    user_index: 2,
    created_days_ago: 13
  },
  {
    title: "Currency Converter",
    description: "リアルタイム為替レート対応の通貨変換アプリ。履歴機能付き。",
    body: "## 技術スタック\n- Angular 16\n- RxJS\n- Exchange Rate API\n- Chart.js\n\n## 主な機能\n- リアルタイム為替レート取得\n- 多通貨変換\n- レート変動履歴グラフ\n- お気に入り通貨ペア\n\n[GitHub](https://github.com/sato_fullstack/currency-converter) | [デモ](https://currency-convert-live.vercel.app)",
    user_index: 3,
    created_days_ago: 14
  },
  {
    title: "Color Palette Generator",
    description: "デザイナー向けカラーパレット生成ツール。ハーモニー理論ベースの配色提案。",
    body: "## 技術スタック\n- React 18\n- Color Theory Library\n- Canvas API\n- SCSS\n\n## 主な機能\n- カラーハーモニー生成\n- パレットプレビュー\n- HEX/RGB/HSL変換\n- パレットエクスポート\n\n[GitHub](https://github.com/ito_react/color-palette) | [デモ](https://color-harmony-gen.netlify.app)",
    user_index: 4,
    created_days_ago: 15
  },
  {
    title: "URL Shortener",
    description: "URL短縮サービス。アクセス統計とカスタムドメイン対応。",
    body: "## 技術スタック\n- Node.js\n- Express.js\n- MongoDB\n- React\n\n## 主な機能\n- URL短縮・管理\n- アクセス統計ダッシュボード\n- カスタムURL設定\n- QRコード生成\n\n[GitHub](https://github.com/tanaka_dev/url-shortener) | [デモ](https://short-url-service.vercel.app)",
    user_index: 0,
    created_days_ago: 16
  },
  {
    title: "Image Gallery",
    description: "レスポンシブ対応の画像ギャラリー。フィルター機能とライトボックス付き。",
    body: "## 技術スタック\n- React 18\n- Framer Motion\n- CSS Grid\n- Intersection Observer\n\n## 主な機能\n- レスポンシブグリッドレイアウト\n- カテゴリーフィルター\n- ライトボックスビュー\n- 遅延読み込み機能\n\n[GitHub](https://github.com/yamada_coder/image-gallery) | [デモ](https://responsive-gallery.netlify.app)",
    user_index: 1,
    created_days_ago: 17
  },
  {
    title: "Note Taking App",
    description: "マークダウン対応のメモアプリ。タグ機能と検索機能を実装。",
    body: "## 技術スタック\n- Vue.js 3\n- Markdown-it\n- Vuex\n- Electron\n\n## 主な機能\n- Markdown対応メモ作成\n- タグ・カテゴリー管理\n- 全文検索機能\n- オフライン同期\n\n[GitHub](https://github.com/suzuki_engineer/note-app) | [デモ](https://markdown-notes.vercel.app)",
    user_index: 2,
    created_days_ago: 18
  },
  {
    title: "Movie Database",
    description: "映画検索アプリ。TMDB APIを使用し、お気に入り機能付き。",
    body: "## 技術スタック\n- React 18\n- TMDB API\n- React Router\n- Styled Components\n\n## 主な機能\n- 映画・テレビ番組検索\n- 詳細情報・キャスト表示\n- お気に入りリスト\n- レーティング・レビュー機能\n\n[GitHub](https://github.com/sato_fullstack/movie-db) | [デモ](https://movie-search-app.vercel.app)",
    user_index: 3,
    created_days_ago: 19
  },
  {
    title: "Workout Tracker",
    description: "フィットネストラッキングアプリ。エクササイズ記録と進捗グラフ機能。",
    body: "## 技術スタック\n- Angular 16\n- Chart.js\n- PWA\n- Local Storage\n\n## 主な機能\n- ワークアウト記録・管理\n- 進捗グラフ表示\n- エクササイズライブラリ\n- タイマー・セット管理\n\n[GitHub](https://github.com/ito_react/workout-tracker) | [デモ](https://fitness-tracker-app.netlify.app)",
    user_index: 4,
    created_days_ago: 20
  },
  {
    title: "Budget Calculator",
    description: "予算計算アプリ。収支管理とグラフによる可視化機能。",
    body: "## 技術スタック\n- React 18\n- Chart.js\n- TypeScript\n- Material-UI\n\n## 主な機能\n- 収入・支出管理\n- 予算設定・進捗確認\n- カテゴリー別グラフ\n- 月別レポート生成\n\n[GitHub](https://github.com/tanaka_dev/budget-calc) | [デモ](https://budget-calculator.vercel.app)",
    user_index: 0,
    created_days_ago: 21
  },
  {
    title: "Quiz App",
    description: "クイズアプリ。複数ジャンル対応とスコア管理機能付き。",
    body: "## 技術スタック\n- Vue.js 3\n- Open Trivia API\n- Vuex\n- CSS3 Animations\n\n## 主な機能\n- 多ジャンルクイズ\n- スコア・ランキング管理\n- 難易度調整\n- タイマーモード\n\n[GitHub](https://github.com/yamada_coder/quiz-app) | [デモ](https://interactive-quiz.netlify.app)",
    user_index: 1,
    created_days_ago: 22
  },
  {
    title: "Drawing Board",
    description: "HTML5 Canvasを使った描画アプリ。ブラシツールと保存機能付き。",
    body: "## 技術スタック\n- Vanilla JavaScript\n- HTML5 Canvas\n- Web Workers\n- CSS3\n\n## 主な機能\n- 描画ツール（ブラシ、消しゴム）\n- レイヤー管理\n- 作品保存・読み込み\n- アンドゥ・リドゥ機能\n\n[GitHub](https://github.com/suzuki_engineer/drawing-board) | [デモ](https://canvas-draw-app.vercel.app)",
    user_index: 2,
    created_days_ago: 23
  },
  {
    title: "Calendar App",
    description: "イベント管理カレンダー。ドラッグ&ドロップとリマインダー機能付き。",
    body: "## 技術スタック\n- React 18\n- FullCalendar\n- Date-fns\n- React DnD\n\n## 主な機能\n- イベント作成・編集\n- ドラッグ&ドロップ操作\n- リマインダー通知\n- カレンダーエクスポート\n\n[GitHub](https://github.com/sato_fullstack/calendar-app) | [デモ](https://event-calendar-app.vercel.app)",
    user_index: 3,
    created_days_ago: 24
  },
  {
    title: "Random Quote Generator",
    description: "名言生成アプリ。カテゴリー別表示とSNSシェア機能付き。",
    body: "## 技術スタック\n- React 18\n- Quote API\n- Framer Motion\n- Social Share API\n\n## 主な機能\n- ランダム名言表示\n- カテゴリー別フィルター\n- SNSシェア機能\n- お気に入り保存\n\n[GitHub](https://github.com/ito_react/quote-generator) | [デモ](https://daily-quotes-app.netlify.app)",
    user_index: 4,
    created_days_ago: 25
  },
  {
    title: "Unit Converter",
    description: "単位変換アプリ。長さ・重量・温度など多種類の変換に対応。",
    body: "## 技術スタック\n- React 18\n- TypeScript\n- Math.js\n- Styled Components\n\n## 主な機能\n- 長さ・重量・温度変換\n- 精度の高い計算\n- 履歴機能\n- キーボードショートカット\n\n[GitHub](https://github.com/tanaka_dev/unit-converter) | [デモ](https://universal-converter.vercel.app)",
    user_index: 0,
    created_days_ago: 26
  },
  {
    title: "Language Flashcards",
    description: "語学学習用フラッシュカードアプリ。進捗追跡とスペースドリピティション機能。",
    body: "## 技術スタック\n- Vue.js 3\n- Vuex\n- Spaced Repetition Algorithm\n- Web Speech API\n\n## 主な機能\n- フラッシュカード学習\n- スペースドリピティション\n- 音声読み上げ機能\n- 進捗トラッキング\n\n[GitHub](https://github.com/yamada_coder/flashcards) | [デモ](https://language-cards.netlify.app)",
    user_index: 1,
    created_days_ago: 27
  },
  {
    title: "Stock Price Tracker",
    description: "株価追跡アプリ。リアルタイム更新とウォッチリスト機能。",
    body: "## 技術スタック\n- Angular 16\n- Yahoo Finance API\n- RxJS\n- Chart.js\n\n## 主な機能\n- リアルタイム株価表示\n- ウォッチリスト管理\n- 価格アラート機能\n- 履歴チャート表示\n\n[GitHub](https://github.com/suzuki_engineer/stock-tracker) | [デモ](https://stock-price-monitor.vercel.app)",
    user_index: 2,
    created_days_ago: 28
  },
  {
    title: "Recipe Book",
    description: "レシピ管理アプリ。材料計算と買い物リスト生成機能付き。",
    body: "## 技術スタック\n- React 18\n- Node.js\n- MongoDB\n- Cloudinary\n\n## 主な機能\n- レシピ作成・管理\n- 材料計算機能\n- 買い物リスト自動生成\n- 料理写真アップロード\n\n[GitHub](https://github.com/sato_fullstack/recipe-book) | [デモ](https://digital-recipe-book.vercel.app)",
    user_index: 3,
    created_days_ago: 29
  },
  {
    title: "Meditation Timer",
    description: "瞑想タイマーアプリ。自然音とガイド機能付き。",
    body: "## 技術スタック\n- React 18\n- Web Audio API\n- Framer Motion\n- Local Storage\n\n## 主な機能\n- タイマー機能（カスタマイズ可）\n- 自然音・環境音再生\n- ガイド付き瞑想\n- 瞑想記録・統計\n\n[GitHub](https://github.com/ito_react/meditation-timer) | [デモ](https://mindful-timer.netlify.app)",
    user_index: 4,
    created_days_ago: 30
  }
]

posts = []
posts_data.each do |post_data|
  post = Post.create!(
    title: post_data[:title],
    description: post_data[:description],
    body: post_data[:body],
    user: users[post_data[:user_index]],
    created_at: post_data[:created_days_ago].days.ago,
    updated_at: post_data[:created_days_ago].days.ago
  )
  posts << post
  puts "投稿作成: #{post.title} (by #{post.user.name})"
end

# 各ユーザーの認証データを作成
users.each_with_index do |user, index|
  Authentication.find_or_create_by(
    user: user,
    provider: 'github',
    uid: (12345 + index * 1111).to_s
  )
  puts "認証データ作成: #{user.name}"
end

puts "\n✅ シードデータの作成が完了しました!"
puts "👥 ユーザー: #{User.count}人"
puts "📝 投稿: #{Post.count}件"
puts "🔐 認証: #{Authentication.count}件"
