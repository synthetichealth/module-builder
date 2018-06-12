import _ from 'lodash';

const initialState = {modules: {}, analysis: {}};

export default (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case 'LOAD_LIBRARY':
      newState = {...state, modules: {...action.data}, location: action.location}
      return newState

    default:
      return state;
  }
}
