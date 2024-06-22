import {
  all, takeEvery, call, put,
} from 'redux-saga/effects';
import { message } from 'antd';
import Router from 'next/router';
import actions from './actions';
import podcastAPI from './api';

function* getPodcast() {
  const res = yield call(podcastAPI.getPodcast);
  if (res) {
    yield put({
      type: actions.GET_PODCAST_SUCCESS,
      payload: res,
    });
  }
}

function* createPodcast(payload) {
  const { data } = payload;
  const res = yield call(podcastAPI.createPodcast, data);

  console.log(res)

  if (res) {
    yield put({
      type: actions.CREATE_PODCAST_SUCCESS,
      payload: res,
    });
    message.success('Create Podcast');
  } else {
    message.error('Can\'t Create Podcast');
  }
}


export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_PODCAST, getPodcast),
    takeEvery(actions.CREATE_PODCAST, createPodcast)
  ]);
}