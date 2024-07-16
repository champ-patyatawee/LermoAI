const actions = {
  GET_AGENT: 'GET_AGENT',
  GET_AGENT_SUCCESS : 'GET_AGENT_SUCCESS',
  GET_AGENT_FAIL : 'GET_AGENT_FAIL',

  getAgent: () => ({
    type: actions.GET_AGENT
  }),
}

export default actions