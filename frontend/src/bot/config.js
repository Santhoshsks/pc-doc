import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
// import SingleFlight from './components/SingleFlight'; 
// import MyCustomChatMessage from './components/MyCustomChatMessage';
// import MyCustomUserChatMessage from './components/MyCustomUserChatMessage';
import MyAvatar from './components/MyAvatar';

const botName = 'PC-DOC';

const config = {
  initialMessages: [createChatBotMessage(`Hi! I'm ${botName}. How can I assist you today?`)],
  botName: botName,

  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },

  state: {
    myCustomProperty: 'Custom State Value',
  },

  customComponents: {
    header: () => <div style={{ backgroundColor: 'grey', padding: '5px', borderRadius: '3px' }}>Welcome to {botName}</div>,
    botAvatar: (props) => <MyAvatar {...props} />,
    // botChatMessage: (props) => <MyCustomChatMessage {...props} />,
    // userAvatar: (props) => <MyAvatar {...props} />, 
    // userChatMessage: (props) => <MyCustomUserChatMessage {...props} />,
  },

  widgets: [
    {
      widgetName: 'singleFlight',
      // widgetFunc: (props) => <SingleFlight {...props} />,
      props: {
        // Optional widget-specific properties
      },
      mapStateToProps: ['myCustomProperty'],
    },
  ],
};

export default config;
