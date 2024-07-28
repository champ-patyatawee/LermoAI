import Styled from 'styled-components';

export default Styled.div`
  padding: 16px;
  border-radius: 16px;
  background: #fafafa;

  h4 {
    margin-bottom: 16px;
  }

  .content {
    background: #fff;
    border-radius: 8px;

    .content-item {
      padding: 8px 16px;
      color: #8c8c8c;
      border-bottom: 1px solid #f0f0f0;

      span {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      &:last-child {
        border: 0px;
      }
    }
  }
`;
