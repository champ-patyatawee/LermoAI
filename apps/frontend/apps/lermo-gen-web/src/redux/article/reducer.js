import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({})

export default function articleReducer(state = initState, { type, payload = {} }) {
  switch (type) {
    case actions.CREATE_ARTICLE_SUCCESS:
      return state.set('article', payload);

    default:
      return state;
  }
}