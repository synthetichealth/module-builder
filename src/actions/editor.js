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
