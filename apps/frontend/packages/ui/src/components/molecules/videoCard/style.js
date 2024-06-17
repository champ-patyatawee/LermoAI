import styled from 'styled-components';
import wrapProps from '../../atoms/wrapProps';

export default wrapProps(styled.div`
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .header {
    padding-left: 50px;
    position: relative;
    margin-bottom: 16px;

    .username {
      font-weight: bold;

      a {
        color: #000000;
      }

      span {
        font-weight: normal;
        color: #8C8C8C;
        padding-left: 8px;
      }
    }

    .post-date {
      font-size: 10px;
      color: #BFBFBF;
    }

    .avatar {
      position: absolute;
      top: 0;
      left: 0;

      width: 40px;
      height: 40px;

      img {
        border-radius: 50%;
      }
    }

    .edit {
      position: absolute;
      top: 0;
      right: 0;
      text-align: end;
      width: 100px;
    }
  }

  .ant-dropdown-link {
    font-size: 20px;
    color: #000000;
  }

  .vid-container {
    display: block;
    max-height:  673px;
    cursor: pointer;
  }
`);
