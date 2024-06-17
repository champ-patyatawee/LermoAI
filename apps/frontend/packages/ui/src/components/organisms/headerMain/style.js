import styled from 'styled-components';
import wrapProps from '../../atoms/wrapProps';

export default wrapProps(styled.div`
  position: fixed;
  top: 0;
  z-index: 100;

  width: 100%;
  height: 80px;
  padding: 0px 24px;
  background: linear-gradient(180deg, #FFFFFF, rgba(255, 255, 255, 0) 100%);

  display: flex;
  align-items: center;
  justify-content: space-between;

  .main-menu {
    display: flex;
    align-items: center;

    .main-menu-item {
      margin-right: 16px;
      cursor: pointer;

      &:last-child {
        margin-right: 0px;
      }

      &.collapse-btn {
        display: none;
      }
    }


  }

  .ant-input-affix-wrapper {
    width: 609px;
    height: 48px;
  }

  .coin-content {
    color: #F1BB4F;
    font-size: 16px;

    img {
      margin-right: 5px;
    }
  }

  

  @media only screen and (max-width: 991px) {
    .main-menu .main-menu-item.collapse-btn {
      display: flex;
      margin-right: 22px;
    }
  }

  @media only screen and (max-width: 420px) {
    .coin-content {
      span {
        display: none;
      }

      img {
        margin-right: 0px;
      }
    }
  }
`);
