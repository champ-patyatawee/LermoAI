import React, { useEffect, useState } from 'react';
import HomeTemplate from '@repo/ui/homeTemplate';
import { useDispatch, useSelector } from 'react-redux';
import PromptInput from '@repo/ui/promptInput';
import EnterButton from '@repo/ui/enterButton';
import VideoPlayer from '@repo/ui/videoPlayer';
import AudioPlayer from '@repo/ui/audioPlayer';
import ListSuggest from '@repo/ui/listSuggest';

import actions from '@redux/podcast/actions';

import {
  Layout, Col, Row, Button, Divider
} from 'antd';


const Podcast = () => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState('');
  const [audioSrc, setAudioSrc] = useState('');

  const podcastURL = useSelector((state) => state.podcast.get('full_url')) || 'http://localhost:8000/tmp/voice/default.wav';

  useEffect(() => {
    dispatch(actions.getPodcast());
  }, []);

  useEffect(() => {
    if (podcastURL) {
      setAudioSrc(podcastURL);
    }
  }, [podcastURL]);

  const onPromptChange = (e) => {
    setPrompt(e.target.value);
  }

  const onEnter = () => {
    const data = {
      prompt: prompt,
    }
    dispatch(actions.createPodcast(data));
    setAudioSrc('')
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={{ span: 20 , offset: 2}} xl={{ span: 18 , offset: 2}}>
          <AudioPlayer src={audioSrc} type="audio/wav" />
        </Col>
      </Row>
      <div style={{ marginBottom: '16px' }}></div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={{ span: 18 , offset: 2}} xl={{ span: 16 , offset: 2}}>
          <PromptInput onPromptChange={onPromptChange} />
        </Col>
        <Col xs={24} sm={24} md={2} xl={2}>
          <EnterButton onClick={onEnter} />
        </Col>
      </Row>
    </>
  )
}

Podcast.Layout = HomeTemplate;

export default Podcast;