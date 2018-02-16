
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

    case 'RENAME_NODE':
      return { ...state, selectedStateKey: action.data.newName.name};

    case 'ADD_NODE':
      let newState = {...state}
      newState.selectedStateKey = action.data.stateKey;
      return { ...newState }

    case '@@router/LOCATION_CHANGE':
      let selectedModuleKey = state.selectedModuleKey;

      if(action.payload.hash.startsWith('#')){
        selectedModuleKey = action.payload.hash.substr(1)
      }
      
      return { ...state, selectedModuleKey, selectedStateKey: null, loadModuleVisible: false};

    case 'NEW_MODULE':
      return { ...state, selectedStateKey: null};

    case 'LOAD_JSON':
      return { ...state, selectedModuleKey: action.data.selectedModuleKey};

    case 'SHOW_LOAD_MODULE':
      return { ...state, loadModuleVisible: true};

    case 'HIDE_LOAD_MODULE':
      return { ...state, loadModuleVisible: false};
          
    case 'SHOW_DOWNLOAD':
      return { ...state, downloadVisible: true};

    case 'HIDE_DOWNLOAD':
      return { ...state, downloadVisible: false};

    default:
      return state;

  }
}
