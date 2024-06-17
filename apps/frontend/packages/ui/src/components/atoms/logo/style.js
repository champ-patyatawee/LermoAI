import styled from 'styled-components';
import wrapProps from '../../atoms/wrapProps';

export default wrapProps(styled.div`
  img {
    width: 160px;
  }

  .logo-mobile {
    display: none;
  }

  @media only screen and (max-width: 991px) { 
    width: 120px;
  }


  @media only screen and (max-width: 420px) {
    width: 38px;

    .logo {
      display: none;
    }
    .logo-mobile {
      display: block;
    }
  }
`);
