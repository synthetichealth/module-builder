
const initialState = {
    selectedStateKey: null, 
    selectedModuleKey: 'examplitis', 
    loadModuleVisible: false, 
    downloadVisible: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_NODE':
      return { ...state, selectedStateKey: action.data};
      break;

    case 'ADD_NODE':
      let newState = {...state}
      newState.selectedStateKey = action.data.stateKey;
      return { ...newState }
      break;

    case '@@router/LOCATION_CHANGE':
      let selectedModuleKey = state.selectedModuleKey;

      if(action.payload.hash.startsWith('#')){
        selectedModuleKey = action.payload.hash.substr(1)
      }
      
      return { ...state, selectedModuleKey, selectedStateKey: null, loadModuleVisible: false};
      break;

    case 'NEW_MODULE':
      return { ...state, selectedStateKey: null};
      break;

    case 'LOAD_JSON':
      return { ...state, selectedModuleKey: action.data.selectedModuleKey};
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
