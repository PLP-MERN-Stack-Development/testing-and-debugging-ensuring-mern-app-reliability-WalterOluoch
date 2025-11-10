import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import BugTracker from './components/BugTracker';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>Bug Tracker</h1>
          <p>Track and manage bugs efficiently</p>
        </header>
        <main className="container">
          <BugTracker />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
