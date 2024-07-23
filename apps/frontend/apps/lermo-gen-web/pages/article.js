import React, { useEffect, useState } from 'react';
import HomeTemplate from '@repo/ui/homeTemplate';
import { useDispatch, useSelector } from 'react-redux';
import PromptInput from '@repo/ui/promptInput';
import EnterButton from '@repo/ui/enterButton';
import ListSuggest from '@repo/ui/listSuggest';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// import dynamic from 'next/dynamic';

// const DynamicMarkdown = dynamic(() => import('react-markdown'), {
//   ssr: false,
// });

import actions from '@redux/article/actions';

import {
  Layout, Col, Row, Button, Divider
} from 'antd';


const Article = () => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState('');

  const article = useSelector((state) => state.article.get('article')) ?? ''


  const onClickSuggestion = (item) => {

  }
  
  const onPromptChange = (e) => {
    setPrompt(e.target.value);
  }

  const onEnter = () => {
    const data = {
      prompt: prompt
    }

    dispatch(actions.createArticle(data));
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={19} xl={19}>
          <Markdown remarkPlugins={[remarkGfm]}>{article}</Markdown>
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