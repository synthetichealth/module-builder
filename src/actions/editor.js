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

export const editNode = (currentModuleIndex, node, update) => {
  debugger
  return ({
    type: 'EDIT_NODE',
    data: {
      currentModuleIndex,
      node,
      update
    }
  })
}
