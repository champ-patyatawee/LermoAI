const actions = {
  CREATE_AGENT: 'CREATE_AGENT',
  CREATE_AGENT_SUCCESS : 'CREATE_AGENT_SUCCESS',
  CREATE_AGENT_FAIL : 'CREATE_AGENT_FAIL',

  GET_AGENT: 'GET_AGENT',
  GET_AGENT_SUCCESS : 'GET_AGENT_SUCCESS',
  GET_AGENT_FAIL : 'GET_AGENT_FAIL',

  SUGGEST: 'SUGGEST',
  SUGGEST_SUCCESS: 'SUGGEST_SUCCESS',
  SUGGEST_FAIL: 'SUGGEST_FAIL',

  getAgent: () => ({
    type: actions.GET_AGENT
  }),

  createAgent: (data) => ({
    type: actions.CREATE_AGENT,
    data: data
  }),
}

export default actions