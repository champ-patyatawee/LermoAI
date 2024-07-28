const actions = {
  CREATE_ARTICLE: 'CREATE_ARTICLE',
  CREATE_ARTICLE_SUCCESS : 'CREATE_ARTICLE_SUCCESS',
  CREATE_ARTICLE_FAIL : 'CREATE_ARTICLE_FAIL',

  GET_ARTICLE: 'GET_ARTICLE',
  GET_ARTICLE_SUCCESS : 'GET_ARTICLE_SUCCESS',
  GET_ARTICLE_FAIL : 'GET_ARTICLE_FAIL',

  SUGGEST: 'SUGGEST',
  SUGGEST_SUCCESS: 'SUGGEST_SUCCESS',
  SUGGEST_FAIL: 'SUGGEST_FAIL',

  getArticle: () => ({
    type: actions.GET_ARTICLE
  }),

  createArticle: (data) => ({
    type: actions.CREATE_ARTICLE,
    data: data
  }),

  suggest: (data) => ({
    type: actions.SUGGEST,
    data: data
  }),
}

export default actions