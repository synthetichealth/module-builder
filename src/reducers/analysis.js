import _ from 'lodash'
import { getTemplate } from '../templates/Templates'
import Papa from 'papaparse'
import { isNumber } from 'util';
import { stat } from 'fs';

const initialState = {
  libraryModuleCodes: {}, // list types of nodes
  warnings: [],
  libraryRelatedModules: {},
  relatedModules: [],
  attributes: []
};

export const CURRENT_GMF_VERSION = 2.0;

const attributes = module => {
  const attributes = [];
  Object.keys(module.states).forEach(stateName => {
    let state = module.states[stateName];

     if(state.type === 'SetAttribute'){
       attributes.push({attribute: state.attribute, stateName: state.name, stateType: state.type});
     } else if(state.assign_to_attribute){
       attributes.push({attribute: state.assign_to_attribute, stateName: state.name, stateType: state.type});
     }
  });

  return attributes.sort(function(a, b){
    var x = a.attribute.toLowerCase();
    var y = b.attribute.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  })
}

const templateCodes = {};
Object.keys(getTemplate('Type').Code).map(c => getTemplate('Type').Code[c]).forEach(code => {
  templateCodes[`${code.code}-${code.system}-${code.display}`] = true;
});

const placeholderCodeWarnings = (module) => {
  const warnings = [];
  Object.keys(module.states).forEach(stateName => {
    let state = module.states[stateName];
    state.codes && state.codes.forEach(code => {
      if(templateCodes[`${code.code}-${code.system}-${code.display}`]){
        warnings.push({stateName: stateName, message: 'Code uses an invalid template code: ' + code.system + '[' + code.code + ']'});
      }
    });

    switch(state.type){
      case 'MultiObservation':
      case 'DiagnosticReport':
        if(state.observations){
          state.observations.forEach(o => {
          o.codes && o.codes.forEach(code => {
            if(templateCodes[`${code.code}-${code.system}-${code.display}`]){
              warnings.push({stateName: stateName, message: 'Code in observation uses an invalid template code: ' + code.system + '[' + code.code + ']'});
            }
          })
        })}

        break;
      case 'ImagingStudy':
        if(state.procedure_code){
            if(templateCodes[`${state.procedure_code.code}-${state.procedure_code.system}-${state.procedure_code.display}`]){
              warnings.push({stateName: stateName, message: 'Code in procedure code uses an invalid template code: ' + state.procedure_code.system + '[' + state.procedure_code.code + ']'});
            }
        }
        if(state.series ){
          state.series.forEach(series => {
            if(series.body_site){
              if(templateCodes[`${series.body_site.code}-${series.body_site.system}-${series.body_site.display}`]){
                warnings.push({stateName: stateName, message: 'Code in imaging series uses an invalid template code: ' + series.body_site.system + '[' + series.body_site.code + ']'});
              }
            }
            if(series.modality){
              if(templateCodes[`${series.modality.code}-${series.modality.system}-${series.modality.display}`]){
                warnings.push({stateName: stateName, message: 'Code in imaging series uses an invalid template code: ' + series.modality.system + '[' + series.modality.code + ']'});
              }
            }
            if(series.instances){
              series.instances.forEach(instance => {
                if(instance.sop_class){
                  if(templateCodes[`${instance.sop_class.code}-${instance.sop_class.system}-${instance.sop_class.display}`]){
                    warnings.push({stateName: stateName, message: 'Code in imaging series uses an invalid template code: ' + instance.sop_class.system + '[' + instance.sop_class.code + ']'});
                  }
                }
              })
            }

          })

        }
        break;
      default:
        break;


    }
  })
  return warnings;

}

