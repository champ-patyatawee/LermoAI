import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({})

export default function agentReducer(state = initState, { type, payload = {} }) {
  switch (type) {
    case actions.GET_AGENT_SUCCESS:
      return state.set('agents', payload);
    default:
      return state;
  }
}