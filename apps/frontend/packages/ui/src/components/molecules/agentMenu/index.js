import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, Menu, Dropdown, message } from 'antd';
import { PlayCircleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import Style from './style';
import actions from '@redux/agent/actions';

const AgentMenu = ({ }) => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState('Main Agent');

  const agents = useSelector((state) => state.agent.get('agents')) || []

  useEffect(() => {
    dispatch(actions.getAgent());
  }, [])

  const onClick = (e) => {
    console.log('click ', e.key);
    setCurrent(e.key);
    dispatch(actions.configAgent({ 'agentName': e.key }))
  }

  const items = agents.map((agent, index) => ({
    label: agent.name,
    key: agent.name,
    icon: <UserOutlined />,
  }));

  const menu = (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  );

  let AgentAvatar = <Avatar size={40} src="/default-avatar.jpg" />;

  return (
    <Style>
      <div className="setting-item">
        <Dropdown overlay={menu}>{AgentAvatar}</Dropdown>
      </div>
    </Style>
  );
};

export default AgentMenu;
