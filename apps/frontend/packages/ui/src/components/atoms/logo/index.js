import React from 'react';
import Style from './style';

const Logo = () => (
  <Style>
    <img className="logo" src="/logo.svg" alt="logo_dekstop" />
    <img className="logo-mobile" src="/logo-m.svg" alt="logo_mobile" />
  </Style>
);

export default Logo;
