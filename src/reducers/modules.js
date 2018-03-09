import _ from 'lodash';

import { StateTemplates, TransitionTemplates, StructureTemplates } from '../templates/Templates';

// returns a full copy of the module with state renamed and all transitions renamed
const renameModuleState = (module, stateName, newName) => {
  let newModule = _.cloneDeep(module)

  let moduleState = newModule.states[stateName]

  if(moduleState === undefined){
    // if we can't find it, then it might be a blank state (Unnamed state)
    // Check in the blank key
    moduleState = newModule.states[""]
    stateName = ""
  }

  if(moduleState === undefined){
    // If we still can't find the state, let's just hop out of here.
    return newModule
  }

  delete newModule.states[stateName];

  moduleState.name = newName
  newModule.states[newName] = moduleState

  Object.keys(newModule.states).map(s => newModule.states[s]).forEach( state => {

    if(state.direct_transition === stateName){
      state.direct_transition = newName
    } else if (state.distributed_transition){
      state.distributed_transition.forEach( transition => {
        if(transition.transition === stateName){
          transition.transition = newName
        }
      })
    } else if (state.conditional_transition){
      state.conditional_transition.forEach( transition => {
        if(transition.transition === stateName){
          transition.transition = newName
        }
        if(transition.condition){
          if(transition.condition.condition_type === 'PriorState' && transition.condition.name === stateName){
            transition.condition.name = newName
          }
        }
      })
    } else if (state.complex_transition){
      state.complex_transition.forEach( transition => {
        if(transition.transition === stateName){
          transition.transition = newName
        }
        if(transition.condition){
          if(transition.condition.condition_type === 'PriorState' && transition.condition.name === stateName){
            transition.condition.name = newName
          }
        }
        if(transition.distributions){
          transition.distributions.forEach( distribution => {
            if(distribution.transition === stateName){
              distribution.transition = newName
            }
          })
        }
      })
    }
    switch(state['type']){
      case 'Encounter':
      case 'MedicationOrder':
      case 'CarePlanStart':
      case 'Procedure':
        if(state.reason === stateName){
          state.reason = newName;
        }
        break;
      case 'ConditionOnset':
      case 'AllergyOnset':
        if(state.target_encounter === stateName){
          state.target_encounter = newName;
        }
        break;
      case 'Death':
      case 'ConditionEnd':
        if(state.condition_onset === stateName){
          state.condition_onset = newName;
        }
        break;
      case 'MedicationEnd':
        if(state.medication_order === stateName){
          state.medication_order = newName;
        }
        break;
      case 'CarePlanEnd':
        if(state.careplan === stateName){
          state.careplan = newName;
        }
        break;
      case 'Guard':
        if(state.allow && state.allow.condition_type === 'PriorState' && state.allow.name === stateName){
          state.allow.name = newName;
        }
        break;
    }
  });

  return newModule
}


const initialState = {};

export default (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case 'NEW_MODULE':
      newState = {...state}
      newState[action.data.key] = action.data.module;
      return newState

    case 'EDIT_NODE':
      let path = action.data.path.join('.');
      let value = Object.values(action.data.update)[0]
      if(typeof value === 'object') {
        value = value.id;
      }
      newState = {...state};
      if(value) {
        value = typeof value === 'string'? value.trim():value;
        if(/^[0-9.\-]+$/.test(value) && parseFloat(value)){
          value = parseFloat(value);
        }
        _.set(newState, path, value);
      }
      else{
        _.unset(newState, path);
        let parent = [...action.data.path].splice(0, action.data.path.length -1).join(".");
        let newVal = _.get(newState, parent);
        if(Array.isArray(newVal)) {
          _.set(newState, parent, newVal.filter(x => x));
        }
      }

      return {...newState}

    case 'ADD_STRUCTURE':
      newState = {...state};
      newState[action.data.currentModuleKey].states = {...newState[action.data.currentModuleKey].states, ...StructureTemplates[action.data.structureName]};
      return newState

    case 'ADD_TRANSITION':
      newState = {...state};

      let transitionMapping = {
        Conditional: 'conditional_transition',
        Distributed: 'distributed_transition',
        Direct: 'direct_transition',
        Complex: 'complex_transition',
      };
      let transitionName = transitionMapping[action.data.transitionType] || 'direct_transition';
      let paths = Object.values(transitionMapping);
      for (var pathIndex in paths) {
        delete newState[action.data.currentModuleKey].states[action.data.nodeName.name][paths[pathIndex]];
      }
      newState[action.data.currentModuleKey].states[action.data.nodeName.name][transitionName] = _.clone(TransitionTemplates[action.data.transitionType]);
      return newState

    case 'ADD_NODE':
      newState = {...state};
      newState[action.data.currentModuleKey].states = {...newState[action.data.currentModuleKey].states, [action.data.stateKey]:action.data.state};
      return {...newState}

    case 'RENAME_NODE':
      newState = {...state};
      newState[action.data.targetModuleKey] = renameModuleState(state[action.data.targetModuleKey], action.data.targetNode.name, action.data.newName.name);
      return newState
    case 'EDIT_MODULE_NAME':
      newState = {...state};
      newState[action.data.targetModuleKey].name = action.data.newName;
      return newState;
    case 'EDIT_MODULE_REMARKS':
      newState = {...state};
      newState[action.data.targetModuleKey].remarks = [action.data.newRemarks]; // Need to split into rows for readability
      return newState;
    case 'CHANGE_STATE_TYPE':
      newState = {...state};
      let newType = action.data.newType.type.id;
      // This line is weird because we need to add the new fields, overwrite any shared fields, then overwrite the type fields
      // TODO figure out how to remove unused fields
      newState[action.data.targetModuleKey].states[action.data.targetNode.name] =
        { ...StateTemplates[newType],
          ..._.pick(newState[action.data.targetModuleKey].states[action.data.targetNode.name], ['direct_transition', 'conditional_transition', 'distributed_transition', 'complex_transition', 'remarks']),
          type: StateTemplates[newType].type
        };
      return newState
    default:
      return state;
  }
}
