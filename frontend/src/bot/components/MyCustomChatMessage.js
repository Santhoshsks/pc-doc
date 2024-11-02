import React from 'react';

export const MyBotChatMessage = ({ message }) => {
  return (
    <div
      style={{
        maxWidth: '80%',
        backgroundColor: '#28272a',
        color: '#ffffff',
        padding: '10px 15px',
        borderRadius: '12px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        fontSize: '0.95rem',
        lineHeight: '1.4',
        position: 'relative',
      }}
    >
      {message}
    </div>
  );
};

export const MyUserChatMessage = ({ message }) => {
  return (
    <div
      style={{
        maxWidth: '90%',
        backgroundColor: '#a2a1a6',
        color: '#ffffff',
        padding: '10px 15px',
        borderRadius: '12px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        fontSize: '0.95rem',
        lineHeight: '1.4',
        position: 'relative',
      }}
    >
      {message}
    </div>
  );
};


export default MyUserChatMessage;