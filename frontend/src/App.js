import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './App.css';
import config from './bot/config.js';
import MessageParser from './bot/MessageParser.jsx';
import ActionProvider from './bot/ActionProvider.jsx';

function App() {
  const [selectedModel, setSelectedModel] = useState('Llama3-7B');

  return (
    <div className="App">
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
