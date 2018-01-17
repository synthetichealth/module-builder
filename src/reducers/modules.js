import _ from 'lodash';

const initialState = [];


export default (state = initialState, action) => {
  let newState = state;

  switch (action.type) {
    case 'NEW_MODULE':
      return [...newState, {name: 'New Module', remarks: 'New Remarks', states: {Initial: {type: 'Initial'}}}]
    case 'EDIT_NODE':
      let path = action.data.path.join('.');

      let value = Object.values(action.data.update)[0]
      if(typeof value === 'object') {
        value = value.id;
      }
      newState = [...state];
      _.set(newState, path, value);
      return [...newState]
    case 'ADD_NODE':
      newState[action.data.currentModuleIndex].states = {...newState[action.data.currentModuleIndex].states, ...{'NEW_STATE': {}}};
      return [...newState]
    case 'RENAME_NODE':
      newState = [...state];
      let oldModule = newState[action.data.targetModuleIndex].states[action.data.targetNode.name];
      newState[action.data.targetModuleIndex].states[action.data.newName.name] = oldModule;
      delete newState[action.data.targetModuleIndex].states[action.data.targetNode.name];
      return newState;
    case 'EDIT_MODULE_NAME':
      newState = [...state];
      newState[action.data.targetModuleIndex].name = action.data.newName;
      return newState;
    case 'EDIT_MODULE_REMARKS':
      newState = [...state];
      newState[action.data.targetModuleIndex].remarks = [action.data.newRemarks]; // Need to split into rows for readability
      return newState;
    default:
      return state;
  }
}
