import React from 'react';
import Style from './style';

const MainButton = (props) => {
  const {
    children = 'Button',
    fit = false,
    onClick = () => {},
  } = props;
  return (
    <Style className={fit ? 'fit-content' : ''} onClick={onClick}>
      {children}
    </Style>
  );
};

export default MainButton;
