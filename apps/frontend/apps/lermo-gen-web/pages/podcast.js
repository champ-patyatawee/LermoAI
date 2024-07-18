import React, { useEffect, useState } from 'react';
import HomeTemplate from '@repo/ui/homeTemplate';
import { useDispatch, useSelector } from 'react-redux';
import PromptInput from '@repo/ui/promptInput';
import EnterButton from '@repo/ui/enterButton';
import Slide from '@repo/ui/slide'
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

  const suggestedData = useSelector((state) => state.podcast.get('suggestedData'));
  const podcastURL = useSelector((state) => state.podcast.get('full_url')) || 'http://localhost:8000/tmp/voice/default.wav';

  useEffect(() => {
    dispatch(actions.getPodcast());
  }, []);

  useEffect(() => {
    if (podcastURL) {
      setAudioSrc(podcastURL);
    }
  }, [podcastURL]);

  const onClickSuggestion = (item) => {
    const data = {
      prompt: item,
    }
    dispatch(actions.createPodcast(data));
    dispatch(actions.suggest(data));
  }
  
  const onPromptChange = (e) => {
    setPrompt(e.target.value);
  }

  const onEnter = () => {
    const data = {
      prompt: prompt,
      config: "default, EN-Default"
    }
    dispatch(actions.createPodcast(data));
    dispatch(actions.suggest(data));
    setAudioSrc('')
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={19} xl={19}>
          <AudioPlayer src={audioSrc} type="audio/wav" />
        </Col>
        <Col xs={24} sm={24} md={4} xl={4}>
          <ListSuggest items={suggestedData?.items} onClick={onClickSuggestion} />
        </Col>
      </Row>
      <div style={{ marginBottom: '16px' }}></div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={17} xl={17}>
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