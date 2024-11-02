import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './App.css';
import config from './bot/config.js';
import MessageParser from './bot/MessageParser.jsx';
import ActionProvider from './bot/ActionProvider.jsx';

function App() {
  const [selectedModel, setSelectedModel] = useState('Llama3-7B');

  const settingsText = "Settings".split('').map((char, index) => (
    <span key={index} className="settings-letter">{char}</span>
  ));

  return (
    <div className="App">
      <div className="sidebar">
        <h2>{settingsText}</h2>
        <hr className="divider" />
        <h3>Select Model:</h3>
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="Llama3-7B">Llama3-7B</option>
          <option value="Mistral-7B">Mistral-7B</option>
        </select>
      </div>
      <div className="chatbot-container">
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          setSelectedModel={setSelectedModel}
        />
      </div>
    </div>
  );
}

export default App;
