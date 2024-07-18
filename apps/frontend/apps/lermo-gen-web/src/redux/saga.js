import { all } from 'redux-saga/effects';
import podcastSaga from './podcast/saga';
import agentSaga from './agent/saga'
export default function* rootSaga() {
  yield all([
    agentSaga(),
    podcastSaga()
  ]);
}
