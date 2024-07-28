import styled from 'styled-components';

const borderRadiusPlayer = '16px';

export default styled.div`
  .vjs-lermo {
    font-size: 14px;
    background: black;

    &.video-js {
      border-radius: ${borderRadiusPlayer};
    }

    .loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      border-radius: ${borderRadiusPlayer};
    }
    
    .forward-btn, .backward-btn {
      position: absolute;
      top: 0;

      display: none;
      width: 12.5%;
      height: 100%;
      opacity: 1;
      transition: visibility 0.1s, opacity 0.1s;
      cursor: pointer;
      transition: .2s all;
    }

    .forward-btn {
      right: 0px;
      &:hover {
        transform: translateX(+5px);
      }
    }

    .backward-btn {
      left: 0px;
      &:hover {
        transform: translateX(-5px);
      }
    }

    .vjs-tech, .vjs-modal-dialog {
      border-radius: ${borderRadiusPlayer};
    }

    .vjs-control-bar {
      height: 3.5em;
      background: transparent;
      border-bottom-left-radius: ${borderRadiusPlayer};
      border-bottom-right-radius: ${borderRadiusPlayer};
    }

    .vjs-button:focus-visible {
      outline: none;
    }

    .vjs-control, .vjs-button > .vjs-icon-placeholder:before {
      display: flex;
      justify-content: center;
      align-items: center;  
    }

    .vjs-control {

      &.vjs-volume-panel {
        justify-content: normal;
        align-items: inherit;
      }

      &.vjs-playback-rate .vjs-playback-rate-value {
        font-size: 1.2em; 
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    

    .vjs-button > .vjs-icon-placeholder:before {
      font-size: 1.8em;
      line-height: 1.67;
    }

    .vjs-big-play-button {
      border-color: #fff;
      background: #fff;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
      border-radius: 50%;
      width: 2.5em;
      height: 2.5em;
      border: 0px;

      .vjs-icon-placeholder::before {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.75em;
        color: #262626;
      }
    }

    /* Event Playing */
    &.vjs-has-started {
      .forward-btn, .backward-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 1.2rem;

        .anticon {
          font-size: 2rem;
          margin-top: 10px;
        }
      }

      /* Playing & InActive */
      &.vjs-user-inactive.vjs-playing {
        .forward-btn, .backward-btn {
          opacity: 0;
          transition: visibility 1s, opacity 1s;
        }
      }
    }
  }


  /* Hover, Focus */
  .vjs-lermo:hover .vjs-big-play-button, .vjs-lermos .vjs-big-play-button:focus {
    background-color: rgba(255, 255, 255, 0.5);
    transition: all 0s;
  }


  @media only screen and (max-width: 768px) {
    .vjs-lermo {
      font-size: 12px;
      &.video-js {
        border-radius: 8px;
      }
      .vjs-tech {
        border-radius: 8px;
      }
      .vjs-control.vjs-volume-panel {
        display: none;
      }
    }
  }

  @media only screen and (max-width: 450px) {
    .vjs-lermo {
      font-size: 8px;

      &.vjs-has-started {
        .forward-btn, .backward-btn {
          font-size: 1rem;

          .anticon {
            font-size: 1.2rem;
          }
        }
      }
    }
  }
`
