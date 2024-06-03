import {
  all, takeEvery, call, put,
} from 'redux-saga/effects';
import { message } from 'antd';
import Router from 'next/router';
import actions from './actions';
import slideAPI from './api';

function* getSlide() {
  const res = yield call(slideAPI.getSlide);
  if (res) {
    yield put({
      type: actions.GET_SLIDE_SUCCESS,
      payload: res,
    });
  }
}

function* createSlide(payload) {
  const { data } = payload;
  const res = yield call(slideAPI.createSlide, data);

  if (res) {
    yield put({
      type: actions.CREATE_SLIDE_SUCCESS,
      payload: res,
    });
    message.success('Create Slide');
  } else {
    message.error('Can\'t Create Slide');
  }
}


export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_SLIDE, getSlide),
    takeEvery(actions.CREATE_SLIDE, createSlide)
  ]);
}