const tableTransitionWarnings = (module) => {

  const warnings = [];

  Object.keys(module.states).forEach(stateName => {
    let state = module.states[stateName];

    // find table transitions and check table data
    if (state.lookup_table_transition !== undefined){
      let message = '';
      if(state.lookup_table_transition.lookup_table_name_ModuleBuilder === ""){
        message = 'Invalid filename ';
      }
      if (state.lookup_table_transition.lookuptable === "Enter table" || tableHasError(state.lookup_table_transition.lookuptable) ) {
        if (message === ''){
          message = 'Invalid data ';
        } else {
          message += 'and invalid data '
        }
      }
      // check the last X columns vs X transitions
      if (!tableHasError(state.lookup_table_transition.lookuptable)){
        let tableColumns = [];
        let data = parseLookupTable(state.lookup_table_transition.lookuptable);
        if (data.length > 0){
          tableColumns = Object.keys(data[0]);
        }

        for (let i = 0; i < state.lookup_table_transition.transitions.length; i++)
        {
          let transition = state.lookup_table_transition.transitions[state.lookup_table_transition.transitions.length - i - 1].transition;
          let column = tableColumns[tableColumns.length-i -1];
          if (transition != column)
          {
            if (message === '')
            {
              message += 'Invalid columns (table data and transitions to state don\'t match) '
            } else {
              message += ' and invalid columns (table data and transitions to states don\'t match) '
            }
            break;
          }
        }
      }

      if (message !== ''){
        message += 'for table in ';
        warnings.push({stateName, message: message + stateName + '. '});
      }
    }
  });

  return warnings;
}

const parseLookupTable = (data) => {
  let parsed;
  if (isNumber(data))
  {
    data  = data.toString();
  }
  Papa.parse(data, {
  header: true,
  complete: function(results) {
    parsed=results;
  }
  });

  return parsed.data;
}

const tableHasError = (lookuptable) =>{
  let data = parseLookupTable(lookuptable);
  let textOk = !(lookuptable == 'Enter table' || lookuptable == '')
  let parseOk = (data.length > 0 && Object.keys(data[0]).length > 0)
 if (textOk && parseOk ){
    return false;
  } else {
    return true;
  }
}

const gmfVersionWarnings = (module) => {
  if(module.gmf_version === undefined || module.gmf_version < CURRENT_GMF_VERSION) {
    return [{stateName: 'None', message: 'Module is using an older or undeclared version of GMF'}];
  } else {
    return [];
  }
}

const telemedicineWarnings = (module) => {
  const warnings = [];

  Object.keys(module.states).forEach(stateName => {
    let state = module.states[stateName];
    if (state.type == 'Encounter') {
      if ((state.telemedicine_possibility == 'possible' || state.telemedicine_possibility == 'always') &&
         (! ['virtual', 'ambulatory'].includes(state.encounter_class))) {
        warnings.push({stateName, message: 'Encounter class implies in-person services required, but telemedicine possibility is not "none"'});
      }
      if (state.encounter_class == 'virtual' && state.telemedicine_possibility != 'always') {
        warnings.push({stateName, message: 'Encounter class is for telehealth, but telemedicine possibility is not "always"'});
      }
    }
  });

  return warnings;
}

const stateCollisionWarnings = (module, globalCodes) => {
  const equivalentStates = [
   ['MedicationOrder', 'MedicationEnd'],
   ['ConditionOnset', 'ConditionEnd'],
   ['CarePlanStart', 'CarePlanEnd'],
   ['AllergyOnset', 'AllergyEnd'],
  ];

  const isEquivalentStates = (first, second) => {
    return (first === second || equivalentStates.filter(e => (e[0] === first && e[1] === second) || (e[0] === second && e[1] === first)).length > 0)
  }

  const checkCollision = libraryState =>  (local => !isEquivalentStates(local.state.type, libraryState.type) && local.state.type !== 'Death' && libraryState.type !== 'Death');

  const warnings = [];
  Object.keys(module.states).forEach(stateName => {
    let state = module.states[stateName];
    state.codes && state.codes.forEach(code => {

      if(globalCodes[code.code]){
        let collisions = globalCodes[code.code].filter(checkCollision(state));
        if(collisions.length > 0){
          warnings.push({stateName, message: 'Code collision with state ' + collisions[0].stateName + ' in module ' + collisions[0].moduleKey + '. '});
        }
      }
    });
  });

  return warnings;

}

