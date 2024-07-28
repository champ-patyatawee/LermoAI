import React, { useEffect } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import Logo from '../../atoms/logo';
import SettingUser from '../../molecules/settingUser';
import AgentMenu from '../../molecules/agentMenu';
import Style from './style';
import MainButton from '../../atoms/mainButton';

const HeaderMain = ({ onClickCollapsed = () => {} }) => {
  return (
    <Style>
      <div className="main-menu">
        <div className="main-menu-item">
          <Logo />
        </div>
        
      </div>
      <div className="main-menu">
      </div>
      <div className="main-menu">
      <div className="main-menu-item">
        <AgentMenu/>
      </div>
      </div>
    </Style>
  );
};

export default HeaderMain;
