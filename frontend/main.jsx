import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import { AuthProvider } from './src/context/AuthContext';
import './app.css';
import './src/styles/responsive.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>⚠️ Something went wrong</h1>
            <p>We're sorry, but something unexpected happened.</p>
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Error Details</summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Reload Page
            </button>
          </div>
          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 20px;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            }
            
            .error-content {
              max-width: 600px;
              background: rgba(255, 255, 255, 0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            
            .error-content h1 {
              font-size: 48px;
              margin-bottom: 20px;
            }
            
            .error-content p {
              font-size: 18px;
              margin-bottom: 30px;
            }
            
            .retry-button {
              background: white;
              color: #667eea;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              margin-top: 20px;
            }
            
            .retry-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Wrapper with Providers
const AppWithProviders = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWithProviders />);

// Service Worker Registration (optional, gated by env)
const enableSw = (typeof import.meta !== 'undefined' && import.meta.env && String(import.meta.env.VITE_ENABLE_SW).toLowerCase() === 'true');
if (enableSw && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance monitoring (optional)
if (process.env.NODE_ENV === 'development') {
  // Log performance metrics in development
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }, 0);
  });
}
