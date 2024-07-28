import { all } from 'redux-saga/effects';
import podcastSaga from './podcast/saga';
import agentSaga from './agent/saga'
import articleSaga from './article/saga'
export default function* rootSaga() {
  yield all([
    agentSaga(),
    podcastSaga(),
    articleSaga(),
  ]);
}
