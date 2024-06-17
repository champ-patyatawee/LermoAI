import React from 'react';
import Link from 'next/link';
import { Avatar, Menu, Dropdown } from 'antd';
import { PlayCircleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { useDispatch } from 'react-redux';
import Style from './style';

const SettingUser = ({ logout }) => {
  const dispatch = useDispatch();

  const menu = (
    <Menu style={{ width: '200px' }}>
      <Menu.Item>
        <Link href="/profile/edit">
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Item onClick={() => dispatch(logout())}>
        <LogoutOutlined /> Log out
      </Menu.Item>
    </Menu>
  );

  let UserAvatar = <Avatar size={40} src="/default-avatar.jpg" />;

  return (
    <Style>
      <div className="setting-item">
        <Dropdown overlay={menu}>{UserAvatar}</Dropdown>
      </div>
    </Style>
  );
};

export default SettingUser;
