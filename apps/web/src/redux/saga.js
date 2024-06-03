import { all } from 'redux-saga/effects';
import slideSaga from './slide/saga';
export default function* rootSaga() {
  yield all([
    slideSaga()
  ]);
}
