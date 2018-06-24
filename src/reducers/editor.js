import _ from 'lodash';
import { getTemplate } from '../templates/Templates';
import { normalizeType, cleanString } from '../utils/stringUtils';

const initialState = {
    selectedStateKey: null, 
    selectedStateTransition: null, 
    selectedModuleKey: null, 
    loadModuleVisible: false, 
    downloadVisible: false,
    selectedModulePanel: 'info',
    modulePanelVisible: true,
    modules: {},
    history: [],
    historyIndex: -1
};

export default (state = initialState, action) => {

  let newState = {...state}

  if(['COPY_NODE', 'ADD_NODE', 'INSERT_NODE', 'ADD_STRUCTURE',
      'EDIT_NODE', 'ADD_TRANSITION', 'RENAME_NODE', 'EDIT_MODULE_NAME',
      'EDIT_MODULE_REMARKS', 'CHANGE_STATE_TYPE'].includes(action.type)){
    // DESCTRUCTIVE EDITS
    
  }

  switch (action.type) {
    case 'SELECT_NODE':
      let selectedModulePanel = state.selectedModulePanel;
      if(action.data.key){
        if(selectedModulePanel === 'info'){
          selectedModulePanel = 'state';
        }
      } else {
        if(selectedModulePanel === 'state'){
          selectedModulePanel = 'info';
        }
      }

      newState = { ...newState, selectedModulePanel, selectedStateKey: action.data.key, selectedStateTransition: action.data.transitionIndex};

      saveHistory(newState);

      return newState;

    case 'COPY_NODE':
      let newStateName = action.data.newName;
      let newModuleCopy = _.cloneDeep(state.modules[action.data.targetModuleKey])
      let newModuleState = _.cloneDeep(newModuleCopy.states[action.data.targetNode.name]);
      newModuleState.name = newStateName;

      /* fix loopback transition case */
      renameLoopbackTransition(newModuleState, newStateName, action.data.targetNode.name);

      newModuleCopy.states[newStateName] = newModuleState;
      newState.modules[action.data.targetModuleKey] = newModuleCopy
      newState.selectedStateKey = action.data.newName;
      newState.selectedStateTransition = null;

      saveHistory(newState);

      return newState

    case 'ADD_NODE':

      newState.modules = {...newState.modules}

      newState.modules[action.data.currentModuleKey].states = {...newState.modules[action.data.currentModuleKey].states, [action.data.stateKey]:action.data.state};
      newState.selectedStateKey = action.data.stateKey;
      newState.selectedModulePanel= 'state';
      newState.selectedStateTransition = null;

      if(action.data.selectedState && typeof action.data.selectedStateTransition === 'number'){
        // We have been instructed to insert into the middle of an existing transition

        let alteredState = _.cloneDeep(newState.modules[action.data.currentModuleKey].states[action.data.selectedState]);

        if(alteredState.direct_transition && action.data.selectedStateTransition === 0 ){
          let oldTransitionPoint = alteredState.direct_transition;
          alteredState.direct_transition = action.data.stateKey;
          newState.modules[action.data.currentModuleKey].states[action.data.stateKey].direct_transition = oldTransitionPoint;
          newState.modules[action.data.currentModuleKey].states[action.data.selectedState] = alteredState;
        } else if(alteredState.distributed_transition){
          let oldTransitionPoint = alteredState.distributed_transition[action.data.selectedStateTransition].transition;
          alteredState.distributed_transition = [...alteredState.distributed_transition]
          alteredState.distributed_transition[action.data.selectedStateTransition] = {...alteredState.distributed_transition[action.data.selectedStateTransition], transition: action.data.stateKey}
          newState.modules[action.data.currentModuleKey].states[action.data.stateKey].direct_transition = oldTransitionPoint;
          newState.modules[action.data.currentModuleKey].states[action.data.selectedState] = alteredState;
        } else if(alteredState.conditional_transition){
          let oldTransitionPoint = alteredState.conditional_transition[action.data.selectedStateTransition].transition;
          alteredState.conditional_transition = [...alteredState.conditional_transition]
          alteredState.conditional_transition[action.data.selectedStateTransition] = {...alteredState.conditional_transition[action.data.selectedStateTransition], transition: action.data.stateKey}
          newState.modules[action.data.currentModuleKey].states[action.data.stateKey].direct_transition = oldTransitionPoint;
          newState.modules[action.data.currentModuleKey].states[action.data.selectedState] = alteredState;

        } else if(alteredState.complex_transition){
          alteredState = {...alteredState, complex_transition: _.cloneDeep(alteredState.complex_transition)};
          let complexTransitions = {}
          let transitionIndex = 0;
          let rightNode = null;
          alteredState.complex_transition.forEach( (t, i) => {

            if(t.transition !== undefined){
              let nodes = t.transition;
              if(complexTransitions[nodes] === undefined){
                complexTransitions[nodes] = true;
                if(transitionIndex === action.data.selectedStateTransition || nodes === rightNode){
                  rightNode = nodes;
                  let oldTransitionPoint = t.transition;
                  t.transition = action.data.stateKey;
                  newState.modules[action.data.currentModuleKey].states[action.data.stateKey].direct_transition = oldTransitionPoint;
                }
                transitionIndex++;
              } else if(nodes === rightNode){
                let oldTransitionPoint = t.transition;
                t.transition = action.data.stateKey;
                newState.modules[action.data.currentModuleKey].states[action.data.stateKey].direct_transition = oldTransitionPoint;
              }
            } else {
              t.distributions.forEach( dist => {
                let nodes = dist.transition;
                if(complexTransitions[nodes] === undefined){
                  complexTransitions[nodes] = true;
                  if(transitionIndex === action.data.selectedStateTransition){
                    rightNode = nodes;
                    let oldTransitionPoint = dist.transition;
                    dist.transition = action.data.stateKey;
                    newState.modules[action.data.currentModuleKey].states[action.data.stateKey].direct_transition = oldTransitionPoint;
                  }
                  transitionIndex++;
                } else if(nodes == rightNode){
                  let oldTransitionPoint = dist.transition;
                  dist.transition = action.data.stateKey;
                  newState.modules[action.data.currentModuleKey].states[action.data.stateKey].direct_transition = oldTransitionPoint;
                }
              })
            }
          })
          newState.modules[action.data.currentModuleKey].states[action.data.selectedState] = alteredState;
        }
      }

      saveHistory(newState);

      return newState;

    case 'INSERT_NODE':

      newState.modules = {...newState.modules}

      newState.modules[action.data.currentModuleKey].states = {...newState.modules[action.data.currentModuleKey].states, [action.data.stateKey]:action.data.state};
      newState.selectedStateKey = action.data.stateKey;
      newState.selectedModulePanel= 'state';
      newState.selectedStateTransition = null;

      saveHistory(newState);

      return {...newState};

    case 'ADD_STRUCTURE':
      newState.modules[action.data.currentModuleKey].states = {...newState.modules[action.data.currentModuleKey].states, ...getTemplate(`Structure.${action.data.structureName}`)};
      newState.selectedStateTransition = null;

      saveHistory(newState);

      return {...newState}

    case 'OPEN_MODULE':
      let selectedModuleKey = state.selectedModuleKey;

      selectedModuleKey = action.data.key
      if(action.data.libraryModule){
        newState.modules = {...newState.modules}
        newState.modules[action.data.key] = _.cloneDeep(action.data.libraryModule)
      }

      newState.history = [];
      newState.historyIndex = 0;
      saveHistory(newState);

      return { ...newState, 
               selectedModuleKey,
               selectedStateKey: null,
               selectedStateTransition: null,
               loadModuleVisible: false,
               selectedModulePanel: 'info',
              };

    case 'NEW_MODULE':
      let newModules = {...state.modules}
      newModules[action.data.key] = action.data.module;

      newState.history = [];
      newState.historyIndex = 0;
      saveHistory(newState);

      return {...newState, modules: {...newModules}, selectedStateKey: null, selectedStateTransition: null, selectedModuleKey: action.data.key}

    case 'EDIT_NODE':
      let path = action.data.path.join('.');
      let value = Object.values(action.data.update)[0]
      if(typeof value === 'object') {
        value = value.id;
      }
      if(value !== null && value !== undefined) {
        _.set(newState.modules, path, normalizeType(value));

        // FIX DEPENDENT THINGS
        let splitPath = []
        if(Array.isArray(path)){
          splitPath = path.join('.').split('.')
        } else {
          splitPath = path.split('.')
        }

        // If change operator on attribute, clean up value if needed
        if(splitPath[splitPath.length-1] === 'operator'){
          const parent = _.get(newState.modules, splitPath.slice(0,-1).join('.'));
          if((parent.operator === 'is nil' || parent.operator === 'is not nil')){
            _.unset(newState.modules, splitPath.slice(0,-1).join('.') + '.value')
          } else {
            if(parent.operator.value === undefined){
              _.set(newState.modules, splitPath.slice(0,-1).join('.') + '.value', 0)
            }
          }
        }
      }
      else{
        _.unset(newState.modules, path);
        let parent = [...action.data.path].splice(0, action.data.path.length -1).join(".");
        let newVal = _.get(newState.modules, parent);
        if(Array.isArray(newVal)) {
          _.set(newState.modules, parent, newVal.filter(x => x));
        }

        // check to see if it is a node deletion, in which case we need to references
        let splitPath = []
        if(Array.isArray(path)){
          splitPath = path.join('.').split('.')
        } else {
          splitPath = path.split('.')
        }

        if(splitPath.length === 3 && splitPath[1] === 'states'){
          let stateName = splitPath[2]
          fixStateReferences(newState.modules[splitPath[0]], stateName, null)
        }

      }

      saveHistory(newState);

      return newState

    case 'ADD_TRANSITION':

      let transitionMapping = {
        Conditional: 'conditional_transition',
        Distributed: 'distributed_transition',
        Direct: 'direct_transition',
        Complex: 'complex_transition',
      };

      let transitionName = transitionMapping[action.data.transitionType];
      let oldTransitionName = null;
      if (action.data.nodeName.transition != null) {
        oldTransitionName = transitionMapping[action.data.nodeName.transition.type];
      }

      let paths = Object.values(transitionMapping);
      for (var pathIndex in paths) {
        delete newState.modules[action.data.currentModuleKey].states[action.data.nodeName.name][paths[pathIndex]];
      }
      newState.modules[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName] = getTemplate(`Transition.${action.data.transitionType}`);

      // Get first of previous transition locations if available
      let transitionTo = null;
      switch(oldTransitionName) {
        case 'direct_transition':
          transitionTo = _.get(action, 'data.nodeName.transition.to', null);
          break;
        case 'distributed_transition':
        case 'conditional_transition':
          transitionTo = _.get(action, 'data.nodeName.transition.transition[0].to', null);
          break;
        case 'complex_transition':
          transitionTo = _.get(action, 'data.nodeName.transition.transition[0].distributions[0].to', null);
          break;
      }

      // Provide previous transition location to new if available
      if (transitionTo !== null) {
        switch(transitionName) {
          case 'direct_transition':
            newState.modules[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName] = transitionTo;
            break;
          case 'distributed_transition':
          case 'conditional_transition':
            newState.modules[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName][0].transition = transitionTo;
            break;
          case 'complex_transition':
            newState.modules[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName][0].distributions[0].transition = transitionTo;
            break;
        }
      }

      saveHistory(newState);

      return newState

    case 'RENAME_NODE':

      let stateName = action.data.targetNode.name;
      let newName = action.data.newName.name;
      let newModule = _.cloneDeep(state.modules[action.data.targetModuleKey])
      let moduleState = newModule.states[stateName]


      if(moduleState === undefined){
        // if we can't find it, then it might be a blank state (Unnamed state)
        // Check in the blank key
        moduleState = newModule.states[""]
        stateName = ""
      }

      if(moduleState === undefined){
        // If we still can't find the state, let's just hop out of here.
        return newState;
      }

      delete newModule.states[stateName];

      moduleState.name = newName
      newModule.states[newName] = moduleState

      fixStateReferences(newModule, stateName, newName);
      newState.modules[action.data.targetModuleKey] = newModule;
      newState.selectedStateKey = action.data.newName.name;

      saveHistory(newState);

      return newState

    case 'EDIT_MODULE_NAME':
      newState.modules[action.data.targetModuleKey].name = action.data.newName;

      saveHistory(newState);

      return newState;

    case 'EDIT_MODULE_REMARKS':
      newState.modules[action.data.targetModuleKey].remarks = [action.data.newRemarks]; // Need to split into rows for readability

      saveHistory(newState);

      return newState;

    case 'CHANGE_STATE_TYPE':
      let newType = action.data.newType.type.id;
      // This line is weird because we need to add the new fields, overwrite any shared fields, then overwrite the type fields
      // TODO figure out how to remove unused fields
      newState.modules[action.data.targetModuleKey].states[action.data.targetNode.name] =
        { ...getTemplate(`State.${newType}`),
          ..._.pick(newState.modules[action.data.targetModuleKey].states[action.data.targetNode.name], ['direct_transition', 'conditional_transition', 'distributed_transition', 'complex_transition', 'remarks']),
          type: getTemplate(`State.${newType}`).type
        };

      saveHistory(newState);

      return newState

    case 'LOAD_JSON':

      newState.history = []
      newState.historyIndex = 0;
      saveHistory(newState);

      return { ...newState, selectedModuleKey: action.data.selectedModuleKey, selectedStateTransition: null};

    case 'SHOW_LOAD_MODULE':
      return { ...newState, loadModuleVisible: true};

    case 'HIDE_LOAD_MODULE':
      return { ...newState, loadModuleVisible: false};
          
    case 'SHOW_DOWNLOAD':
      return { ...newState, downloadVisible: true};

    case 'HIDE_DOWNLOAD':
      return { ...newState, downloadVisible: false};

    case 'CHANGE_MODULE_PANEL':
      return { ...newState, selectedModulePanel: action.data.targetPanel, modulePanelVisible: action.data.targetPanel !== 'hide'};

    case 'UNDO':
      if(newState.history.length > newState.historyIndex + 1){
        newState.historyIndex++;
        newState.modules = {...newState.modules}
        newState.modules[newState.selectedModuleKey] = _.cloneDeep(newState.history[newState.historyIndex].module);
        newState.selectedStateKey = newState.history[newState.historyIndex].selectedStateKey;
        newState.selectedStateTransition = newState.history[newState.historyIndex].selectedStateTransition;
      }
      return {...newState}

    case 'REDO':
      if(newState.historyIndex > 0){
        newState.historyIndex--;
        newState.modules = {...newState.modules}
        newState.modules[newState.selectedModuleKey] = _.cloneDeep(newState.history[newState.historyIndex].module);
        newState.selectedStateKey = newState.history[newState.historyIndex].selectedStateKey;
        newState.selectedStateTransition = newState.history[newState.historyIndex].selectedStateTransition;
      }
      return {...newState}

    default:
      return newState;

  }
}

