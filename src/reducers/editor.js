
const initialState = {currentNode: null, currentModuleIndex: 0};


export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_NODE':
      return { ...state, currentNode: action.data};
      break;
    default:
      return state;

  }
}
