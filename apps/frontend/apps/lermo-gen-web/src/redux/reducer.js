import { combineReducers } from 'redux';

import slide from './slide/reducer';
import podcast from './podcast/reducer';

export default combineReducers({
  slide,
  podcast
});
