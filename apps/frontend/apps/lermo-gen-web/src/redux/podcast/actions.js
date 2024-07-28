const actions = {
  CREATE_PODCAST: 'CREATE_PODCAST',
  CREATE_PODCAST_SUCCESS : 'CREATE_PODCAST_SUCCESS',
  CREATE_PODCAST_FAIL : 'CREATE_PODCAST_FAIL',

  GET_PODCAST: 'GET_PODCAST',
  GET_PODCAST_SUCCESS : 'GET_PODCAST_SUCCESS',
  GET_PODCAST_FAIL : 'GET_PODCAST_FAIL',

  SUGGEST: 'SUGGEST',
  SUGGEST_SUCCESS: 'SUGGEST_SUCCESS',
  SUGGEST_FAIL: 'SUGGEST_FAIL',

  getPodcast: () => ({
    type: actions.GET_PODCAST
  }),

  createPodcast: (data) => ({
    type: actions.CREATE_PODCAST,
    data: data
  }),

  suggest: (data) => ({
    type: actions.SUGGEST,
    data: data
  }),
}

export default actions