// updates the module in-place with fixed state refences
// if newName is null, then delete all references instead
const fixStateReferences = (module, stateName, newName) => {

  Object.keys(module.states).map(s => module.states[s]).forEach( state => {

    if(state.direct_transition === stateName){
      if(newName === null){
        delete state.direct_transition
      } else {
        state.direct_transition = newName
      }

    } else if (state.distributed_transition){
      state.distributed_transition.forEach( transition => {
        if(transition.transition === stateName){
          if(newName === null){
            delete transition.transition
          } else {
            transition.transition = newName
          }
        }
      })
    } else if (state.conditional_transition){
      state.conditional_transition.forEach( transition => {
        if(transition.transition === stateName){
          if(newName === null){
            delete transition.transition
          } else {
            transition.transition = newName
          }
        }
        if(transition.condition){
          if(transition.condition.condition_type === 'PriorState' && transition.condition.name === stateName){
            if(newName === null){
              delete transition.condition.name
            } else {
              transition.condition.name = newName
            }
          }
        }
      })
    } else if (state.complex_transition){
      state.complex_transition.forEach( transition => {
        if(transition.transition === stateName){
          if(newName === null){
            delete transition.transition
          } else {
            transition.transition = newName
          }
        }
        if(transition.condition){
          if(transition.condition.condition_type === 'PriorState' && transition.condition.name === stateName){
            if(newName === null) {
              delete transition.condition.name
            } else {
              transition.condition.name = newName
            }
          }
        }
        if(transition.distributions){
          transition.distributions.forEach( distribution => {
            if(distribution.transition === stateName){
              if(newName === null){
                delete distribution.transition
              } else {
                distribution.transition = newName
              }
            }
          })
        }
      })
    }
    if(state.reason === stateName){
      if(newName === null){
        delete state.reason
      } else {
        state.reason = newName;
      }
    }
    if(state.target_encounter === stateName){
      if(newName === null){
        state.target_encounter = "" // this is a requried field
      } else {
        state.target_encounter = newName;
      }
    }
    if(state.condition_onset === stateName){
      if(newName === null){
        delete state.condition_onset
      } else {
        state.condition_onset = newName;
      }
    }
    if(state.allergy_onset === stateName){
      if(newName === null){
        delete state.allergy_onset
      } else {
        state.allergy_onset = newName;
      }
    }
    if(state.medication_order === stateName){
      if(newName === null){
        delete state.medication_order
      } else {
        state.medication_order = newName;
      }
    }
    if(state.careplan === stateName){
      if(newName === null){
        delete state.careplan;
      } else {
        state.careplan = newName;
      }
    }
    if(state.allow && state.allow.condition_type === 'PriorState' && state.allow.name === stateName){
      if(newName === null){
        delete state.allow.name
      } else {
        state.allow.name = newName;
      }
    }
  });
}

