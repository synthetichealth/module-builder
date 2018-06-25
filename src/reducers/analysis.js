import _ from 'lodash'

const initialState = {
  moduleCodes: {}, // list types of nodes
  warnings: []
};

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
    } else if(nextState.conditional_transition){
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

const libraryModuleCodes = (modules) => {
    const moduleCodes = {};

    Object.keys(modules).forEach(moduleKey => {
      const module = modules[moduleKey];
      Object.keys(module.states).forEach(stateName => {
        const moduleState = module.states[stateName];
        moduleState.codes && moduleState.codes.forEach(code => {
          if(!moduleCodes[code.code]){
            moduleCodes[code.code] = []
          }
          moduleCodes[code.code].push({...code, moduleKey, stateName, state: moduleState});
        });
      });
    });


    return moduleCodes;
}

export default (state = initialState, action) => {
  let newState = {...state};
  switch (action.type) {
    case 'ANALYZE':

      newState.warnings = []
      newState.warnings = [...newState.warnings, ...stateCollisionWarnings(action.data.module, newState.moduleCodes)];
      newState.warnings = [...newState.warnings, ...orphanStateWarnings(action.data.module)];

      return newState;

    case 'LOAD_LIBRARY':

      newState.moduleCodes = libraryModuleCodes(action.data);
      return newState

    default:
      return state;
  }
}
