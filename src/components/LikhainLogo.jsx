import React from 'react';
import logoImage from '../assets/logos/logo.png';

const LikhainLogo = ({ size = 200, className = "" }) => {
  return (
    <div className={`likhain-logo ${className}`}>
      <img
        src={logoImage}
        alt="Likhain Logo"
        style={{
          width: size,
          height: size,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default LikhainLogo;
