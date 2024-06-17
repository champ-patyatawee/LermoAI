import Styled from 'styled-components';

export default Styled.div`
  .profile-container {
    width: 276px;
    background: #FFFFFF;
    border-radius: 16px;
    position: fixed;
    z-index: 1;
    padding-left: 0;
    top: 6rem;
    right: 77%;
  }

  .ant-card {
    border-radius: 16px;
  }

  .material {
    box-shadow: none;
  }

  .ant-avatar {
    width: 128px;
    height: 128px;
    text-align: center;
  }

  .ant-card-cover {
    display: flex;
    justify-content: center;
    padding: 48px 0px 24px 0;
  }

  .ant-card-body {
    text-align: center;
    padding: 24px;
  }

  .ant-avatar {
    img {
      object-fit: cover;
      width: 128px;
      height: 128px;
    }
  }

  .about-text {
    text-align: center;
    margin: 45px 0;
    display: block;
    width: 100%;
    max-height: 220px;
    word-wrap: break-word;
    font-style: normal;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 22px;
    white-space: normal;
    /* white-space: nowrap; */
    overflow: hidden !important;
    text-overflow: ellipsis;
  }

  .col-follow {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.45);
  }

  .btn-follow {
    height: 48px;
    width: 100%;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
  }

  .follow-container {
    display: flex;
    margin-top: 35px;

    .follow-content {
      width: 50%;
      text-align: center;
    }
  }

  @media only screen and (max-width: 991px) {
    .profile-container {
      width: 100%;
      position: static;
      z-index: 1;
      padding-left: 0;
      top: 0;
      left: 0;
    }
  }
`;
