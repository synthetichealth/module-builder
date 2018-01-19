
const initialState = {currentNode: null, currentModuleIndex: 0, loadModuleVisible: false, downloadVisible: false};

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
    case 'SHOW_DOWNLOAD':
      return { ...state, downloadVisible: true};
      break;
    case 'HIDE_DOWNLOAD':
      return { ...state, downloadVisible: false};
      break;
    default:
      return state;

  }
}
