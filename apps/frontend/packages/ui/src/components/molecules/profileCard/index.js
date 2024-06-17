import {
  Row, Col, Card, Avatar, Button,
} from 'antd';
import {
  EditOutlined, EllipsisOutlined, SettingOutlined, PlusOutlined,
} from '@ant-design/icons';

import Styled from './style';

const ProfileCard = ({}) => {

  return (
    <Styled>
      <div className="profile-container">
        <Card
          className="material"
          cover={
            <Avatar src='/default-avatar.jpg' />
        }
        >
          <h3> Nomad Journal </h3>

          <span className="col-follow">
            1000 Follower
          </span>

          <span className="about-text">
            asdaksdkasdlkalsdkasldkwdmqkwmqdk;mwqdlmqwdlmwqldmwq;dmw;qd
          </span>

          <Button className="btn-follow" type="primary"> FOLLOW </Button>
        </Card>

      </div>
    </Styled>
  );
};

export default ProfileCard;
