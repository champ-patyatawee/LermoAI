import React, { useEffect, useRef, useState } from 'react';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

import Style from './style';

const Video = ({ src, type }) => {
  const videoRef = useRef();

  const initEvent = () => {
    // Initialize the foo plugin after any player is created.
    // player.foo();
  };

  // const onSeek = (time) => {
  //   const { currentTime, duration } = videoRef.current;
  //   const newTime = currentTime + time;
  //   videoRef.current.currentTime = newTime < duration ? newTime : duration - 3;
  // };

  useEffect(() => {
    const videoJsOptions = {
      aspectRatio: '16:9',
      playsinline: true,
      fluid: true,
      autoplay: false,
      muted: false,
      controls: true,
      playbackRates: [0.75, 1, 1.25, 1.5, 2],
      sources: [
        {
          type: type || "video/mp4",
          src: src
        }
      ],

      controlBar: {
        children: {
          playToggle: {},
          volumePanel: { inline: false },
          currentTimeDisplay: {},
          progressControl: {
            keepTooltipsInside: true,
          },
          remainingTimeDisplay: {},
          playbackRateMenuButton: {},
          fullscreenToggle: {},
        },
      },
    };

    // videojs.hook('setup', initEvent);
    const player = videojs(videoRef.current, videoJsOptions);
    player.addClass('vjs-lermo');

    return () => {
      player.dispose();
    };
  }, []);

  let LoadingComponent;
  if (!src) {
    LoadingComponent = (
      <div
        className="loading shimmer"
      />
    );
  }

  return (
    <Style>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
        {LoadingComponent}
      </div>
    </Style>
  );
};

export default Video;
