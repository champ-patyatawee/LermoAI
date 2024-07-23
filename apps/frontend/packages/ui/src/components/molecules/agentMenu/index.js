import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, Menu, Dropdown, message } from 'antd';
import { PlayCircleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import Style from './style';
import actions from '@redux/agent/actions';

const AgentMenu = ({ }) => {
  const dispatch = useDispatch();
  const agents = useSelector((state) => state.agent.get('agents')) || []

  useEffect(() => {
    dispatch(actions.getAgent());
  }, [])

  const onClickAgent = ({ name }) => {
    message.success(name);
  }

  const menuItems = agents.map((agent, index) => (
    <Menu.Item key={index} >
      {/* <div onClick={onClickAgent(agent.name)}>  */}
      <UserOutlined /> {agent.name} <br />
      {agent.role}
      {/* </div> */}
    </Menu.Item>
  ));

  const menu = (
    <Menu style={{ width: '220px' }}>{menuItems}</Menu>
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
