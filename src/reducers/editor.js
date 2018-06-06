
const initialState = {
    selectedStateKey: null, 
    selectedModuleKey: 'examplitis', 
    loadModuleVisible: false, 
    downloadVisible: false,
    selectedModulePanel: 'info',
    modulePanelVisible: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_NODE':
      let selectedModulePanel = state.selectedModulePanel;
      if(action.data){
        if(selectedModulePanel === 'info'){
          selectedModulePanel = 'state';
        }
      } else {
        if(selectedModulePanel === 'state'){
          selectedModulePanel = 'info';
        }
      }

      return { ...state, selectedModulePanel, selectedModulePanel, selectedStateKey: action.data};

    case 'RENAME_NODE':
      return { ...state, selectedStateKey: action.data.newName.name};

    case 'COPY_NODE':
      return { ...state, selectedStateKey: action.data.newName};

    case 'ADD_NODE':
      let newState = {...state}
      newState.selectedStateKey = action.data.stateKey;
      newState.selectedModulePanel= 'state';
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

    case 'CHANGE_MODULE_PANEL':
      return { ...state, selectedModulePanel: action.data.targetPanel, modulePanelVisible: action.data.targetPanel !== 'hide'};

    default:
      return state;

  }
}