const saveHistory = (state) => {
  let selectedStateKey = state.selectedStateKey;
  let selectedStateTransition = state.selectedStateTransition;

  if(state.historyIndex > 0){
    while(state.historyIndex > 0 && state.history.length > 0){
      state.historyIndex--;
      state.history.shift()
    }

    state.historyIndex = 0; // should always be 0 anyhow

  }

  state.history = [{selectedStateKey, selectedStateTransition, module: _.cloneDeep(state.modules[state.selectedModuleKey])}].concat(state.history);

  state.history.splice(20) // only save the last 20 changes
}

// When nodes are cloned, loopback transitions point to node being cloned, instead of new copy
const renameLoopbackTransition = (state, newStateName, oldStateName) => {
  if(state.direct_transition === oldStateName){
    state.direct_transition = newStateName;
  } else if (state.distributed_transition){
    state.distributed_transition.forEach( transition => {
      if(transition.transition === oldStateName){
        transition.transition = newStateName
      }
    })
  } else if (state.conditional_transition){
    state.conditional_transition.forEach( transition => {
      if(transition.transition === oldStateName){
        transition.transition = newStateName
      }
    })
  } else if (state.complex_transition){
    state.complex_transition.forEach( transition => {
      if(transition.transition === oldStateName){
        transition.transition = newStateName
      }
      if(transition.distributions){
        transition.distributions.forEach( distribution => {
          if(distribution.transition === oldStateName){
            distribution.transition = newStateName
          }
        })
      }
    })
  }
}

