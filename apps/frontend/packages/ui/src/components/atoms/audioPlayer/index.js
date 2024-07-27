import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

import Style from './style';

const AudioPlayer = ({ src }) => {
  const videoRef = useRef();
  
  useEffect(() => {
    const videoJsOptions = {
      aspectRatio: '16:9',
      playsinline: true,
      fluid: true,
      autoplay: true,
      muted: false,
      controls: true,
      playbackRates: [0.75, 1, 1.25, 1.5, 2],

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

    const player = videojs(videoRef.current, videoJsOptions);
    player.addClass('vjs-lermo');

    return () => {
      player.dispose();
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!src) return;

    const player = videojs(videoRef.current);
    player.src({
      src,
      type: '',
    });
  }, [src]);

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

export default AudioPlayer;
