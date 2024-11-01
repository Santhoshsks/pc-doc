// MyAvatar.jsx
import React from 'react';

const MyAvatar = ({ alt = 'Bot Avatar' }) => {
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

export default MyAvatar;
