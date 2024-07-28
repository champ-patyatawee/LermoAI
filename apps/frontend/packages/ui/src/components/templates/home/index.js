import { Layout, Col, Row, } from 'antd';
import { useState, useEffect } from 'react';
import HeaderMain from '../../organisms/headerMain';
import SiderHome from '../../organisms/siderHome';
import SideMenuBox from '../../molecules/sideMenuBox';
import { useWindowSize } from "@uidotdev/usehooks";
 
import './style.css';

const { Content } = Layout;

const HomeTemplate = ({ children }) => {
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
    <Layout className="layout-template">
      <HeaderMain onClickCollapsed={onClickCollapsed} />
      <SiderHome isCollapsed={isCollapsed} />
      <Layout>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Content className="content-template">{children}</Content>
          </Col>
        </Row>
      </Layout>
    </Layout>
  );
};

export default HomeTemplate