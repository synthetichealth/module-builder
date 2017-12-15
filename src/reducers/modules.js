import _ from 'lodash';

const initialState = [];


export default (state = initialState, action) => {
  let newState = state;
  switch (action.type) {
    case 'EDIT_NODE':
      let path = action.data.path.join('.');
      let value = Object.values(action.data.update).map((v) => v.id)[0]
      newState = {...state};
      _.set(newState, path, value);
      return {...newState}
    case 'RENAME_NODE':
      newState = {...state};
      let oldModule = newState[action.data.targetModuleIndex].states[action.data.targetNode.name];
      newState[action.data.targetModuleIndex].states[action.data.newName.name] = oldModule;
      delete newState[action.data.targetModuleIndex].states[action.data.targetNode.name];
      return newState;
    default:
      return state;
  }
}
