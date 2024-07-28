import styled from 'styled-components';
import wrapProps from '../wrapProps';

export default wrapProps(styled.div`
  .ant-layout-sider {
    height: 100%;
    padding: 0px 24px 24px;

    background: #fff;
    box-shadow: 1px 1px 10px #eee;

    .logo {
      display: flex;
      align-items: center;

      height: 80px;
      margin-bottom: 30px;
    }

    &.ant-layout-sider-collapsed {
      display:none;

      .logo {
        justify-content: center;
      }

      .ant-menu.menu-custom .ant-menu-item {
        padding: 12px !important;
      }
    }
  }

  .ant-menu.menu-custom {
    font-size: 16px;
    border: 0px;

    .ant-menu-item {
      display: flex;
      height: auto;

      line-height: 1.4;
      padding: 12px;
      border-radius: 16px;
      transition: none;

      .anticon, svg {
        margin-right: 14px;
        font-size: 1.4em;
        transition: .2s;
      }

      &:hover, a:hover {
        color: #FC665C;  
      }

      &:active {
        background: transparent;
      }

      &::after {
        border-right: 0px;
      }
    }
    .ant-menu-item-selected, .ant-menu-item-selected a {
      font-weight: bold;
      color: #FC665C;
      background: #FFE7DA;
    }

    &.menu-row {
      margin-bottom: 80px;
    }

    &.ant-menu-inline-collapsed {
      width: 100%;
      .ant-menu-item {
        justify-content: center;
        align-items: center;

        .anticon {
          display: flex;
          margin-right: 0px;
        }
      }
    }
  }
`);
