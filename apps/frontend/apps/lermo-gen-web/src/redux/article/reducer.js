import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({})

export default function articleReducer(state = initState, { type, payload = {} }) {
  switch (type) {
    case actions.SUGGEST_SUCCESS:
      return state.set('suggestedData', payload);

    // case actions.GET_ARTICLE_SUCCESS:
    //   return state.set('filePath', payload);

    case actions.CREATE_ARTICLE_SUCCESS:
      return state.set('filePath', payload);

    default:
      return state;
  }
}