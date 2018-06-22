const initialState = {
  moduleCodes: {}, // list types of nodes
  warnings: []
};

export default (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case 'NEW_MODULE':
      newState = {...state}
      newState.moduleCodes = {...newState.moduleCodes}


      Object.keys(action.data.module.states).forEach(stateKey => {
        const state = action.data.module.states[stateKey];
        state.codes && state.codes.forEach(code => {
          if(!newState.moduleCodes[code.code]){
            newState.moduleCodes[code.code] = []
          } else {
            newState.moduleCodes[code.code] = [...newState.moduleCodes]
          }
          newState.moduleCodes[code.code].push({...code, module: action.data.key, state: state.name});
        });
      });

      return newState

    case 'BULK_LOAD_MODULES':
      newState = {...state}
      newState.moduleCodes = {}

      Object.keys(action.data).forEach(moduleKey => {
        const module = action.data[moduleKey];
        Object.keys(module.states).forEach(stateKey => {
          const state = module.states[stateKey];
          state.codes && state.codes.forEach(code => {
            if(!newState.moduleCodes[code.code]){
              newState.moduleCodes[code.code] = []
            } else {
              newState.moduleCodes[code.code] = [...newState.moduleCodes]
            }
            newState.moduleCodes[code.code].push({...code, module: action.data.key, state: state.name});
          });
        });
      });
      return newState

    case 'EDIT_NODE':
      // let path = action.data.path.join('.');
      // let value = Object.values(action.data.update)[0]
      // if(typeof value === 'object') {
      //   value = value.id;
      // }
      // newState = {...state};
      // if(value !== null && value !== undefined) {
      //   _.set(newState, path, normalizeType(value));

      //   // FIX DEPENDENT THINGS
      //   let splitPath = []
      //   if(Array.isArray(path)){
      //     splitPath = path.join('.').split('.')
      //   } else {
      //     splitPath = path.split('.')
      //   }

      //   // If change operator on attribute, clean up value if needed
      //   if(splitPath[splitPath.length-1] === 'operator'){
      //     const parent = _.get(newState, splitPath.slice(0,-1).join('.'));
      //     if((parent.operator === 'is nil' || parent.operator === 'is not nil')){
      //       _.unset(newState, splitPath.slice(0,-1).join('.') + '.value')
      //     } else {
      //       if(parent.operator.value === undefined){
      //         _.set(newState, splitPath.slice(0,-1).join('.') + '.value', 0)
      //       }
      //     }
      //   }
      // }
      // else{
      //   _.unset(newState, path);
      //   let parent = [...action.data.path].splice(0, action.data.path.length -1).join(".");
      //   let newVal = _.get(newState, parent);
      //   if(Array.isArray(newVal)) {
      //     _.set(newState, parent, newVal.filter(x => x));
      //   }

      //   // check to see if it is a node deletion, in which case we need to references
      //   let splitPath = []
      //   if(Array.isArray(path)){
      //     splitPath = path.join('.').split('.')
      //   } else {
      //     splitPath = path.split('.')
      //   }

      //   if(splitPath.length === 3 && splitPath[1] === 'states'){
      //     let stateName = splitPath[2]
      //     fixStateReferences(newState[splitPath[0]], stateName, null)
      //   }

      // }

      return {...newState}

    case 'ADD_STRUCTURE':
      newState = {...state};
      // newState[action.data.currentModuleKey].states = {...newState[action.data.currentModuleKey].states, ...getTemplate(`Structure.${action.data.structureName}`)};
      return newState

    case 'ADD_TRANSITION':
      newState = {...state};

      // let transitionMapping = {
      //   Conditional: 'conditional_transition',
      //   Distributed: 'distributed_transition',
      //   Direct: 'direct_transition',
      //   Complex: 'complex_transition',
      // };

      // let transitionName = transitionMapping[action.data.transitionType];
      // let oldTransitionName = null;
      // if (action.data.nodeName.transition != null) {
      //   oldTransitionName = transitionMapping[action.data.nodeName.transition.type];
      // }

      // let paths = Object.values(transitionMapping);
      // for (var pathIndex in paths) {
      //   delete newState[action.data.currentModuleKey].states[action.data.nodeName.name][paths[pathIndex]];
      // }
      // newState[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName] = getTemplate(`Transition.${action.data.transitionType}`);

      // // Get first of previous transition locations if available
      // let transitionTo = null;
      // switch(oldTransitionName) {
      //   case 'direct_transition':
      //     transitionTo = _.get(action, 'data.nodeName.transition.to', null);
      //     break;
      //   case 'distributed_transition':
      //   case 'conditional_transition':
      //     transitionTo = _.get(action, 'data.nodeName.transition.transition[0].to', null);
      //     break;
      //   case 'complex_transition':
      //     transitionTo = _.get(action, 'data.nodeName.transition.transition[0].distributions[0].to', null);
      //     break;
      // }

      // // Provide previous transition location to new if available
      // if (transitionTo !== null) {
      //   switch(transitionName) {
      //     case 'direct_transition':
      //       newState[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName] = transitionTo;
      //       break;
      //     case 'distributed_transition':
      //     case 'conditional_transition':
      //       newState[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName][0].transition = transitionTo;
      //       break;
      //     case 'complex_transition':
      //       newState[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName][0].distributions[0].transition = transitionTo;
      //       break;
      //   }
      // }

      return newState

    case 'ADD_NODE':
      newState = {...state};
      // newState[action.data.currentModuleKey].states = {...newState[action.data.currentModuleKey].states, [action.data.stateKey]:action.data.state};
      return {...newState}

    case 'RENAME_NODE':
      newState = {...state};
      // let stateName = action.data.targetNode.name;
      // let newName = action.data.newName.name;
      // let newModule = _.cloneDeep(state[action.data.targetModuleKey])
      // let moduleState = newModule.states[stateName]

      // if(moduleState === undefined){
      //   // if we can't find it, then it might be a blank state (Unnamed state)
      //   // Check in the blank key
      //   moduleState = newModule.states[""]
      //   stateName = ""
      // }

      // if(moduleState === undefined){
      //   // If we still can't find the state, let's just hop out of here.
      //   return newState;
      // }

      // delete newModule.states[stateName];

      // moduleState.name = newName
      // newModule.states[newName] = moduleState

      // fixStateReferences(newModule, stateName, newName);
      // newState[action.data.targetModuleKey] = newModule
      return newState

    case 'COPY_NODE':
      // newState = {...state};
      // let newStateName = action.data.newName;
      // let newModuleCopy = _.cloneDeep(state[action.data.targetModuleKey])
      // let newModuleState = _.cloneDeep(newModuleCopy.states[action.data.targetNode.name]);
      // newModuleState.name = newStateName;

      // /* fix loopback transition case */
      // renameLoopbackTransition(newModuleState, newStateName, action.data.targetNode.name);

      // newModuleCopy.states[newStateName] = newModuleState;
      // newState[action.data.targetModuleKey] = newModuleCopy
      return newState

    case 'EDIT_MODULE_NAME':
      newState = {...state};
      // newState[action.data.targetModuleKey].name = action.data.newName;
      return newState;
    case 'EDIT_MODULE_REMARKS':
      newState = {...state};
      // newState[action.data.targetModuleKey].remarks = [action.data.newRemarks]; // Need to split into rows for readability
      return newState;
    case 'CHANGE_STATE_TYPE':
      newState = {...state};
      // let newType = action.data.newType.type.id;
      // This line is weird because we need to add the new fields, overwrite any shared fields, then overwrite the type fields
      // TODO figure out how to remove unused fields
      // newState[action.data.targetModuleKey].states[action.data.targetNode.name] =
      //   { ...getTemplate(`State.${newType}`),
      //     ..._.pick(newState[action.data.targetModuleKey].states[action.data.targetNode.name], ['direct_transition', 'conditional_transition', 'distributed_transition', 'complex_transition', 'remarks']),
      //     type: getTemplate(`State.${newType}`).type
      //   };
      return newState
    default:
      return state;
  }
}
