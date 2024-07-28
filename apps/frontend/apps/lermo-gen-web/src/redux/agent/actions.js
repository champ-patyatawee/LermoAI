const actions = {
  GET_AGENT: 'GET_AGENT',
  GET_AGENT_SUCCESS : 'GET_AGENT_SUCCESS',
  GET_AGENT_FAIL : 'GET_AGENT_FAIL',

  UPDATE_AGENT: 'UPDATE_AGENT',
  UPDATE_AGENT_SUCCESS : 'UPDATE_AGENT_SUCCESS',
  UPDATE_AGENT_FAIL : 'UPDATE_AGENT_FAIL',

  CONFG_AGENT: 'CONFG_AGENT',
  CONFG_AGENT_SUCCESS : 'CONFG_AGENT_SUCCESS',
  CONFG_AGENT_FAIL : 'CONFG_AGENT_FAIL',

  getAgent: () => ({
    type: actions.GET_AGENT
  }),

  updateAgent: (data) => ({
    type: actions.UPDATE_AGENT,
    data: data
  }),

  configAgent: (data) => ({
    type: actions.CONFG_AGENT,
    data: data
  }),
}

export default actions