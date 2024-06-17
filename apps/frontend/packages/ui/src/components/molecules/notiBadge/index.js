import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Dropdown, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';


import { useDispatch } from 'react-redux';
import MainButton from '../../atoms/mainButton';

import Style from './style';

const NotiBadge = ({}) => {
  const onVisibleChange = (isVisible) => {
  };

  const menu =
    (
      <Menu style={{ width: '300px' }}>
        <Menu.Item>
          <Link href=""> Notification </Link>
        </Menu.Item>
      </Menu>
    )

  return (
    <Style>
      <div className="setting-item">
        <Dropdown overlay={menu} onVisibleChange={onVisibleChange}>
          <Badge>
            <MainButton>
              <BellOutlined />
            </MainButton>
          </Badge>
        </Dropdown>
      </div>
    </Style>
  );
};

export default NotiBadge;
