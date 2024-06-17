import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { MenuOutlined, BellOutlined } from '@ant-design/icons';

import { Input, Col, Row, Badge } from 'antd';
import Logo from '../../atoms/logo';
import SettingUser from '../../molecules/settingUser';
import { IconSearch } from '../../atoms/icons';
import NotiBadge from '../../molecules/notiBadge';
import Style from './style';
import MainButton from '../../atoms/mainButton';

const HeaderMain = ({ onClickCollapsed = () => {} }) => {
  let SettingComponent;
  let NotiBadgeCompoent;
  const profile = true
  if (profile) {
    SettingComponent = (
      <div className="main-menu-item">
        <SettingUser/>
      </div>
    );
    NotiBadgeCompoent = (
      <div className="main-menu-item">
        <NotiBadge/>
      </div>
    );
  } else {
    SettingComponent = (
      <Link href="/signin">
        <MainButton fit>Sign In</MainButton>
      </Link>
    );
  }

  return (
    <Style>
      <div className="main-menu">
        <div className="main-menu-item collapse-btn" onClick={onClickCollapsed}>
          <MainButton>
            <MenuOutlined />
          </MainButton>
        </div>
        <div className="main-menu-item">
          <Logo />
        </div>
        
      </div>
      <div className="main-menu">
      </div>
      <div className="main-menu">
        {NotiBadgeCompoent}
        {SettingComponent}
      </div>
    </Style>
  );
};

export default HeaderMain;
