export const selectNode = (name) => {
  return ({
    type: 'SELECT_NODE',
    data: name
  })
}

export const addNode = (currentModuleIndex) => {
  return ({
    type: 'ADD_NODE',
    data: {currentModuleIndex}
  })
}

export const addStructure = (currentModuleIndex, structureName) => {
  return ({
    type: 'ADD_STRUCTURE',
    data: {currentModuleIndex, structureName}
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

export const renameNode = (targetModuleIndex, targetNode, newName) => {
  return ({
    type: 'RENAME_NODE',
    data:{
      targetModuleIndex,
      targetNode,
      newName
    }
  })
}

export const newModule = (nextModuleIndex) => {
  return ({
    type: 'NEW_MODULE',
    data: nextModuleIndex
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

export const selectModule = (moduleIndex) => {
  return ({
    type: 'SELECT_MODULE',
    data: moduleIndex
  })
}

export const showCode = () => {
  return ({
    type: 'SHOW_CODE'
  })
}

export const hideCode = () => {
  return ({
    type: 'HIDE_CODE',
  })
}


export const changeStateType = (targetModuleIndex, targetNode, newType) => {
  return ({
    type: 'CHANGE_STATE_TYPE',
    data:{
      targetModuleIndex,
      targetNode,
      newType
    }
  })
}
