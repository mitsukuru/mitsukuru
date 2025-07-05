# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mitsukuru** is a full-stack social platform for sharing individual development projects, built with Rails API + React frontend. The app allows developers to showcase their personal projects with GitHub OAuth authentication, image uploads, and social features.

## Development Commands

### Rails Backend (Root Directory)
```bash
# Install dependencies
bundle install

# Database setup
rails db:create
rails db:migrate
rails db:seed

# Start Rails server
rails server
# or
rails s

# Run tests
rails test

# Rails console
rails console
# or
rails c

# Generate migration
rails generate migration MigrationName

# Check routes
rails routes
```

### React Frontend (client/ directory)
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Backend (Rails 7.0.8 API)
- **Database**: SQLite3 (development), structured for User, Post, Authentication models
- **Authentication**: Dual system using Sorcery (GitHub OAuth) + Devise (traditional auth)
- **File Uploads**: CarrierWave for image handling with local storage
- **API Structure**: RESTful endpoints under `/api/v1/`
- **Services**: PortfolioAnalysisService for project analysis using OpenAI

### Frontend (React 18 + Vite)
- **Build Tool**: Vite with React plugin and path aliases (`@` → `src/`)
- **Routing**: React Router v6 with protected routes
- **Styling**: SCSS modules co-located with components
- **State Management**: React hooks (no Redux/Context)
- **API Layer**: Axios-based HTTP client with centralized API functions

### Key Models and Relationships
```ruby
# User model
has_many :posts
has_many :authentications
# Uses both Sorcery and Devise authentication

# Post model  
belongs_to :user
mount_uploader :image_url, PostImageUploader

# Authentication model (OAuth)
belongs_to :user
# Handles GitHub OAuth tokens
```

### API Endpoints
- `GET /api/v1/posts` - List all posts
- `GET /api/v1/posts/:id` - Show specific post
- `POST /api/v1/posts` - Create new post
- `GET /api/v1/users` - List all users
- `GET /api/v1/:provider` - OAuth initiation
- `POST /api/v1/callback` - OAuth callback handling

### Frontend Routes
- `/` - Landing page (Top)
- `/sign_in` - Authentication
- `/home` - Main feed
- `/users` - User listing
- `/users/:id/posts` - User-specific posts
- `/posts/new` - Create new post
- `/post/:id` - Individual post view

## Component Architecture

### Directory Structure
```
client/src/
├── components/
│   ├── features/          # Feature-specific components
│   ├── layouts/           # Layout components (Header)
│   └── pages/             # Page components with co-located SCSS
├── api/                   # API integration layer
└── assets/                # Static assets
```

### Styling Conventions
- Use SCSS modules (`.module.scss`) for component-specific styles
- Follow BEM-like naming in CSS classes
- Co-locate stylesheets with components
- Global styles in `App.css` for shared utilities

## Development Workflow

### Environment Setup
1. Ensure Ruby 3.1.6 and Rails 7.0.8+ are installed
2. Install Node.js for frontend development
3. GitHub OAuth credentials are in `.env` file (already configured for localhost)
4. Run `bundle install` in root and `npm install` in client/

### Running the Application
1. Start Rails server: `rails server` (runs on :3000)
2. Start React dev server: `cd client && npm run dev` (runs on :5173)
3. Frontend makes API calls to Rails backend on localhost:3000

### Authentication Flow
- GitHub OAuth handled by Sorcery gem
- User sessions managed server-side
- Frontend receives authentication state via API responses
- OAuth callback URL: `http://localhost:3000/api/v1/callback/github/`

### File Upload Handling
- Images uploaded via CarrierWave to `public/uploads/`
- Supported formats: jpg, jpeg, gif, png
- PostImageUploader handles validation and storage
- Frontend sends FormData for multipart uploads

## Important Notes

### Security Considerations
- GitHub OAuth credentials are in `.env` (development only)
- CORS configured to allow all origins (development setup)
- CSRF protection disabled for API endpoints
- Session-based authentication without token expiration

### Database Migrations
- Uses SQLite3 for development
- Migration files follow Rails conventions
- User model has both Sorcery and Devise fields (may need cleanup)

### Testing
- Rails tests in `test/` directory using default Rails testing framework
- No frontend tests currently configured
- Use `rails test` for backend testing

### Known Technical Debt
- Dual authentication system (Sorcery + Devise) may be redundant
- Hardcoded API URLs in frontend (should use environment variables)
- No global state management in React
- Mixed styling approaches (global CSS + modules)
- Limited error handling and loading states