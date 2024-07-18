import { combineReducers } from 'redux';

import podcast from './podcast/reducer';
import agent from './agent/reducer';

export default combineReducers({
  agent,
  podcast
});
