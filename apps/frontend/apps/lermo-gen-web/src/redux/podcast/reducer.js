import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({})

export default function podcastReducer(state = initState, { type, payload = {} }) {
  switch (type) {
    case actions.SUGGEST_SUCCESS:
      return state.set('suggestedData', payload);

    // case actions.GET_PODCAST_SUCCESS:
    //   return state.set('filePath', payload);

    case actions.CREATE_PODCAST_SUCCESS:
      return state.set('filePath', payload);

    default:
      return state;
  }
}