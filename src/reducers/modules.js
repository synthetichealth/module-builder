import _ from 'lodash';

const initialState = [];


export default (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_NODE':
      let path = action.data.path.join('.');
      let value = Object.values(action.data.update).map((v) => v.id)[0]
      let newState = {...state};
      _.set(newState, path, value);
      debugger
      return {...newState}
    default:
      return state;
  }
}
