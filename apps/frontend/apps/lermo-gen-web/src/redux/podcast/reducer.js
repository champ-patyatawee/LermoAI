import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({})

export default function podcastReducer(state = initState, { type, payload = {} }) {
  switch (type) {
    default:
      return state;
  }
}