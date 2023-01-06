// @flow
import type { Module } from './types/Module';
import type { State } from './types/State';

import { cleanString } from '../utils/stringUtils';

const STANDARD_COLOR = 'Black';
/*
const HIGHLIGHT_COLOR = '#007bff';
const MUTED_COLOR = '#CCCCCC'
*/

export function generateDOT(module: Module, selectedState: State, selectedStateTransition: Number) {

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
          transitionsAsDOT(module, selectedState, selectedStateTransition),
         '}'
         ].join('\n');

  return output;

}

const nodesAsDOT = (module: Module, selectedState: State, relatedStates: mixed) => {

  return Object.keys(module.states).filter(name => typeof module.states[name] === 'object').map( name => {

    let state = module.states[name]
    state['name'] = name

    let node = {
      id: 'node_' + escapeId(name),
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

    node['label'] = escapeLabel(node['label']);

    let params = Object.keys(node).map((key) => `${key} = "${node[key]}"`).join(", ");

    return `"${escapeName(name)}" [${params};]`

  }).join("\n");

}

const transitionsAsDOT = (module: Module, selectedState: State, selectedStateTransition: Number) => {

  return Object.keys(module.states).map( name => {

    let state = module.states[name]
    let escapedName = escapeName(name);

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

      if(selectedStateTransition === 0 ){
        className += ' transition-selected';
      }

      if(module.states[state.direct_transition]){
        return `  "${escapedName}" -> "${escapeName(module.states[state.direct_transition].name)}" [class = "transition transition-index_0 ${className}"];\n`
      } else {
        console.log(`NO SUCH NODE TO TRANSITION TO: ${state.direct_transition} FROM ${name}`);
      }
    } else if(state.distributed_transition !== undefined){
      let out_transitions = ''
      state.distributed_transition.forEach( (t, i) => {
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

          if(selectedStateTransition === i){
            transitionClassName += ' transition-selected';
          }
          out_transitions += `  "${escapedName}" -> "${escapeName(module.states[t.transition].name)}" [label = "${distLabel}", class = "transition transition-index_${i} ${transitionClassName}"];\n`
        } else {
          console.log(`NO SUCH NODE TO TRANSITION TO: ${t.transition} FROM ${name}`);
        }
      })
      return out_transitions
    } else if(state.lookup_table_transition !== undefined){
        let out_transitions = ''
        state.lookup_table_transition.transitions.forEach( (t, i) => {
        let transitionClassName = className
        let pct = t.default_probability * 100
        let distLabel = `${pct}%`
        if(module.states[t.transition]){
          if(selectedState && t.transition === selectedState.name && selectedState.name !== name){
            transitionClassName = '';
          }

          if(selectedStateTransition === i){
            transitionClassName += ' transition-selected';
          }
          out_transitions += `  "${escapedName}" -> "${escapeName(module.states[t.transition].name)}" [label = "See Table (def: ${distLabel})", class = "transition transition-index_${i} ${transitionClassName}"];\n`
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
          if(selectedStateTransition === i){
            transitionClassName += ' transition-selected';
          }
          out_transitions += `  "${escapedName}" -> "${escapeName(module.states[t.transition].name)}" [label = "${i+1}. ${cnd}", class = "transition transition-index_${i} ${transitionClassName}"];\n`
        } else {
          console.log(`NO SUCH NODE TO TRANSITION TO: ${t.transition} FROM ${name}\n`);
        }
      })
     return out_transitions

    } else if (state.complex_transition !== undefined){
      let transitions = {}
      let nodeHighlighted = {}
      state.complex_transition.forEach( (t, i) => {
        let cnd = t.condition !== undefined ? logicDetails(t['condition']) : 'else'
        if(t.transition !== undefined){
          if(module.states[t.transition]){
            let nodes = `  "${escapedName}" -> "${t.transition}"`
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
              let nodes = `  "${escapedName}" -> "${dist.transition}"`
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
      Object.keys(transitions).forEach( (trans, index) => {
        let transitionClassName = className
        if(nodeHighlighted[trans] === 'standard'){
          transitionClassName = ''
        } else if(nodeHighlighted[trans] === 'highlighted'){
          transitionClassName='transition-highlighted'
        }
        if(selectedStateTransition === index){
          transitionClassName += ' transition-selected';
        }
        out_transitions += `${trans} [label = "${transitions[trans].join(',\\n')}", class = "transition transition-index_${index} ${transitionClassName}"]\n`
      })

      return out_transitions;

    }

    return ''

  }).join('')

}

const distributionString = (distro) => {
  switch(distro['kind']) {
    case 'EXACT':
      return distro['parameters']['value'];
    case 'UNIFORM':
      return `${distro['parameters']['low']} - ${distro['parameters']['high']}`;
    case 'GAUSSIAN':
      return `Mean: ${distro['parameters']['mean']}, SD: ${distro['parameters']['standardDeviation']}`
    case 'EXPONENTIAL':
      return `Mean: ${distro['parameters']['mean']}`
  }
  return '';
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
      } else if (state['distribution'] !== undefined && state['unit'] !== undefined) {
        details = `${distributionString(state['distribution'])} ${state['unit']}`
      }
      break;
    case 'Encounter':
      if(state['wellness']){
        details = 'Wait for regularly scheduled wellness encounter\\n'
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
      if (state.range) {
        const r = state.range;
        details = `Set '${state["attribute"]}': ${r['low']} - ${r['high']}`;
      } else if (state['value']) {
        let v = state['value']
        details = `Set '${state["attribute"]}' = ${(v === undefined || v === null || v === "") ? 'nil' : v}`
      } else if (state.value_code !== undefined) {
        let v = state['value_code']
        details = `Set '${state["attribute"]}' = ${v['system']}[${v['code']}]: ${v['display']}\\l`
      } else if (state['distribution'] !== undefined ) {
        details = `Set '${state["attribute"]}': ${distributionString(state['distribution'])}}`
      }
      break;

    case 'Symptom':
     let s = state['symptom']
     let p = state['probability']
      if(state.range !== undefined){
        let r = state['range']
        details = `${s}: ${r['low']} - ${r['high']}`
      } else if (state.exact !== undefined) {
        let e = state['exact']
        details = `${s}: ${e['quantity']}`
      } else if (state['distribution'] !== undefined ) {
        details = `${s}: ${distributionString(state['distribution'])}}`
      }
      if (p && p < 1.0 && p > 0) {
        let pct = p*100;
        details += ` (${pct}%)`
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
      } else if(state.range !== undefined){
        let r = state['range']
        details = `Record value between: ${r['low']} - ${r['high']} ${unit}\\l`
      } else if (state.exact !== undefined) {
        let e = state['exact']
        details = `Record value ${e['quantity']} ${unit}\\l`
      } else if (state.value_code !== undefined) {
        let v = state['value_code']
        details = `Record value ${v['system']}[${v['code']}]: ${v['display']}\\l`
      } else if (state['distribution'] !== undefined && state['unit'] !== undefined) {
        details = `Record value ${distributionString(state['distribution'])} ${unit}`
      }
      break;

    case 'Procedure':
      if (state['distribution'] !== undefined && state['unit'] !== undefined) {
        details = `Duration: ${distributionString(state['distribution'])} ${state['unit']}\\l`
      }
      break;

    case 'ImagingStudy':
      let series = state['series'];
      if (series.length > 0) {
        let primarySeries = series[0];
        let primaryModality = primarySeries['modality'];
        let primaryBodySite = primarySeries['body_site'];

        details = `DICOM-DCM[${primaryModality['code']}]: ${primaryModality['display']}\\l`
        details += `SNOMED-CT[${primaryBodySite['code']}]: Body Site: ${primaryBodySite['display']}\\l`
      }
      break;

    case 'Counter':
      details = `${state['action']} value of attribute '${state["attribute"]}' by ${state['amount'] || 1}`
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
      } else if (state['distribution'] !== undefined ) {
        details = `Set ${vs}: ${distributionString(state['distribution'])} ${unitv}`
      }
      break;
    case 'CallSubmodule':
      details = `Call submodule '${state['submodule']}'`
      break;
    case 'MultiObservation':
    case 'DiagnosticReport':
      if(state.observations && state.observations.length > 0){
        let diagType = ['Type']
        let diagValue = ['Value']
        let diagUnits = ['Unit'];
        state.observations.forEach( (s,i) => {
          let unit = s['unit']
          if(unit){
            unit = unit.replace('{','(').replace('}',')')
          }
          diagType.push(s.codes.map(c => c.display).join('\\l'))
          diagUnits.push(unit)

          if(s.vital_sign !== undefined) {
            diagValue.push(`Vital Sign: '${s["vital_sign"]}'`)
          } else if (s.attribute !== undefined) {
            diagValue.push(`Attribute: '${s["attribute"]}'`)
          } else if(s.range !== undefined){
            let r = s['range']
            diagValue.push(`${r['low']} - ${r['high']}`)
          } else if (s.exact !== undefined) {
            let e = s['exact']
            diagValue.push(`${e['quantity']}`);
          } else if (s.value_code !== undefined) {
            let v = s['value_code']
            diagValue.push(`${v['system']}[${v['code']}]: ${v['display']}`);
          }
        });
        details += `{${diagType.map(t => t).join('|')}}|`;
        details += `{${diagValue.map(t => t).join('|')}}|`;
        details += `{${diagUnits.map(t => t).join('|')}}|`;
      } else {
        details = `No Observations\\l`;
      }

      break;

    case 'Device':
      const c = state.code;
      details = `${c['system']}[${c['code']}]: ${c['display']}\\l`;

      if (state.manufacturer) {
        details += `Manufacturer: ${state.manufacturer}\\l`;
      }
      if (state.model) {
        details += `Model: ${state.model}\\l`;
      }
      break;

    case 'DeviceEnd':
      if (state.device) {
        details = `Added at: ${state.device}\\l`;
      }
      break;

    case 'SupplyList':
      if(state.supplies && state.supplies.length > 0){
        let supplyQuantity = ['Quantity']
        let supplyCode = ['Code'];
        state.supplies.forEach( (s,i) => {
          supplyQuantity.push(s.quantity);
          const c = s.code;
          supplyCode.push(`${c['system']}[${c['code']}]: ${c['display']}`);
        });

        details += `{${supplyCode.map(t => t).join('|')}}|`;
        details += `{${supplyQuantity.map(t => t).join('|')}}|`;
      } else {
        details = `No Supplies\\l`;
      }
      break;

    default:
      break;

  }

  if(state.codes !== undefined){
    state['codes'].forEach( code => {
      if(code['value_set'] === undefined){
        code['value_set'] = "";
      }

      let system_val = escapeVerticalBar(code['system']);
      let code_val = escapeVerticalBar(code['code']);
      let display_val = escapeVerticalBar(code['display']);
      let valuSet_val = escapeVerticalBar(code['value_set']);

      details = details + system_val + "[" + code_val + "]: " + display_val  + "\\l";
      if (valuSet_val) {
      	details += "Value Set:" + "[" + valuSet_val +"] " + "\\l";
      }
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
  if(state.administration){
    details = details + `Medication is administered\\l`
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
        details = details + `Observation ${obs} \\${logic['operator']}${leaveUndefinedBlank(logic['value'])}\\l`
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
  if(state.allergy_type && state.allergy_type.length > 0) {
      details += `Type: ${state.allergy_type}\\l`
  }
  if(state.reactions && state.reactions.length > 0) {
    state.reactions.forEach(r => {
      details += `Reaction: ${r.reaction['system']}[${r.reaction['code']}]: ${r.reaction['display']}\\l`
    });
  }

  return details;
}

const logicDetails = logic => {

  switch(logic['condition_type']){
    case 'And':
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
    case 'Not':
      let condition = logicDetails(logic['condition'])
      return `not ${condition}`
    case 'Gender':
      return `gender is '${logic['gender']}'\\l`
    case 'Age':
      return `age \\${logic['operator']} ${logic['quantity']} ${logic['unit']}\\l`
    case 'Socioeconomic Status':
      return `${logic['category']} Socioeconomic Status\\l`
    case 'Race':
      return `race is '${logic['race']}'\\l`
    case 'Date':
      if (logic.year !== undefined) {
        return `Year is \\${logic['operator']} ${logic['year']}\\l`
      } else if (logic.month !== undefined) {
        return `Month is \\${logic['operator']} ${logic['month']}\\l`
      } else if (logic.date !== undefined) {
        let d = logic['date']
        return `Date is \\${logic['operator']} ${d['year']}-${d['month']}-${d['day']} ${d['hour']}:${d['minute']}:${d['second']}.${d['millisecond']}\\l`
      }
    case 'Symptom':
      return `Symptom: '${logic['symptom']}' \\${logic['operator']} ${logic['value']}\\l`
    case 'PriorState':
      let prior_description = `state '${logic['name']}' has been processed`
      if(logic.since !== undefined){
        prior_description = `${prior_description} since ${logic.since}`
      }
      if(logic.within !== undefined){
        prior_description = `${prior_description} within ${logic.within['quantity']} ${logic.within['unit']}`
      }
      return `${prior_description} \\l`
    case 'Attribute':
      return `Attribute: '${logic['attribute']}' \\${logic['operator']}${leaveUndefinedBlank(logic['value'])}\\l`
    case 'Observation':
      let obs = findReferencedType(logic)
      if (logic.operator !== 'is nil' && logic.operator !== 'is not nil' && logic.operator.id !== 'is nil' && logic.operator.id !== 'is not nil'){
        if(logic.value !== undefined){
          return `Observation ${obs} \\${logic['operator']}${leaveUndefinedBlank(logic['value'])}\\l`
        } else if (logic.value_code !== undefined) {
          return `Observation ${obs} \\${logic['operator']} ${logic.value_code['system']}[${logic.value_code['code']}]: ${logic.value_code['display']}\\l`
        }
      } else {
        return `Observation ${obs} \\${logic['operator']}\\l`
      }

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

const leaveUndefinedBlank = (value) => {
  if(value === undefined){
    return '';
  } else {
    return ' ' + value;
  }
}

const escapeId = (name) => {
  return cleanString(name, {'?': '', '"': ""});
};

const escapeName = (name) => {
  return  cleanString(name, {'"': '\\'});
};

const escapeLabel = (label) => {

  // note: order matters; in practice order is retained in browsers but we may want to make an array
  const mapObj = {
        "&" : "&amp;",
        "<" : "&lt;",
        ">" : "&gt;",
        '"' : '\\"',
        };

  return cleanString(label, mapObj);

}

const escapeVerticalBar = (inputStr) => {
  inputStr = inputStr.toString();
  return inputStr.replace(/\|/g, "\\|")
};

export const svgDefs = `<defs>

  <filter id="outershadow" height="200%" width="200%" x="-75%" y="-75%" color-interpolation-filters="sRGB">
    <feMorphology operator="dilate" radius="3" in="SourceAlpha" result="thicken" />
    <feGaussianBlur in="thicken" stdDeviation="4" result="blurred" />
    <feFlood flood-color="#336699" result="glowColor" />
    <feComposite in="glowColor" in2="blurred" operator="in" result="glowComposite" />
    <feMerge>
      <feMergeNode in="glowComposite"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>`;

