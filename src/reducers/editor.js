
const initialState = {currentNode: null, currentModuleIndex: 19, loadModuleVisible: false, codeVisible: false};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_NODE':
      return { ...state, currentNode: action.data};
      break;
    case 'NEW_MODULE':
      return {...state, currentModuleIndex: action.data}
    case 'SELECT_MODULE':
      return { ...state, currentModuleIndex: action.data, loadModuleVisible: false};
      break;
    case 'SHOW_LOAD_MODULE':
      return { ...state, loadModuleVisible: true};
      break;
    case 'HIDE_LOAD_MODULE':
      return { ...state, loadModuleVisible: false};
      break;
    case 'SHOW_CODE':
      return { ...state, codeVisible: true};
      break;
    case 'HIDE_CODE':
      return { ...state, codeVisible: false};
      break;
    default:
      return state;

  }
}
