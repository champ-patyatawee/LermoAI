import { all } from 'redux-saga/effects';
import slideSaga from './slide/saga';
import podcastSaga from './podcast/saga';
export default function* rootSaga() {
  yield all([
    slideSaga(),
    podcastSaga()
  ]);
}
