// @flow
import type { Module } from './types/Module';
import type { State } from './types/State';

const STANDARD_COLOR = 'Black';
/*
const HIGHLIGHT_COLOR = '#007bff';
const MUTED_COLOR = '#CCCCCC'
*/

export default function generateDOT(module: Module, selectedState: State) {

  let relatedStates = {};

  if(selectedState) {
    Object.keys(module.states).forEach( key => {
      let state = module.states[key];

      let allTransitions = findTransitions(module.states[key])

      if(allTransitions[selectedState.name]){
        relatedStates[state.name] = true;
      }

    });

    relatedStates = Object.assign({}, relatedStates, findTransitions(module.states[selectedState.name]))

  }

  let output =  ['digraph G {',
          nodesAsDOT(module, selectedState, relatedStates),
          transitionsAsDOT(module, selectedState),
         '}'
         ].join('\n');

  return output;

}

const nodesAsDOT = (module: Module, selectedState: State, relatedStates: mixed) => { 

  return Object.keys(module.states).map( name => {
  
    let state = module.states[name]
    state['name'] = name

    let node = {
      id: 'node_' + name.replace('?', ''),
      shape: 'record', 
      style: 'rounded,filled', 
      fillcolor: 'White', 
      fontcolor: STANDARD_COLOR
    }

    if(state['type'] === 'Initial' || state['type'] === 'Terminal'){
        node['fillcolor'] = 'Grey'
        node['style'] = 'rounded,filled'
        node['fontcolor'] = 'White'
    }

    if(selectedState && state.name === selectedState.name){
      node['fillcolor'] = 'White'
      node['class'] = 'node-highlighted'
    } else if (selectedState && !relatedStates[state.name]){
      node['class'] = 'node-muted'
    }

    let details = stateDescription(state)
    if(details.length === 0){
      node['label'] = (name === state['type']) ? state['name'] : `{ ${name} | ${state['type']} }`
    } else {
      node['label'] = `{ ${name} | { ${state['type']} | ${details} } }`
    }

    let params = Object.keys(node).map((key) => `${key} = "${node[key]}"`).join(", ");

    return `"${name}" [${params};]`
    
  }).join("\n");

}

