This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

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
