import { combineReducers } from 'redux';

import podcast from './podcast/reducer';
import agent from './agent/reducer';
import article from './article/reducer';

export default combineReducers({
  agent,
  podcast,
  article
});