const transitionsAsDOT = (module: Module, selectedState: State) => { 

  return Object.keys(module.states).map( name => {

    let state = module.states[name]

    let className='';

    if(!!selectedState){
      className = 'transition-muted'
    }

    if(selectedState && selectedState.name === name){
      className='transition-highlighted'
    }

    if(state.direct_transition !== undefined){
      if(selectedState && state.direct_transition === selectedState.name && selectedState.name !== name){
        className='';
      }
      if(module.states[state.direct_transition]){
        return `  "${name}" -> "${module.states[state.direct_transition].name}" [class = "transition ${className}"];\n`
      } else {
        console.log(`NO SUCH NODE TO TRANSITION TO: ${state.direct_transition} FROM ${name}`);
      }
    } else if(state.distributed_transition !== undefined){
      let out_transitions = ''
      state.distributed_transition.forEach( t => {
        let transitionClassName = className
        let distLabel = ''
        if(typeof t.distribution === 'object'){
          distLabel = `p(${t.distribution.attribute})`
          if(t.distribution.default){
            let pct = t.distribution.default * 100
            distLabel += `, default ${pct}%`
          }
        } else {
          let pct = t.distribution * 100
          distLabel = `${pct}%`
        }
        if(module.states[t.transition]){
          if(selectedState && t.transition === selectedState.name && selectedState.name !== name){
            transitionClassName = '';
          }
          out_transitions += `  "${name}" -> "${module.states[t.transition].name}" [label = "${distLabel}", class = "transition ${transitionClassName}"];\n`
        } else {
          console.log(`NO SUCH NODE TO TRANSITION TO: ${t.transition} FROM ${name}`);
        }
      })
      return out_transitions
    } else if (state.conditional_transition !== undefined){
      let out_transitions = ''
      state.conditional_transition.forEach( (t, i ) => {
        let transitionClassName = className
        let cnd = t.condition !== undefined ? logicDetails(t.condition) : 'else';
        if(module.states[t.transition]){
          if(selectedState && t.transition === selectedState.name){
            transitionClassName = ''
          }
          out_transitions += `  "${name}" -> "${module.states[t.transition].name}" [label = "${i+1}. ${cnd}", class = "transition ${transitionClassName}"];\n`
        } else {
          console.log(`NO SUCH NODE TO TRANSITION TO: ${t.transition} FROM ${name}\n`);
        }
      })
     return out_transitions

    } else if (state.complex_transition !== undefined){
      let transitions = {}
      let nodeHighlighted = {}
      state.complex_transition.forEach( t => {
        let cnd = t.condition !== undefined ? logicDetails(t['condition']) : 'else'
        if(t.transition !== undefined){
          if(module.states[t.transition]){
            let nodes = `  "${name}" -> "${t.transition}"`
            if(selectedState && t.transition === selectedState.name){
              nodeHighlighted[nodes] = 'standard'
            }
            if(selectedState && name === selectedState.name){
              nodeHighlighted[nodes] = 'highlighted'
            }
            if(transitions[nodes] === undefined){
              transitions[nodes] = [];
            }
            transitions[nodes].push(cnd)
          } else {
            console.log(`NO SUCH NODE TO TRANSITION TO: ${t.transition} FROM ${name}`);
          }
        } else {
          t.distributions.forEach( dist => {
            if(module.states[dist.transition]){
              let pct = dist.distribution * 100
              let nodes = `  "${name}" -> "${dist.transition}"`
              if(selectedState && dist.transition === selectedState.name){
                nodeHighlighted[nodes] = 'standard'
              }
              if(selectedState && name === selectedState.name){
                nodeHighlighted[nodes] = 'highlighted'
              }
              if(transitions[nodes] === undefined){
                transitions[nodes] = [];
              }
              transitions[nodes].push(`${cnd}: ${pct}%`)
            } else {
              console.log(`NO SUCH NODE TO TRANSITION TO: ${dist.transition} FROM ${name}`);
            }
          })
        }
      })

      let out_transitions = ''
      Object.keys(transitions).forEach( trans => {
        let transitionClassName = className
        if(nodeHighlighted[trans] === 'standard'){
          transitionClassName = ''
        } else if(nodeHighlighted[trans] === 'highlighted'){
          transitionClassName='transition-highlighted'
        }
        out_transitions += `${trans} [label = "${transitions[trans].join(',\\n')}", class = "transition ${transitionClassName}"]\n`
      })

      return out_transitions;

    }

    return ''

  }).join('')

}

