import React, { useEffect, useState } from 'react';
import HomeTemplate from '@repo/ui/homeTemplate';
import { useDispatch, useSelector } from 'react-redux';
import PromptInput from '@repo/ui/promptInput';
import EnterButton from '@repo/ui/enterButton';
import ListSuggest from '@repo/ui/listSuggest';

import {
  Layout, Col, Row, Button, Divider
} from 'antd';


const Index = () => {
  return (
    <>
      <Row gutter={[16, 16]}>
        
      </Row>
    </>
  )
}

Index.Layout = HomeTemplate;

export default Index;