import React, { useEffect, useState } from 'react';
import HomeTemplate from '@repo/ui/homeTemplate';
import { useDispatch, useSelector } from 'react-redux';
import PromptInput from '@repo/ui/promptInput';
import EnterButton from '@repo/ui/enterButton';
import Slide from '@repo/ui/slide'
import actions from '@root/src/redux/slide/actions';

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
    dispatch(actions.create_slide(prompt));
    console.log('Enter');
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} xl={24}>
          <Slide src="http://localhost:4000/slide/index.html"></Slide>
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