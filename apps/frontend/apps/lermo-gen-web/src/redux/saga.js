import { all } from 'redux-saga/effects';
import podcastSaga from './podcast/saga';
export default function* rootSaga() {
  yield all([
    podcastSaga()
  ]);
}
