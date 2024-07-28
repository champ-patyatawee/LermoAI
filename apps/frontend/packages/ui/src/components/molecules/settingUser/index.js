import React from 'react';
import Link from 'next/link';
import { Avatar, Menu, Dropdown } from 'antd';
import { PlayCircleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { useDispatch } from 'react-redux';
import Style from './style';

const SettingUser = ({ logout }) => {
  const dispatch = useDispatch();

  const menu = (
    <Menu style={{ width: '220px' }}>
      <Menu.Item>
        <Link href="/profile/edit">
          <UserOutlined /> Professor Pine <br></br> Role: Main teacher
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link href="/profile/edit">
          <UserOutlined /> Techie Terry <br></br> Role: Technology and computer science expert
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link href="/profile/edit">
        <UserOutlined /> Scientist Sam
        Role: Science teacher (biology, chemistry, physics)
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link href="/profile/edit">
        <UserOutlined /> Scientist Sam
        Role: Science teacher (biology, chemistry, physics)
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link href="/profile/edit">
        <UserOutlined /> Scientist Sam
        Role: Science teacher (biology, chemistry, physics)
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link href="/profile/edit">
        <UserOutlined /> Scientist Sam
        Role: Science teacher (biology, chemistry, physics)
        </Link>
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
