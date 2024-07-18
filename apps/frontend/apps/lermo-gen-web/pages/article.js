import React, { useEffect, useState } from 'react';
import HomeTemplate from '@repo/ui/homeTemplate';
import { useDispatch, useSelector } from 'react-redux';
import PromptInput from '@repo/ui/promptInput';
import EnterButton from '@repo/ui/enterButton';
import Slide from '@repo/ui/slide'
import VideoPlayer from '@repo/ui/videoPlayer';
import AudioPlayer from '@repo/ui/audioPlayer';
import ListSuggest from '@repo/ui/listSuggest';

import actions from '@redux/agent/actions';

import {
  Layout, Col, Row, Button, Divider
} from 'antd';


const Article = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(actions.getAgent());
  // }, [])

  const onSelectAgent = () => {
    dispatch(actions.getAgent());
  }

  const onClickSuggestion = (item) => {

  }
  
  const onPromptChange = (e) => {
    setPrompt(e.target.value);
  }

  const onEnter = () => {

  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={19} xl={19}>
          Article xxxx
        </Col>
        <Col xs={24} sm={24} md={4} xl={4}>
          <ListSuggest onClick={onClickSuggestion} />
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

Article.Layout = HomeTemplate;

export default Article;