/**
 * @fileoverview Application entry point.
 * This module loads global styles, initializes the React root,
 * and mounts the top-level App component.
 */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Application bootstrap entry point.
 * Initializes a React 18 root and mounts the application in strict mode.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
