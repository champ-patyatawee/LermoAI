import React from 'react';

import { Layout } from 'antd';
import Logo from '../../atoms/logo';
import Style from './style';

import './style.css'

const GuestTemplate = ({ children }) => {
  return (
    <Layout>
      <Layout.Content>
        <div className='container'>
          <div className="left-container">
            <div className="navbar">
              <Logo />
            </div>

            <div className="content-container">{children}</div>
          </div>
          <div className="right-container" />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default GuestTemplate;