const stateDescription = (state) =>{

  let details = ''

  switch(state['type']){
    case 'Initial':
    case 'Terminal':
      details = ''
      break;
    case 'Guard':
      details = "Allow if " + logicDetails(state['allow'])
      break;

    case 'Delay':
    case 'Death':
      if(state['range'] !== undefined){
        let r = state['range']
        details = `${r['low']} - ${r['high']} ${r['unit']}`
      } else if (state['exact'] !== undefined) {
        let e = state['exact']
        details = `${e['quantity']} ${e['unit']}`
      }
      break;
    case 'Encounter':
      if(state['wellness']){
        details = 'Wait for regularly scheduled wellness encounter'
      }
      break;
    case 'EncounterEnd':
      details = 'End the current encounter'
      if(state['discharge_disposition']){
       let code = state['discharge_disposition']
       details += `\\lDischarge Disposition: [${code['code']}] ${code['display']}`
      }
      break;
    case 'SetAttribute':
      let v = state['value']
      details = `Set '${state["attribute"]}' = ${!v ? 'nil' : v}`
      break;
    case 'Symptom':
      let s = state['symptom']
      if(state.range !== undefined){
        let r = state['range']
        details = `${s}: ${r['low']} - ${r['high']}`
      } else if (state.exact !== undefined) {
        let e = state['exact']
        details = `${s}: ${e['quantity']}`
      }
      break;
    case 'Observation':
      let unit = state['unit']
      if(unit){
        unit = "in " + unit.replace('{','(').replace('}',')')
      }

      if(state.vital_sign !== undefined) {
        details = `Record value from Vital Sign '${state["vital_sign"]}' ${unit}\\l`
      } else if (state.attribute !== undefined) {
        details = `Record value from Attribute '${state["attribute"]}' ${unit}\\l`
      }
      break;

    case 'Counter':
      details = `${state['action']} value of attribute '${state["attribute"]}' by 1`
      break;
    case 'VitalSign':
      let vs = state['vital_sign']
      let unitv = state['unit']
      if(state.range !== undefined){
        let r = state['range']
        details = `Set ${vs}: ${r['low']} - ${r['high']} ${unitv}`
      } else if (state.exact !== undefined) {
        let e = state['exact']
        details = `Set ${vs}: ${e['quantity']} ${unitv}`
      }
      break;
    case 'CallSubmodule':
      details = `Call submodule '${state['submodule']}'`
      break;
    case 'MultiObservation':
    case 'DiagnosticReport':
      details = `Group the last ${state['number_of_observations']} Observations\\l`
      break;
    default:
      break;

  }

  if(state.codes !== undefined){
    state['codes'].forEach( code => {
      details = details + code['system'] + "[" + code['code'] + "]: " + code['display'] + "\\l"
    })
  }

  if(state.target_encounter !== undefined){
   let verb = 'Perform'

    switch(state['type']){
      case 'ConditionOnset':
      case 'AllergyOnset':
        verb = 'Diagnose'
        break;
      case 'MedicationOrder':
        verb = 'Prescribe'
        break;
      default:
        break;
    }

    details = details + verb + " at " + state['target_encounter'] + "\\l"
  }

  if(state.reason){
    details = details + `Reason: ${state['reason']}\\l`
  }
  if(state.medication_order){
    details = details + `Prescribed at: ${state['medication_order']}\\l`
  }
  if(state.condition_onset){
    details = details + `Onset at: ${state['condition_onset']}\\l`
  }
  if(state.allergy_onset){
    details = details + `Onset at: ${state['allergy_onset']}\\l`
  }
  if(state.careplan){
    details = details + `Prescribed at: ${state['careplan']}\\l`
  }
  if(state.assign_to_attribute){
    details = details + `Assign to Attribute: '${state['assign_to_attribute']}'\\l`
  }
  if(state.referenced_by_attribute){
    details = details + `Referenced By Attribute: '${state['referenced_by_attribute']}'\\l`
  }
  if(state.activities){
    details = details + "\\lActivities:\\l"
    state['activities'].forEach( activity => {
      details = details + activity['system'] + "[" + activity['code'] + "]: " + activity['display'] + "\\l"
    })
  }
  if(state.goals){
    details = details + "\\lGoals:\\l"
    state['goals'].forEach( goal => {
      if(goal['text']){
        details = details + goal['text'] + "\\l"
      } else if(goal['codes']) {
        let code = goal['codes'][0]
        details = details + code['system'] + "[" + code['code'] + "]: " + code['display'] + "\\l"
      } else if(goal['observation']) {
        let logic = goal['observation']
        let obs = findReferencedType(logic)
        details = details + `Observation ${obs} \\${logic['operator']} ${logic['value']}\\l`
      }
    })
  }
  if(state.duration){
    let d = state['duration']
    details = `${details}\\lDuration: ${d['low']} - ${d['high']} ${d['unit']}\\l`
  }
  if(state.category){
    details = `${details}Category: ${state['category']}\\l`
  }

  return details;
}

