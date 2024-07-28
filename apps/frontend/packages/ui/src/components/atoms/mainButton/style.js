import styled from 'styled-components';
import wrapProps from '../../atoms/wrapProps';

export default wrapProps(styled.div`
  border-radius: 16px;
  border: 1px solid #F0F0F0;
  background: #fff;

  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &.fit-content {
    width: auto;
    padding: 12px 16px;
  }
`);
