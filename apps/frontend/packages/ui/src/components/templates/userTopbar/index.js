import { Layout, Flex } from 'antd';
import { useState, useEffect } from 'react';
import { useWindowSize } from "@uidotdev/usehooks";
import HeaderMain from '../../organisms/headerMain';

const { Header, Content, Sider, Footer } = Layout;

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#fff',
};

const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#fff',
};

const contentStyle = {
  backgroundColor: '#fff',
};

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
};

const UserTopbarTemplate = ({ children }) => {
  const size = useWindowSize();
  const { width } = size

  const [isCollapsed, setIsCollapsed] = useState(false);

  const onClickCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (window.innerWidth < 992) {
      setIsCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (width === 0) return;

    if (width >= 992) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
  }, [width]);

  return (
    <>
      <Layout style={layoutStyle}>
      <HeaderMain onClickCollapsed={onClickCollapsed} />
      <Header style={headerStyle}></Header>
      <Layout>
        <Sider width="25%" style={siderStyle}>
          Sider
        </Sider>
        <Content style={contentStyle}>{children}</Content>
        <Sider width="25%" style={siderStyle}>
          Sider
        </Sider>
      </Layout>
    </Layout>
    </>
  );
};

export default UserTopbarTemplate