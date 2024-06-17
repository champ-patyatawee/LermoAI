import React from 'react';
import { Flex, Input } from 'antd';

const { TextArea } = Input;

const Component = ({ onPromptChange }) => (
    <TextArea
      showCount
      onChange={onPromptChange}
      placeholder="Prompt"
      style={{ height: 120, resize: 'none' }}
    />
);

export default Component;