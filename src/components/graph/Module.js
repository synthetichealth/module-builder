// @flow
import React, { Component } from 'react';

import svgPanZoom from  'svg-pan-zoom';

import Viz from 'viz.js';

import './Module.css';

import type { Module } from './types/Module';

type Props = {
  module: Module,
  onClick: (id:string) => mixed
}

class ModuleGraph extends Component<Props> {

  componentDidMount(){
    this.writeSVG(this.props.module)
  }

  componentWillReceiveProps(nextProps: Props){
    console.log("Generating new graph");

    this.writeSVG(nextProps.module);
  }

  writeSVG(module: Module){
    this.mount.innerHTML= Viz(this.generateDOT(module));
    svgPanZoom(this.mount.children[0]).enableControlIcons();

    Object.keys(module.states).forEach( s => {
      document.getElementById(`node_${s}`).addEventListener('click', () => this.props.onClick(s));
    })

    let appPanelWidth = document.getElementsByClassName('App-edit-panel')[0].offsetWidth

    if(!appPanelWidth){
      appPanelWidth=400;
      console.log('WARNING: NO PANEL WIDTH AS EXPECTED');
    }

    let availableWidth = document.getElementsByClassName('App')[0].offsetWidth - appPanelWidth
    let graphWidth = this.mount.children[0].clientWidth;

    let offset = 0;

    if(graphWidth > availableWidth){
      offset = graphWidth - availableWidth
    }

    this.mount.style.marginLeft = `-${offset}px`

    if(graphWidth > 500){
      document.getElementById('svg-pan-zoom-controls').attributes.transform.value = `translate(${offset}, 0) scale(0.75)`
    } else {
      document.getElementById('svg-pan-zoom-controls').style.visibility = 'hidden'

    }


  }

  render() {
    
    return (
        <div ref={mount => this.mount = mount } className="Module"></div>
    )
  }

  // DOT RENDERING CODE
  // TODO: PUT IN ANOTHER CLASS?

  generateDOT(module: Module){

    let nodeMap = {};

    let output = 'digraph G {\n';

    output += Object.keys(module.states).map( name => {
      let state = module.states[name]
      state['name'] = name
      let node = {shape: 'record', style: 'rounded'}


      if(state['type'] === 'Initial' || state['type'] === 'Terminal'){
          node['color'] = 'black'
          node['style'] = 'rounded,filled'
          node['fontcolor'] = 'white'
      }
      let details = this.state_description(state)

      node['label'] = (name === state['type']) ? state['name'] : `{ ${name} | ${state['type']} }`
      //TODO: ALMOST DONE WITH DETAILS, BUT SMALL BUG IN RENDERING... maybe from \l?
      // if(details.length === 0){
      //   node['label'] = (name === state['type']) ? state['name'] : `{ ${name} | ${state['type']} }`
      // } else {
      //   node['label'] = `{ ${name} | { ${state['type']} | ${details} } }`
      // }

      nodeMap[name] = state

      return `${name} [id = "node_${name}", shape = "${node['shape']}", style = "${node['style']}", label = "${node['label']}", fontcolor = "${node['fontcolor']};"]` 

    }).join("\n");

    output += Object.keys(module.states).map( name => {
      let state = module.states[name]

      if(state.direct_transition !== undefined){
        if(nodeMap[state.direct_transition]){
          return `  ${name} -> ${nodeMap[state.direct_transition].name}\n`
        } else {
          console.log(`NO SUCH NODE TO TRANSITION TO: ${state.direct_transition}`);
        }
      } else if(state.distributed_transition !== undefined){
        let out_transitions = ''
        state.distributed_transition.forEach( t => {
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
          if(nodeMap[t.transition]){
            out_transitions += `  ${name} -> ${nodeMap[t.transition].name} [label = "${distLabel}"];\n`
          } else {
            console.log(`NO SUCH NODE TO TRANSITION TO: ${t.transition}`);
          }
        })
        return out_transitions
      } else if (state.conditional_transition !== undefined){
        let out_transitions = ''
        state.conditional_transition.forEach( (t, i ) => {
          let cnd = t.condition !== undefined ? this.logicDetails(t.condition) : 'else';
          if(nodeMap[t.transition]){
            out_transitions += `  ${name} -> ${nodeMap[t.transition].name} [label = "${i}. ${cnd}"];\n`
          } else {
            console.log(`NO SUCH NODE TO TRANSITION TO: ${t.transition}`);
          }
        })
       return out_transitions

      } else if (state.complex_transition !== undefined){
        let transitions = {}
        state.complex_transition.forEach( t => {
          let cnd = t.condition !== undefined ? this.logicDetails(t['condition']) : 'else'
          if(t.transition !== undefined){
            if(nodeMap[t.transition]){
              let nodes = `  ${name} -> ${t.transition}`
              if(transitions[nodes] === undefined){
                transitions[nodes] = [];
              }
              transitions[nodes].push(cnd)
            } else {
              console.log(`NO SUCH NODE TO TRANSITION TO: ${t.transition}`);
            }
          } else {
            t.distributions.forEach( dist => {
              if(nodeMap[dist.transition]){
                let pct = dist.distribution * 100
                let nodes = `  ${name} -> ${dist.transition}`
                if(transitions[nodes] === undefined){
                  transitions[nodes] = [];
                }
                transitions[nodes].push(`${cnd}: ${pct}%`)
              } else {
                console.log(`NO SUCH NODE TO TRANSITION TO: ${dist.transition}`);
              }
            })
          }
        })

        let out_transitions = ''
        Object.keys(transitions).forEach( trans => {
          out_transitions += `${trans} [label = "${transitions[trans].join(',\n')}"]\n`
        })

        return out_transitions;

      }

      return ''

    }).join('')

    output += "}";
    return output;
  }