const orphanStateWarnings = (module) => {
  const warnings = [];

  const visitedStateCheck = Object.keys(module.states).reduce( (acc, value) => {acc[value] = false; return acc}, {})

  const visitNext = [];

  if(module.states['Initial']){
    visitNext.push('Initial');
  };

  while(visitNext.length > 0){
    let nextStateKey = visitNext.pop();
    let nextState = module.states[nextStateKey];
    visitedStateCheck[nextStateKey] = true;

    if(nextState.direct_transition){
      if(!module.states[nextState.direct_transition]){
        warnings.push({stateName: nextStateKey, message: 'Transition to state that does not exist: ' + nextState.direct_transition});
      } else {
        if(!visitedStateCheck[nextState.direct_transition]){
          visitNext.push(nextState.direct_transition);
        }
      }
    } else if(nextState.distributed_transition){
      nextState.distributed_transition.forEach(transition => {
        if(!module.states[transition.transition]){
          warnings.push({stateName: nextStateKey, message: 'Transition to state that does not exist: ' + transition.transition});
        } else {
          if(!visitedStateCheck[transition.transition]){
            visitNext.push(transition.transition);
          }
        }
      });
    } else if(nextState.type_of_care_transition){
      ['ambulatory', 'emergency', 'telemedicine'].forEach(careType => {
        if(!module.states[nextState.type_of_care_transition[careType]]){
          warnings.push({stateName: nextStateKey, message: 'Transition to state that does not exist: ' + nextState.type_of_care_transition[careType]});
        } else {
          if(!visitedStateCheck[nextState.type_of_care_transition[careType]]){
            visitNext.push(nextState.type_of_care_transition[careType]);
          }
        }
      });
    } else if(nextState.lookup_table_transition){
      nextState.lookup_table_transition.transitions.forEach(transition => {
        if(!module.states[transition.transition]){
          warnings.push({stateName: nextStateKey, message: 'Transition to state that does not exist: ' + transition.transition});
        } else {
          if(!visitedStateCheck[transition.transition]){
            visitNext.push(transition.transition);
          }
        }
      });
    }
    else if(nextState.conditional_transition){
      nextState.conditional_transition.forEach(transition => {
        if(!module.states[transition.transition]){
          warnings.push({stateName: nextStateKey, message: 'Transition to state that does not exist: ' + transition.transition});
        } else {
          if(!visitedStateCheck[transition.transition]){
            visitNext.push(transition.transition);
          }
        }
      });
    } else if (nextState.complex_transition){
      nextState.complex_transition.forEach( transition => {
        if(transition.transition){
          if(!module.states[transition.transition]){
            warnings.push({stateName: nextStateKey, message: 'Transition to state that does not exist: ' + transition.transition});
          } else {
            if(!visitedStateCheck[transition.transition]){
              visitNext.push(transition.transition);
            }
          }
        }
        if(transition.distributions){
          transition.distributions.forEach( distribution => {
            if(!module.states[distribution.transition]){
              warnings.push({stateName: nextStateKey, message: 'Transition to state that does not exist: ' + distribution.transition});
            } else {
              if(!visitedStateCheck[distribution.transition]){
                visitNext.push(distribution.transition);
              }
            }
          })
        }
      })
    }
  }

  let notVisitedWarnings = Object.keys(visitedStateCheck).map(s => {return {state: s, visited: visitedStateCheck[s]}}).filter(v => !v.visited).map(v => {
    return {
      stateName: v.state,
      message: 'State cannot be reached.'
    };
  });

  return [...warnings, ...notVisitedWarnings];

}


const GROUPED_CONDITION_TYPES = ['And', 'Or', 'At Least', 'At Most', 'Not'];

/**
 * Look for "And", "At Least", "At Most", "Or" type conditionals
 * and make sure the numbers make sense.
 */
const groupedConditionalWarnings = (module) => {
  debugger;
  const warnings = [];
  Object.keys(module.states).forEach(stateName => {
    const state = module.states[stateName];

    if (state.type == 'Guard') {
      if (GROUPED_CONDITION_TYPES.includes(state.allow.condition_type)) {
        const message = checkGroupedCondition(state.allow);
        if (message) {
          warnings.push({stateName, message});
        }
      }
    }

    if (state.conditional_transition) {
      state.conditional_transition.forEach(transition => {
        if (transition.condition && GROUPED_CONDITION_TYPES.includes(transition.condition.condition_type)) {
          const message = checkGroupedCondition(transition.condition);
          if (message) {
            warnings.push({stateName, message});
          }
        }
      });
    } else if (state.complex_transition) {
      state.complex_transition.forEach(transition => {
        if (transition.condition && GROUPED_CONDITION_TYPES.includes(transition.condition.condition_type)) {
          const message = checkGroupedCondition(transition.condition);
          if (message) {
            warnings.push({stateName, message});
          }
        }
      });
    }
  });
  return warnings;
}

