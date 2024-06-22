import React, { useEffect, useState } from 'react';
import HomeTemplate from '@repo/ui/homeTemplate';
import { useDispatch, useSelector } from 'react-redux';
import PromptInput from '@repo/ui/promptInput';
import EnterButton from '@repo/ui/enterButton';
import Slide from '@repo/ui/slide'
import VideoPlayer from '@repo/ui/videoPlayer';
import actions from '@redux/podcast/actions';

import {
  Layout, Col, Row, Button,
} from 'antd';


const Home = () => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState('');
  const onPromptChange = (e) => {
    setPrompt(e.target.value);
    console.log('Change:', e.target.value);
  }

  const onEnter = () => {
    const data = {
      prompt: prompt,
      config: "v1, EN-Default"
    }
    dispatch(actions.createPodcast(data));
    console.log('Enter');
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} xl={24}>
          <VideoPlayer src="http://localhost:8000/tmp/voice/v1.wav" type="audio/wav" />
        </Col>
        
        <Col xs={24} sm={24} md={24} xl={22}>
          <PromptInput onPromptChange={onPromptChange} />
        </Col>

        <Col xs={24} sm={24} md={24} xl={2}>
          <EnterButton onClick={onEnter} />
        </Col>
      </Row>
    </>
  )
}


Home.Layout = HomeTemplate;

export default Home;