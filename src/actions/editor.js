export const selectNode = (key, transitionIndex) => {
  return ({
    type: 'SELECT_NODE',
    data: {key, transitionIndex}
  })
}

export const addNode = (currentModuleKey, stateKey, state, selectedState, selectedStateTransition) => {
  return ({
    type: 'ADD_NODE',
    data: {currentModuleKey, stateKey, state, selectedState, selectedStateTransition}
  })
}

export const addStructure = (currentModuleKey, structureName) => {
  return ({
    type: 'ADD_STRUCTURE',
    data: {currentModuleKey, structureName}
  });
}

export const addTransition = (currentModuleKey, nodeName, transitionType) => {
  return ({
    type: 'ADD_TRANSITION',
    data: {currentModuleKey, nodeName, transitionType}
  });
}

export const editNode = (update, path) => {
  return ({
    type: 'EDIT_NODE',
    data: {
      update,
      path
    }
  })
}

export const renameNode = (targetModuleKey, targetNode, newName) => {
  return ({
    type: 'RENAME_NODE',
    data:{
      targetModuleKey,
      targetNode,
      newName
    }
  })
}

export const copyNode = (targetModuleKey, targetNode, newName) => {
  return ({
    type: 'COPY_NODE',
    data:{
      targetModuleKey,
      targetNode,
      newName
    }
  })
}

export const jsonLoad = (key, module) => {
  return ({
    type: 'JSON_LOAD',
    data: {key, module}
  })
}

export const newModule = (key, module) => {
  return ({
    type: 'NEW_MODULE',
    data: {key, module}
  })
}

export const showLoadModule = () => {
  return ({
    type: 'SHOW_LOAD_MODULE'
  })
}

export const hideLoadModule = () => {
  return ({
    type: 'HIDE_LOAD_MODULE'
  })
}

export const showDownload = () => {
  return ({
    type: 'SHOW_DOWNLOAD'
  })
}

export const hideDownload = () => {
  return ({
    type: 'HIDE_DOWNLOAD',
  })
}

export const editModuleName = (targetModuleKey, newName) => {
  return ({
    type: 'EDIT_MODULE_NAME',
    data: {
      newName,
      targetModuleKey
    }
  })
}

export const editModuleRemarks = (targetModuleKey, newRemarks) => {
  return ({
    type: 'EDIT_MODULE_REMARKS',
    data: {
      newRemarks,
      targetModuleKey
    }
  })
}

export const changeStateType = (targetModuleKey, targetNode, newType) => {
  return ({
    type: 'CHANGE_STATE_TYPE',
    data:{
      targetModuleKey,
      targetNode,
      newType
    }
  })
}

export const changeModulePanel = (targetPanel) => {
  return ({
    type: 'CHANGE_MODULE_PANEL',
    data:{
      targetPanel
    }
  })
}

export const undo = () => {
  return ({
    type: 'UNDO'
  })
}

export const redo = () => {
  return ({
    type: 'REDO'
  })
}
