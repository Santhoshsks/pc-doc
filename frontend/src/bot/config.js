import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
// import SingleFlight from './components/SingleFlight'; 
import { MyUserChatMessage } from './components/MyCustomChatMessage';
// import MyCustomUserChatMessage from './components/MyCustomUserChatMessage';
import { MyUserAvatar } from './components/MyAvatar';
import { MyBotAvatar } from './components/MyAvatar';
import { MyBotChatMessage } from './components/MyCustomChatMessage';

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
    header: () => (
      <div
        style={{
          backgroundColor: 'grey',
          padding: '10px 15px',
          borderRadius: '8px',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        Welcome to {botName}
      </div>
    ),
    botAvatar: (props) => <MyBotAvatar {...props} />,
     botChatMessage: (props) => <MyBotChatMessage {...props} />,
     userAvatar: (props) => <MyUserAvatar {...props} />, 
    userChatMessage: (props) => <MyUserChatMessage {...props} />,
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
