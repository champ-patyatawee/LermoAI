import React from 'react';
import { Menu, Layout } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  IconHome, IconPlaylist, IconArticle, IconClassroom, IconSetting, IconEdit, IconCopy, IconPodcast
} from '../../atoms/icons';

import Style from './style';

const { Sider } = Layout;

const SiderRecommend = ({ }) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <Style>
      <Sider
        width={200}
        collapsedWidth={100}
        trigger={null}
      >
        <div className="logo">
        </div>
        <Menu
          className="menu-custom menu-row"
          mode="inline"
          selectedKeys={[pathname]}
        >
          <Menu.Item key="/article" icon={<IconArticle />}>
            <Link legacyBehavior href="/coming">
              <a>Article</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/podcast" icon={<IconPodcast />}>
            <a>Podcast</a>
          </Menu.Item>
          <Menu.Item key="/content" icon={<IconPlaylist />}>
            <Link legacyBehavior href="/content">
              <a>Video</a>
            </Link>
          </Menu.Item>
        </Menu>

      </Sider>

    </Style>
  );
};

export default SiderHome;
