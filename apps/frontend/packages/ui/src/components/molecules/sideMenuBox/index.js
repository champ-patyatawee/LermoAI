import { Tooltip } from 'antd';
import Style from './style';

const SideMenuBox = ({ title = '...', items = [] }) => {
  return (
    <Style>
      {title}
      <div className="content">
        {items.map((val, index) => {
          return (
            <div className="content-item" key={`${val}_${index}`}>
              <Tooltip title={val}>
                <span>{val}</span>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </Style>
  );
};

export default SideMenuBox;
