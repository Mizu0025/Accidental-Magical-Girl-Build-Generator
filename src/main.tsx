import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importing our App component

// Grab the 'root' div from index.html
const rootElement = document.getElementById('root')!;

// Tell React to take over that element and render our UI shell
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App /> {/* Look Ma, capital letters! */}
  </React.StrictMode>
);
