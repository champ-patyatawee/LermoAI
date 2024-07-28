import React from 'react';
import { Menu, Layout } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  IconHome, IconVideo, IconPlaylist, IconArticle, IconClassroom, IconSetting, IconEdit, IconCopy, IconPodcast
} from '../../atoms/icons';

import Style from './style';

const { Sider } = Layout;

const SiderHome = ({ isCollapsed }) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <Style>
      <Sider
        width={80}
        collapsedWidth={100}
        collapsed={false}
        trigger={null}
        collapsible
      >
        <div className="logo">
        </div>
        <Menu
          className="menu-custom menu-row"
          mode="inline"
          selectedKeys={[pathname]}
        >
          <Menu.Item key="/" icon={<IconArticle />}>
            <Link legacyBehavior href="/">
              <a></a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/podcast" icon={<IconPodcast />}>
            <Link legacyBehavior href="/podcast">
              <a></a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/video" icon={<IconVideo />}>
            <Link legacyBehavior href="/video">
              <a></a>
            </Link>
          </Menu.Item>
        </Menu>

      </Sider>

    </Style>
  );
};

export default SiderHome;
