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
    message.success('Get Podcast');
  } else {
    message.error('Can\'t Get Podcast');
  }
}

function* createPodcast(payload) {
  const { data } = payload;
  const res = yield call(podcastAPI.createPodcast, data);
  if (res) {
    yield put({
      type: actions.CREATE_PODCAST_SUCCESS,
      payload: res,
    });
    message.success('Podcast is ready');
  } else {
    message.error('Can\'t Create Podcast');
  }
}

function* suggest(payload) {
  try {
    const res = yield call(podcastAPI.suggest, payload.data);
    if (res && res.data) {
      yield put({
        type: actions.SUGGEST_SUCCESS,
        payload: res.data,
      });
      message.success('Suggestion made successfully');
    } else {
      throw new Error('Failed to make suggestion');
    }
  } catch (error) {
    yield put({
      type: actions.SUGGEST_FAIL,
      error: error.message,
    });
    message.error('Could not make suggestion');
  }
}

export default function* rootSaga() {
  yield all([
    // takeEvery(actions.GET_PODCAST, getPodcast),
    takeEvery(actions.CREATE_PODCAST, createPodcast),
    takeEvery(actions.SUGGEST, suggest),
  ]);
}