  state_description(state){
    let details = ''

    switch(state['type']){
      case 'Initial':
      case 'Terminal':
        details = ''
        break;
      case 'Guard':
        details = "Allow if " + this.logicDetails(state['allow'])
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
         details += `\l  + Discharge Disposition: [${code['code']}] ${code['display']}`
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
      }

      details = details + verb + " at " + state['target_encounter'] + "\\l"
    }

    if(state.reason){
      details = details + "Reason: " + state['reason'] + "\\l"
    }
    if(state.medication_order){
      details = details + "Prescribed at: ${state['medication_order']}\\l"
    }
    if(state.condition_onset){
      details = details + "Onset at: ${state['condition_onset']}\\l"
    }
    if(state.allergy_onset){
      details = details + "Onset at: ${state['allergy_onset']}\\l"
    }
    if(state.careplan){
      details = details + "Prescribed at: ${state['careplan']}\\l"
    }
    if(state.assign_to_attribute){
      details = details + "Assign to Attribute: '${state['assign_to_attribute']}'\\l"
    }
    if(state.referenced_by_attribute){
      details = details + "Referenced By Attribute: '${state['referenced_by_attribute']}'\\l"
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
          let obs = this.find_referenced_type(logic)
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


    return state['type'] + details;
  }

  logicDetails(logic){
    switch(logic['condition_type']){
      case 'When':
      case 'Or':
        let subsWhen =logic['conditions'].map( c => {
          if(c['condition_type'] === 'and' || c['condition_type'] === 'or'){
            return "(\\l" + this.logicDetails(c) + ")\\l"
          } else {
            return this.logicDetails(c)
          }
        })
        return subsWhen.join(logic['condition_type'].toLowerCase() + ' ')
      case 'At Least':
      case 'At Most':
        let threshold = logic['minimum'] || logic['maximum']
        let subsOr = logic['conditions'].map( c => {
          if(c['condition_type'] === 'and' || c['condition_type'] === 'or'){
            return "(\\l" + this.logicDetails(c) + ")\\l"
          } else {
            return this.logicDetails(c)
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
        let obs = this.find_referenced_type(logic)
        return `Observation ${obs} \\${logic['operator']} ${logic['value']}\\l`
      case 'Vital Sign':
        return `Vital Sign ${logic['vital_sign']} \\${logic['operator']} ${logic['value']}\\l`
      case 'Active Condition':
        let cond = this.find_referenced_type(logic)
        return `Condition ${cond} is active\\l`
      case 'Active CarePlan':
        let plan = this.find_referenced_type(logic)
        return `CarePlan ${plan} is active\\l`
      case 'Active Medication':
        let med = this.find_referenced_type(logic)
        return `Medication ${med} is active\\l`
      case 'Active Allergy':
        let alg = this.find_referenced_type(logic)
        return `Allergy ${alg} is active\\l`
      case 'True':
      case 'False':
        return logic['condition_type']
      default:
        return `Unknown Condition: ${logic['condition_type']}`

    }
  }

  find_referenced_type(logic){
    if(logic['codes']){
      let code = logic['codes'][0]
      return `'${code['system']} [${code['code']}]: ${code['display']}'`
    } else if (logic['referenced_by_attribute']) {
      return `Referenced By Attribute: '${logic['referenced_by_attribute']}'`
    }
    return `Error with referenced types: ${logic['condition_type']} condition must be specified by code or attribute`
  }

}

export default ModuleGraph;
