const actions = {

  GET_SLIDE: 'GET_SLIDE',
  GET_SLIDE_SUCCESS: 'GET_SLIDE_SUCCESS',
  GET_SLIDE_FAIL: 'GET_SLIDE_FAIL',

  CREATE_SLIDE: 'CREATE_SLIDE',
  CREATE_SLIDE_SUCCESS: 'CREATE_SLIDE_SUCCESS',
  CREATE_SLIDE_FAIL: 'CREATE_SLIDE_FAIL',

  UPDATE_SLIDE: 'UPDATE_SLIDE',
  UPDATE_SLIDE_SUCCESS: 'UPDATE_SLIDE_SUCCESS',
  UPDATE_SLIDE_FAIL: 'UPDATE_SLIDE_FAIL',


  get_slide: () => ({
    type: actions.GET_SLIDE
  }),

  create_slide: (prompt) => ({
    type: actions.CREATE_SLIDE,
    data: {
      prompt,
    },
  }),

  update_slide: (slideID, content) => ({
    type: actions.UPDATE_SLIDE,
    data: {
      slideID,
      content,
    },
  })
}

export default actions;