import {
  all, takeEvery, call, put,
} from 'redux-saga/effects';
import { message } from 'antd';
import actions from './actions';
import agentAPI from './api';

function* getAgent() {
  const res = yield call(agentAPI.getAgent);
  if (res.data) {
    console.log(res)
    yield put({
      type: actions.GET_AGENT_SUCCESS,
      payload: res.data,
    });
    message.success('Get Agent');
  } else {
    yield put({
      type: actions.GET_AGENT_FAIL,
    });
    message.error('Can\'t Get Agent');
  }
}

function* configAgent(payload) {
  const { data } = payload;
  const res = yield call(agentAPI.configAgent, data);
  if (res.data) {
    yield put({
      type: actions.CONFG_AGENT_SUCCESS,
      payload: res.data,
    });
    message.success('Seleted Agent');
  } else {
    yield put({
      type: actions.CONFG_AGENT_FAIL,
    });
    message.error('Can\'t Seleted Agent');
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_AGENT, getAgent),
    takeEvery(actions.CONFG_AGENT, configAgent),
  ]);
}