import {
  Button,
} from 'antd';

import './style.css';

const Component = ({ onClick }) => {

  return (
    <Button onClick={onClick} className='button-enter' type="primary" size="large">
      Enter
    </Button>
  )
}

export default Component