// MyAvatar.jsx
import React from 'react';

export const MyBotAvatar = ({ alt = 'Bot Avatar' }) => {
  return (
    <img
        src={`${process.env.PUBLIC_URL}/bot.png`}
        alt={alt}
        style={{
            width: '40px',
            height: '40px',
            marginRight: '10px',
        }}
    />
  );
};


export const MyUserAvatar = () => {
  return (
    <div/>
  );
};
