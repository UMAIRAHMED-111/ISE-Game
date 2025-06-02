import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

console.log('🚀 Application starting...');

try {
  console.log('📦 Creating root element...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  console.log('🎨 Rendering application...');
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('✅ Application rendered successfully');
} catch (error) {
  console.error('❌ Error during application initialization:', error);
  console.error('Error details:', {
    message: error.message,
    stack: error.stack
  });
}