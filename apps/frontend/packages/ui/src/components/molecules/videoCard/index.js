import { Avatar, Dropdown, Menu } from 'antd';
import Style from './style';
import VideoPlayer from '../../atoms/videoPlayer'


const VideoCard = ({ src }) => {
  const onPostClick = () => {};

  const onSelectMenu = ({ key }) => {
    switch (key) {
      case '1':
        break;
      case '2':
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={onSelectMenu}>
      <Menu.Item key="1">
        Edit
      </Menu.Item>
      <Menu.Item key="2">
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Style>
      <div className="header">
        <div className="avatar">
          <Avatar
            alt="user_avatar"
            src="/default-avatar.jpg"
          />
        </div>
        <div className="username"> <a href={`/space`}> Nomad Journal  </a></div>
        <div className="post-date">22-01-2022</div>
        <div className="edit">
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              ...
            </a>
          </Dropdown>
        </div>
      </div>

      <div className="vid-container" onClick={onPostClick}>
        <VideoPlayer src={src}></VideoPlayer>
      </div>
    </Style>
  );
};

export default VideoCard;
