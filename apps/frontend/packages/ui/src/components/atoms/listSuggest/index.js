import React from 'react';
import { useRouter } from 'next/router';
import Style from './style';
import { Divider, List, Typography } from 'antd';

const SiderSuggest = ({ items, onClick }) => {


  const SuggestList = () => {
    if (items) {
      return (
        <List
          size="small"
          bordered
          dataSource={items}
          renderItem={(item) => <List.Item onClick={() => onClick(item)}>{item}</List.Item>}
        />
      )
    }
  }


  return (
    <Style>
      {SuggestList()}
    </Style>
  );
};

export default SiderSuggest;