const checkGroupedCondition = (condition) => {
  switch(condition.condition_type) {
  case 'And':
    if (condition.conditions.length < 2) {
      return "'And' condition should have at minimum 2 sub-conditions";
    } else {
      for (const subcondition of condition.conditions) {
        if (GROUPED_CONDITION_TYPES.includes(subcondition.condition_type)) {
          const message = checkGroupedCondition(subcondition);
          if (message) {
            return message;
          }
        }
      } 
    }
    break;
  case 'Or':
    if (condition.conditions.length < 2) {
      return "'Or' condition should have at minimum 2 sub-conditions";
    } else {
      for (const subcondition of condition.conditions) {
        if (GROUPED_CONDITION_TYPES.includes(subcondition.condition_type)) {
          const message = checkGroupedCondition(subcondition);
          if (message) {
            return message;
          }
        }
      } 
    }
    break;
  case 'At Least':
    if (condition.conditions.length <= condition.minimum) {
      return "'At Least' condition should have more sub-conditions than the selected minimum";
    } else {
      for (const subcondition of condition.conditions) {
        if (GROUPED_CONDITION_TYPES.includes(subcondition.condition_type)) {
          const message = checkGroupedCondition(subcondition);
          if (message) {
            return message;
          }
        }
      } 
    }
    break;
  case 'At Most':
    if (condition.conditions.length <= condition.maximum) {
      return "'At Most' condition should have more sub-conditions than the selected maximum";
    } else {
      for (const subcondition of condition.conditions) {
        if (GROUPED_CONDITION_TYPES.includes(subcondition.condition_type)) {
          const message = checkGroupedCondition(subcondition);
          if (message) {
            return message;
          }
        }
      } 
    }
    break;
  case 'Not':
    if (GROUPED_CONDITION_TYPES.includes(condition.condition.condition_type)) {
      return checkGroupedCondition(condition.condition);
    }
    break;
  }
}

const libraryModuleCodes = (modules) => {
    const libraryModuleCodes = {};

    Object.keys(modules).forEach(moduleKey => {
      const module = modules[moduleKey];
      Object.keys(module.states).forEach(stateName => {
        const moduleState = module.states[stateName];
        moduleState.codes && moduleState.codes.forEach(code => {
          if(!libraryModuleCodes[code.code]){
            libraryModuleCodes[code.code] = []
          }
          libraryModuleCodes[code.code].push({...code, moduleKey, stateName, state: moduleState});
        });
      });
    });
    return libraryModuleCodes;
}

const libraryRelatedModules = (modules) => {
  const libraryRelatedModules = {};

  Object.keys(modules).forEach(moduleKey => {
    const module = modules[moduleKey];
    Object.keys(module.states).forEach(stateName => {
      const moduleState = module.states[stateName];
      if(moduleState.type === 'CallSubmodule'){
        libraryRelatedModules[moduleKey] = libraryRelatedModules[stateName] || []
        libraryRelatedModules[moduleKey].push({type: 'submodule', moduleKey: moduleState.submodule, stateName})

        libraryRelatedModules[moduleState.submodule] = libraryRelatedModules[moduleState.submodule] || []
        libraryRelatedModules[moduleState.submodule].push({type: 'submodule', moduleKey, stateName})
      }
    });
  });
  return libraryRelatedModules;

}

const relatedBySubmodule = (moduleKey, module, relatedMap) => {
  let related = [];

  if(relatedMap[moduleKey]){
    related = _.cloneDeep(relatedMap[moduleKey]);
  }

  Object.keys(module.states).forEach(stateName => {
    const moduleState = module.states[stateName];
     if(moduleState.type === 'CallSubmodule'){
       related.push({type: 'submodule', module: moduleState.submodule, stateName});
     }
  });

  return related;
}

export default (state = initialState, action) => {
  let newState = {...state};
  switch (action.type) {
    case 'ANALYZE':

      newState.warnings = [...stateCollisionWarnings(action.data.module, newState.libraryModuleCodes),
                           ...orphanStateWarnings(action.data.module),
                           ...placeholderCodeWarnings(action.data.module),
                           ...tableTransitionWarnings(action.data.module),
                           ...gmfVersionWarnings(action.data.module),
                           ...groupedConditionalWarnings(action.data.module),
                           ...telemedicineWarnings(action.data.module)
                          ];

      newState.relatedModules = [...relatedBySubmodule(action.data.moduleKey, action.data.module, newState.libraryRelatedModules)];

      newState.attributes = attributes(action.data.module);

      return newState;

    case 'LOAD_LIBRARY':

      newState.libraryModuleCodes = libraryModuleCodes(action.data);
      newState.libraryRelatedModules = libraryRelatedModules(action.data);

      return newState

    default:
      return state;
  }
}
