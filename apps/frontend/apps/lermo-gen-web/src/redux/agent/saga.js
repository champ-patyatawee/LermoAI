import {
  all, takeEvery, call, put,
} from 'redux-saga/effects';
import { message } from 'antd';
import actions from './actions';
import agentAPI from './api';

function* getAgent() {
  const res = yield call(agentAPI.getAgent);
  if (res) {
    console.log(res)
    yield put({
      type: actions.GET_AGENT_SUCCESS,
      payload: res,
    });
    message.success('Get Agent');
  } else {
    yield put({
      type: actions.GET_AGENT_FAIL,
    });
    message.error('Can\'t Get Agent');
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_AGENT, getAgent),
  ]);
}