const logicDetails = logic => {

  switch(logic['condition_type']){
    case 'When':
    case 'Or':
      let subsWhen =logic['conditions'].map( c => {
        if(c['condition_type'] === 'and' || c['condition_type'] === 'or'){
          return "(\\l" + logicDetails(c) + ")\\l"
        } else {
          return logicDetails(c)
        }
      })
      return subsWhen.join(logic['condition_type'].toLowerCase() + ' ')
    case 'At Least':
    case 'At Most':
      let threshold = logic['minimum'] || logic['maximum']
      let subsOr = logic['conditions'].map( c => {
        if(c['condition_type'] === 'and' || c['condition_type'] === 'or'){
          return "(\\l" + logicDetails(c) + ")\\l"
        } else {
          return logicDetails(c)
        }
      });
      return `${logic['condition_type']} ${threshold} of:\\l- ${subsOr.join('- ')}`
    case 'Gender': 
      return `gender is '${logic['gender']}'\\l`
    case 'Age':
      return `age \\${logic['operator']} ${logic['quantity']} ${logic['unit']}\\l`
    case 'Socioeconomic Status':
      return `${logic['category']} Socioeconomic Status\\l`
    case 'Race':
      return `race is '${logic['race']}'\\l`
    case 'Date':
      return `Year is \\${logic['operator']} ${logic['year']}\\l`
    case 'Symptom':
      return `Symptom: '${logic['symptom']}' \\${logic['operator']} ${logic['value']}\\l`
    case 'PriorState':
      if(logic.within !== undefined){
        return `state '${logic['name']}' has been processed within ${logic.within['quantity']} ${logic.within['unit']}\\l`
      } else {
        return `state '${logic['name']}' has been processed\\l`
      }
    case 'Attribute':
      return `Attribute: '${logic['attribute']}' \\${logic['operator']} ${logic['value']}\\l`
    case 'Observation':
      let obs = findReferencedType(logic)
      return `Observation ${obs} \\${logic['operator']} ${logic['value']}\\l`
    case 'Vital Sign':
      return `Vital Sign ${logic['vital_sign']} \\${logic['operator']} ${logic['value']}\\l`
    case 'Active Condition':
      let cond = findReferencedType(logic)
      return `Condition ${cond} is active\\l`
    case 'Active CarePlan':
      let plan = findReferencedType(logic)
      return `CarePlan ${plan} is active\\l`
    case 'Active Medication':
      let med = findReferencedType(logic)
      return `Medication ${med} is active\\l`
    case 'Active Allergy':
      let alg = findReferencedType(logic)
      return `Allergy ${alg} is active\\l`
    case 'True':
    case 'False':
      return logic['condition_type']
    default:
      return `Unknown Condition: ${logic['condition_type']}`

  }
}

const findReferencedType = (logic) => {
  if(logic['codes']){
    let code = logic['codes'][0]
    return `'${code['system']} [${code['code']}]: ${code['display']}'`
  } else if (logic['referenced_by_attribute']) {
    return `Referenced By Attribute: '${logic['referenced_by_attribute']}'`
  }
  return `Error with referenced types: ${logic['condition_type']} condition must be specified by code or attribute`
}

const findTransitions = (obj, ret) => {

  if(!ret) ret = {};
  if (!obj) return ret;
  if (obj instanceof Array) {
    for (let i in obj) {
        ret = Object.assign({}, ret, findTransitions(obj[i], {}))
    }
    return ret;
  }

  if (obj['direct_transition']) ret[obj['direct_transition']] = true
  if (obj['transition']) ret[obj['transition']] = true;

  if ((typeof obj === "object") && (obj !== null) ){
    let children = Object.keys(obj);
    if (children.length > 0){
      for (let i = 0; i < children.length; i++ ){
        ret = Object.assign({}, ret,findTransitions(obj[children[i]], {}));
      }
    }
  }
  return ret;
}
