/**
 * Entry Point for the Application
 *
 * This file is the main entry point for the React application. It is responsible for rendering
 * the root component (`App`) to the DOM and enabling React's strict mode for development.
 * Additionally, it sets up the performance measurement utility `reportWebVitals` to track app
 * performance metrics.
 *
 * @file
 * @example
 * // Entry point for the app, where the `App` component is rendered into the `root` div
 * ReactDOM.render(<App />, document.getElementById('root'));
 * 
 * @see {@link https://bit.ly/CRA-vitals} for more information about `reportWebVitals`
 */

import React from 'react'; // Import React to enable JSX syntax
import ReactDOM from 'react-dom/client'; // Import the new ReactDOM for rendering in React 18+
import './index.css'; // Import the global CSS styles
import App from './App'; // Import the main App component to render
import reportWebVitals from './reportWebVitals'; // Import performance monitoring utility

// Create the root element for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application inside the root element with StrictMode enabled for development
root.render(
  <React.StrictMode>
    <App /> {/* Main application component */}
  </React.StrictMode>
);

// Optional: Measure and log web vitals for app performance metrics
reportWebVitals();
