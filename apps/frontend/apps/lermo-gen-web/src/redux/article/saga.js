import {
  all, takeEvery, call, put,
} from 'redux-saga/effects';
import { message } from 'antd';
import Router from 'next/router';
import actions from './actions';
import articleAPI from './api';

function* getArticle() {
  const res = yield call(articleAPI.getArticle);
  if (res) {
    yield put({
      type: actions.GET_ARTICLE_SUCCESS,
      payload: res,
    });
    message.success('Get Article');
  } else {
    message.error('Can\'t Get Article');
  }
}

function* createArticle(payload) {
  const { data } = payload;
  const res = yield call(articleAPI.createArticle, data);
  if (res.data) {
    yield put({
      type: actions.CREATE_ARTICLE_SUCCESS,
      payload: res.data,
    });
    message.success('Article is ready');
  } else {
    message.error('Can\'t Create Article');
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ARTICLE, getArticle),
    takeEvery(actions.CREATE_ARTICLE, createArticle),
  ]);
}