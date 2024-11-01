# pc-doc
PC-Doc: An AI-powered Chatbot for diagnosing digital threats

## Package Structure
chatbot_project/
├── backend/                     # Python backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Main app entry point
│   │   ├── api/                 # API routes
│   │   │   ├── __init__.py
│   │   │   └── chat.py          # Chat endpoint(s)
│   │   ├── core/                # Core logic
│   │   │   ├── __init__.py
│   │   │   └── chatbot.py       # Chatbot logic
│   │   ├── services/            # Services like NLP, ML models, embeddings
│   │   │   ├── __init__.py
│   │   │   └── nlp.py           # NLP logic (e.g., embeddings, processing)
│   │   ├── config.py            # Configuration settings
│   │   ├── utils.py             # Utility functions
│   └── requirements.txt         # Backend dependencies
│
├── frontend/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ChatWindow.js    # Main chat interface
│   │   │   └── Message.js       # Message component
│   │   ├── pages/               # Main pages
│   │   │   └── ChatPage.js      # Page to host ChatWindow
│   │   ├── services/            # API calls to backend
│   │   │   └── api.js           # Service for chat API interactions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json             # Frontend dependencies
│
└── README.md                    # Project overview

# Start
docker-compose up --build
