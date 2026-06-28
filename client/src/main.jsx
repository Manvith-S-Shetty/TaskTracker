import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css'; // Load global CSS styles & variables across the app

// ReactDOM.createRoot finds the <div id="root"> inside index.html.
// It initializes React's rendering engine on that DOM node and renders our component tree.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode runs compile checks in development (e.g. warning about deprecated methods, double rendering checks)
  <React.StrictMode>
    {/* ThemeProvider distributes light/dark state to the entire app */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
