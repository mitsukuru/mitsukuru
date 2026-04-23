import React from 'react'
import Router from "./router"
import { ThemeProvider } from "./contexts/ThemeContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { ToastProvider } from "./contexts/ToastContext"

// エラーバウンダリーコンポーネント
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>何かエラーが発生しました</h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            アプリケーションの読み込み中にエラーが発生しました。
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ページを再読み込み
          </button>
          {this.state.error && (
            <details style={{ marginTop: '1rem', maxWidth: '600px' }}>
              <summary style={{ cursor: 'pointer', color: '#6b7280' }}>
                エラー詳細を表示
              </summary>
              <pre style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.8rem',
                textAlign: 'left'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <Router />
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App