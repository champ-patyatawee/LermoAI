import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension';

import rootReducer from './reducer';
import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();

const bindMiddleware = (middleware) => composeWithDevToolsDevelopmentOnly(applyMiddleware(...middleware));

function initStore(initialState = {}) {
  const store = createStore(
    rootReducer,
    initialState,
    bindMiddleware([sagaMiddleware]),
  );

  store.runSaga = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga);
  };

  store.stopSaga = async () => {
    if (!store.sagaTask) return;
    store.dispatch(END);
    await store.sagaTask.done;
    store.sagaTask = null;
  };

  store.execSagaTasks = async (isServer, tasks) => {
    store.runSaga();
    tasks(store.dispatch);
    await store.stopSaga();
    if (!isServer) store.runSaga();
  };

  store.runSaga();
  return store;
}

export default initStore;
