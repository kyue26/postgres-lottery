import './App.css';
import React, { useState } from 'react';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <h1>lottery!</h1>
      <Login/>
      <button>buy tickets!</button>
      <button>pick a winner!</button>
    </div>
  );
}

export default App;
