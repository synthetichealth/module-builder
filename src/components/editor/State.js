// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber, RIEToggle, RIETextArea } from 'riek';
import _ from 'lodash';

import type {
  State, InitialState, TerminalState, SimpleState,
  GuardState, DelayState, SetAttributeState, CounterState,
  CallSubmoduleState, EncounterState, EncounterEndState,
  ConditionOnsetState, ConditionEndState, AllergyOnsetState,
  AllergyEndState, MedicationOrderState, MedicationEndState,
  CarePlanStartState, CarePlanEndState, ProcedureState,
  VitalSignState, ObservationState, MultiObservationState,
  DiagnosticReportState, ImagingStudyState, SymptomState,
  SupplyListState, DeviceState, DeviceEndState, DeathState,
  VaccineState
} from '../../types/State';

import { Code, Codes } from './Code';
import { Reaction } from './Reaction';
import { Goals } from './Goal';
import { SeriesList } from './ImagingStudyAttributes';
import ConditionalEditor from './Conditional';
import Transition from './Transition';
import { getTemplate } from '../../templates/Templates';
import { BasicTutorial, EditTutorial } from '../../templates/Tutorial';
import AutoCompleteText from './AutoCompleteText';
import Attributes from './Attributes.js';
import AttributeData from '../analysis/AttributeData.json';
import './State.css';

type Props = {
  moduleName: string,
  state: State,
  otherStates: State[],
  onChange: any,
  renameNode: any,
  copyNode: any,
  changeType: any,
  addTransition: any,
  helpFunction: any,
  displayAttributes: any
}

type Distro = {
  kind: string,
  parameters: any,
  otherToggles: Component
}

const unitOfTimeOptions = [
  {id: 'years', text: 'years'},
  {id: 'months', text: 'months'},
  {id: 'weeks', text: 'weeks'},
  {id: 'days', text: 'days'},
  {id: 'hours', text: 'hours'},
  {id: 'minutes', text: 'minutes'},
  {id: 'seconds', text: 'seconds'}
];

class StateEditor extends Component<Props> {

  renderStateType() {
    let props = {...this.props};
    props.state.name = props.state.name || 'Unnamed_State';
    props.onChange = this.props.onChange(`states.${props.state.name}`);
    switch (this.props.state.type) {
      case "Initial":
        return <Initial {...props} />
      case "Terminal":
        return <Terminal {...props} />
      case "Simple":
        return <Simple {...props} />
      case "Guard":
        return <Guard {...props} />
      case "Delay":
        return <Delay {...props} />
      case "SetAttribute":
        return <SetAttribute {...props} />
      case "Counter":
        return <Counter {...props} />
      case "CallSubmodule":
        return <CallSubmodule {...props} />
      case "Encounter":
        return <Encounter {...props} />
      case "EncounterEnd":
        return <EncounterEnd {...props} />
      case "ConditionOnset":
        return <ConditionOnset {...props} />
      case "ConditionEnd":
        return <ConditionEnd {...props} />
      case "AllergyOnset":
        return <AllergyOnset {...props} />
      case "AllergyEnd":
        return <AllergyEnd {...props} />
      case "MedicationOrder":
        return <MedicationOrder {...props} />
      case "MedicationEnd":
        return <MedicationEnd {...props} />
      case "CarePlanStart":
        return <CarePlanStart {...props} />
      case "CarePlanEnd":
        return <CarePlanEnd {...props} />
      case "Procedure":
        return <Procedure {...props} />
      case "VitalSign":
        return <VitalSign {...props} />
      case "Observation":
        return <Observation {...props} />
      case "MultiObservation":
        return <MultiObservation {...props} />
      case "DiagnosticReport":
        return <DiagnosticReport {...props} />
      case "ImagingStudy":
        return <ImagingStudy {...props} />
      case "Symptom":
        return <Symptom {...props} />
      case "Device":
        return <Device {...props} />
      case "DeviceEnd":
        return <DeviceEnd {...props} />
      case "SupplyList":
        return <SupplyList {...props} />
      case "Death":
        return <Death {...props} />
      case "Vaccine":
        return  <Vaccine {...props} />
      default:
        return this.props.state.type
    }
  }

  updateRemarks = (el:any) => {
    const remarks = el.remarks? el.remarks.split("\n") : null;
    this.props.onChange(`states.${this.props.state.name}.remarks`)({remarks:{id:remarks}});
  }

  render() {
    if(!this.props.state) {
      return null;
    }

    let typeOptions = Object.keys(getTemplate('State')).sort().map((k) => {return {id: k, text: k}});
    const transitionOptions = [
      {id:"None" ,text:"None"},
      {id:"Direct" ,text:"Direct"},
      {id:"Distributed" ,text:"Distributed"},
      {id:"Conditional" ,text:"Conditional"},
      {id:"Complex" ,text:"Complex"},
      {id:"Table" ,text:"Table"}
    ]

    let remarks = this.props.state.remarks ||"";
    remarks = Array.isArray(remarks)? remarks.join("\n"): remarks;

    const transitionType = (this.props.state.transition||{}).type;
    return (
        <div className="State">
          <div className='Editor-panel-title'>
            State Editor
          </div>
          <h3><RIEInput className='editable-text' propName={'name'} value={this.props.state.name} change={this.props.renameNode} /></h3>
          State Type: <RIESelect className='editable-text' value={{id: this.props.state.type, text: this.props.state.type}} propName='type'change={this.props.changeType} options={typeOptions}/>
          <hr/>
          <RIETextArea className='editable-text' value={remarks} propName="remarks" change={this.updateRemarks} />
          <br/>
          <hr/>
          <div className="State-Editor">
            {this.renderStateType()}
          </div>
          <br />
          <hr />
          <div>
            <div className="Transition-Type">Transition Type:
              <RIESelect className='editable-text' value={{id: transitionType, text: transitionType}} propName='transition' change={(e) => this.props.addTransition(e.transition.id)} options={transitionOptions}/>
            </div>
          </div>
          <div className="Transition">
            <Transition
              options={this.props.otherStates.sort((a,b) => a.name > b.name? 1 : -1)}
              transition={this.props.state.transition}
              onChange={this.props.onChange(`states.${this.props.state.name}`)} />
          </div>
          <br/>
          <a onClick={this.props.helpFunction(EditTutorial)}>Help</a>
        </div>
    )
  }

}

class Initial extends Component<Props> {

  render() {
    let state = ((this.props.state: any): InitialState);
    return (
      null
    );
  }

}

class Terminal extends Component<Props> {

  render() {
    let state = ((this.props.state: any): TerminalState);
    return (
      null
    );
  }

}

class Simple extends Component<Props> {

  render() {
    let state = ((this.props.state: any): SimpleState);
    return (
      null
    );
  }

}

class Guard extends Component<Props> {

  render() {
    let state = ((this.props.state: any): GuardState);
    return (
      <div>
        <ConditionalEditor {...this.props} conditional={state.allow} options={this.props.otherStates} onChange={this.props.onChange('allow')} />
      </div>
    );
  }

}

class Distribution extends Component<Distro> {
  render() {
    switch (this.props.kind) {
      case "EXACT":
        return <Exact {...this.props} onChange={this.props.onChange} />
      case "GAUSSIAN":
        return <Gaussian {...this.props} onChange={this.props.onChange} />
      case "UNIFORM":
        return <Uniform {...this.props} onChange={this.props.onChange} />
      case "EXPONENTIAL":
        return <Exponential {...this.props} onChange={this.props.onChange} />
    }
  }
}

class Exact extends Component<Distro> {
  render() {
    return (
      <div>
        Exact Quantity: <RIENumber className='editable-text' value={this.props.parameters.value} propName='value' change={this.props.onChange('parameters.value')} />
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'UNIFORM'}}); this.props.onChange('parameters')({val: {id: {high: 20, low: 10}}})}}>Change to Range</a>
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'GAUSSIAN'}}); this.props.onChange('parameters')({val: {id: {mean: 10, standardDeviation: 1}}})}}>Change to Gaussian</a>
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'EXPONENTIAL'}}); this.props.onChange('parameters')({val: {id: {mean: 10}}})}}>Change to Exponential</a>
        <br />
        {this.props.otherToggles}
      </div>
    );
  }
}

class Uniform extends Component<Distro> {
  render() {
    return (
      <div>
        Range Low: <RIENumber className='editable-text' value={this.props.parameters.low} propName='low' change={this.props.onChange('parameters.low')} />
        <br />
        Range High: <RIENumber className='editable-text' value={this.props.parameters.high} propName='high' change={this.props.onChange('parameters.high')} />
        <br />
        {this.props.round!=null &&
        <div>Round Result: <RIEToggle value={this.props.round} propName='round' change={this.props.onChange('round')} />
        <br /></div> }
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'EXACT'}}); this.props.onChange('parameters')({val: {id: {value: 10}}})}}>Change to Exact</a>
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'GAUSSIAN'}}); this.props.onChange('parameters')({val: {id: {mean: 10, standardDeviation: 1}}})}}>Change to Gaussian</a>
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'EXPONENTIAL'}}); this.props.onChange('parameters')({val: {id: {mean: 10}}})}}>Change to Exponential</a>
        <br />
        {this.props.otherToggles}
      </div>
    );
  }
}

class Gaussian extends Component<Distro> {
  render() {
    return (
      <div>
        Mean: <RIENumber className='editable-text' value={this.props.parameters.mean} propName='mean' change={this.props.onChange('parameters.mean')} />
        <br />
        Standard Deviation: <RIENumber className='editable-text' value={this.props.parameters.standardDeviation} propName='standardDeviation' change={this.props.onChange('parameters.standardDeviation')} />
        <br />
        {this.props.round!=null &&
        <div>Round Result: <RIEToggle value={this.props.round} propName='round' change={this.props.onChange('round')} />
        <br /></div> }
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'EXACT'}}); this.props.onChange('parameters')({val: {id: {value: 10}}})}}>Change to Exact</a>
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'UNIFORM'}}); this.props.onChange('parameters')({val: {id: {high: 20, low: 10}}})}}>Change to Range</a>
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'EXPONENTIAL'}}); this.props.onChange('parameters')({val: {id: {mean: 10}}})}}>Change to Exponential</a>
        <br />
        {this.props.otherToggles}
      </div>
    );
  }
}

class Exponential extends Component<Distro> {
  render() {
    return (
      <div>
        Mean: <RIENumber className='editable-text' value={this.props.parameters.mean} propName='mean' change={this.props.onChange('parameters.mean')} />
        <br />
        {this.props.round!=null &&
        <div>Round Result: <RIEToggle value={this.props.round} propName='round' change={this.props.onChange('round')} />
        <br /></div> }
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'EXACT'}}); this.props.onChange('parameters')({val: {id: {value: 10}}})}}>Change to Exact</a>
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'UNIFORM'}}); this.props.onChange('parameters')({val: {id: {high: 20, low: 10}}})}}>Change to Range</a>
        <br />
        <a className='editable-text' onClick={() => {this.props.onChange('kind')({val: {id: 'GAUSSIAN'}}); this.props.onChange('parameters')({val: {id: {mean: 10, standardDeviation: 1}}})}}>Change to Gaussian</a>
        <br />
        {this.props.otherToggles}
      </div>
    );
  }
}

class Delay extends Component<Props> {

  render() {
    let state = ((this.props.state: any): DelayState);
    let form;
    if (this.legacyGMF()) {
      form = this.renderLegacyExactOrRange();
    } else {
      form = this.renderExactOrRange();
    }
    return (
      <div>
        {form}
      </div>
    );
  }

  renderExactOrRange() {
    let state = ((this.props.state: any): DelayState);
    return (
      <div>
        <Distribution kind={state.distribution.kind}
                      parameters={state.distribution.parameters}
                      onChange={this.props.onChange('distribution')} />
        Unit: <RIESelect className='editable-text'
                         value={{id: state.unit, text: state.unit}}
                         propName="unit"
                         change={this.props.onChange('unit')}
                         options={unitOfTimeOptions} />
        <br />
      </div>
    );
  }

  renderLegacyExactOrRange() {
    let state = ((this.props.state: any): DelayState);
    if (state.exact) {
      return (
        <div>
          Exact Quantity: <RIENumber className='editable-text' value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
          <br />
          Exact Unit: <RIESelect className='editable-text' value={{id: state.exact.unit, text: state.exact.unit}} propName="unit" change={this.props.onChange('exact.unit')} options={unitOfTimeOptions} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: getTemplate('Attribute.RangeWithUnit')}}); this.props.onChange('exact')({val: {id: null}})}}>Change to Range</a>
          <br />
        </div>
      );
    }
    else {
      return (
        <div>
          Range Low: <RIENumber className='editable-text' value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
          <br />
          Range High: <RIENumber className='editable-text' value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
          <br />
          Range Unit: <RIESelect className='editable-text' value={{id: state.range.unit, text: state.range.unit}} propName="unit" change={this.props.onChange('range.unit')} options={unitOfTimeOptions} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: getTemplate('Attribute.ExactWithUnit')}}); this.props.onChange('range')({val: {id: null}})}}>Change to Exact</a>
          <br />
        </div>
      );
    }
  }

  legacyGMF() {
    let state = ((this.props.state: any): DelayState);
    if (state.exact || state.range) {
      return true;
    } else {
      return false;
    }
  }
}

class SetAttribute extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.attribute,
      lastSubmitted : this.props.state.attribute,
      displayLabel : true,
      value_code : this.props.state.value_code
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): SetAttributeState);
    let displayAttribute;
    let valueForm;
    if (this.legacyGMF()) {
      valueForm = this.renderLegacyValueOrRange();
    } else {
      valueForm = this.renderValueContainer()
    }
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.attribute]!= undefined)
        {
          Object.keys(data[state.attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (state.attribute === '')
        {
          state.attribute = 'text';
        }
        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    return (
      <div>
        Attribute: {displayAttribute}
        <br/>
        {valueForm}
      </div>
    );
  }

  legacyGMF() {
    let state = ((this.props.state: any): SetAttributeState);
    if (state.range) {
      return true;
    } else {
      return false;
    }
  }

  renderValueContainer() {
    let state = ((this.props.state: any): SetAttributeState);
    if (state.distribution) {
      return (
        <div>
          <Distribution kind={state.distribution.kind}
                        round={state.distribution.round}
                        parameters={state.distribution.parameters}
                        onChange={this.props.onChange('distribution')} />
          <br />
          <a className='editable-text' onClick={() => this.props.onChange('distribution')({val: {id: null}})}>(remove)</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('value')({val: {id: "text"}}); this.props.onChange('distribution')({val: {id: null}})}}>Change to Value</a>
        </div>
      );
    } else if (state.value) {
      let val = state.value;
      if(typeof val === 'boolean'){
        val = String(val);
      }
      return (
        <div>
          Value: <RIEInput className='editable-text' value={val} propName={'value'} change={this.props.onChange('value')} />
          <br />
          <a className='editable-text' onClick={() => this.props.onChange('value')({val: {id: null}})}>(remove)</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('distribution')({val: {id: {kind: "EXACT", round: false, parameters: {value: 1}}}}); this.props.onChange('value')({val: {id: null}})}}>Change to Distribution</a>
        </div>
      );
    } else if (state.value_code) {
      return (
        <div className='section'>
          <Code code={state.value_code} system={"LOINC"} onChange={this.props.onChange('value_code')} />
        </div>
      );
    } else {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('value')({val: {id: "text"}})}>Add Value</a><br />
          <a className='editable-text' onClick={() => this.props.onChange('distribution')({val: {id: {kind: "EXACT", round: false, parameters: {value: 1}}}})}>Add Distribution</a><br />
          <a className='editable-text' onClick={() => {this.props.onChange('value_code')({val: {id:  getTemplate('Type.Code.Loinc')}});}}>Add Code</a>
          <br />
        </div>
      );
    }

  }

  renderLegacyValueOrRange() {
    let state = ((this.props.state: any): SetAttributeState);

    if (state.value == null && state.range == null) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('value')({val: {id: "text"}})}>Add Value</a><br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: getTemplate('Attribute.Range')}})}}>Add Range</a>
          <br />
        </div>
      );
    } else if (state.value != null) {
      let val = state.value;
      if(typeof val === 'boolean'){
        val = String(val);
      }
      return (
        <div>
          Value: <RIEInput className='editable-text' value={val} propName={'value'} change={this.props.onChange('value')} />
          <a className='editable-text' onClick={() => this.props.onChange('value')({val: {id: null}})}>(remove)</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: getTemplate('Attribute.Range')}}); this.props.onChange('value')({val: {id: null}})}}>Change to Range</a>
        </div>
      );
    } else if (state.range != null) {
      return (
        <div className='section'>
          Range Low: <RIENumber className='editable-text' value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
          <br />
          Range High: <RIENumber className='editable-text' value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
          <br />
          <a className='editable-text' onClick={() => this.props.onChange('range')({val: {id: null}})}>(Remove Range)</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('value')({val: {id: 1}}); this.props.onChange('range')({val: {id: null}})}}>Change to Value</a>
          <br />
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.attribute != this.state.value)
    {
      this.props.onChange('attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.attribute});
    this.setState({lastSubmitted: this.props.state.attribute})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class Counter extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.attribute,//'',
      lastSubmitted : this.props.state.attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): CounterState);
    let options = [
      {id: 'increment', text: 'increment'},
      {id: 'decrement', text: 'decrement'}
    ];

    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.attribute]!= undefined)
        {
          Object.keys(data[state.attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (state.attribute === '')
        {
          state.attribute = 'text';
        }
        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    return (
      <div>
        Attribute: {displayAttribute}
        <br/>
        Action: <RIESelect className='editable-text' value={{id: state.action, text: state.action}} propName="action" change={this.props.onChange('action')} options={options} />
        <br/>
        Amount: <RIENumber className='editable-text' value={state.amount || 1} propName='amount' change={this.props.onChange('amount')} />
      </div>
    );
  }
  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.attribute != this.state.value)
    {
      this.props.onChange('attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.attribute});
    this.setState({lastSubmitted: this.props.state.attribute})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class CallSubmodule extends Component<Props> {

  render() {
    let state = ((this.props.state: any): CallSubmoduleState);
    return (
      <div>
        Submodule: <RIEInput className='editable-text' value={state.submodule} propName={'submodule'} change={this.props.onChange('submodule')} />
        <br/>
        <a href={`${window.location.href.replace(window.location.hash,"")}#${state.submodule}`} target="_blank">View Submodule</a>

      </div>
    );
  }

}

class Encounter extends Component<Props> {

  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeEncounterClass = this.changeEncounterClass.bind(this);
    this.state = {
      value : this.props.state.reason,
      lastSubmitted : this.props.state.reason,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.reason != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): EncounterState);
    let options = [
      {id: 'emergency', text: 'emergency'},
      {id: 'inpatient', text: 'inpatient'},
      {id: 'ambulatory', text: 'ambulatory'},
      {id: 'urgentcare', text: 'urgentcare'},
      {id: 'hospice', text: 'hospice'},
      {id: 'home', text: 'home'},
      {id: 'snf', text: 'snf'},
      {id: 'virtual', text: 'virtual'}
    ];
    if (state.wellness == null) {
      return (
        <div>
          {this.renderWellness()}
          Encounter Class: <RIESelect className='editable-text' value={{id: state.encounter_class, text: state.encounter_class}} propName="encounter_class" change={this.changeEncounterClass} options={options} />
          <br />
          {this.renderReason()}
          <div className='section'>
            Codes
            <br />
            <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          </div>
          {this.renderTelemedicinePossibility()}
        </div>
      );
    } else {
      return (
        <div>
          {this.renderWellness()}
          {this.renderReason()}
          {this.renderTelemedicinePossibility()}
        </div>
      );
    }

  }

  renderWellness() {
    let state = ((this.props.state: any): EncounterState);
    if (state.wellness == null) {
      return (
        <div>
          <a className='editable-text' onClick={() => {this.props.onChange('wellness')({val: {id: true}}); this.props.onChange('codes')({val: {id: null}}); this.props.onChange('encounter_class')({val: {id: null}})}}>Add Wellness</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Wellness
          <a className='editable-text' onClick={() => {this.props.onChange('wellness')({val: {id: null}}); this.props.onChange('codes')({val: {id: [getTemplate('Type.Code.Snomed')]}})}}>(remove)</a>
          <br />
        </div>
      );
    }

  }

  changeEncounterClass(value) {
    this.props.onChange('encounter_class')(value);
    if (value.encounter_class.text == 'virtual' &&
        this.props.state.telemedicine_possibility != 'always') {
      this.props.onChange('telemedicine_possibility')({telemedicine_possibility: 'always'});
    }
  }

  renderTelemedicinePossibility() {
    let state = ((this.props.state: any): EncounterState);
    let options = [
      {id: 'none', text: 'none'},
      {id: 'possible', text: 'possible'},
      {id: 'always', text: 'always'}
    ];
    return (
      <div>
        Telemedicine Possibility: <RIESelect className='editable-text' value={{id: state.telemedicine_possibility, text: state.telemedicine_possibility}} propName="telemedicine_possibility" change={this.props.onChange('telemedicine_possibility')} options={options} />
      </div>
    )
  }

  renderReason() {
    let state = ((this.props.state: any): EncounterState);
    if (!state.reason) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: "Select Condition/Enter Attribute"}})}>Add Reason</a>
          <br />
        </div>
      );
    } else {
      let conditionOnset = this.props.otherStates.filter((s) => {return s.type === "ConditionOnset"});
      let options = conditionOnset.map((e) => {return {id: e.name, text: e.name}});
      let inputAttribute = [{id: "*Input Attribute*", text: "*Input Attribute*"}];
      let allOptions = options.concat(inputAttribute);
      let reason = <RIESelect className='editable-text' value={{id: state.reason, text: state.reason}} propName={'reason'}  change={this.props.onChange('reason')} options={allOptions} />
      if (state.reason === "*Input Attribute*") {
        let displayAttribute;
        if (this.state.displayLabel)
        {
            const data = AttributeData;
            let others = [this.props.moduleName];
            if (data[state.reason]!= undefined)
            {
              Object.keys(data[state.reason].read).forEach(i => {others.push(i)})
              Object.keys(data[state.reason].write).forEach(i => {others.push(i)})
            }
            others = others.filter((x, i, a) => a.indexOf(x) == i)
            others.splice(others.indexOf[this.props.moduleName], 1);

            if (state.reason === '')
            {
              state.reason = 'text';
            }
            if (others.length > 0)
            {
              displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.reason}</label>
              <button classNameName="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
              </span>
            }
            else{
              displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.reason}</label>
            }

        }
        else
        {
         displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
        }
        return (
          <div>
            Reason: {reason}
            <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
            <br/>
            Attribute: {displayAttribute}
            <br/>
          </div>
        );
      } else {
        return (
          <div>
            Reason: {reason}
            <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
            <br/>
          </div>
        );
      }
    }
  }
  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.reason != this.state.value)
    {
      this.props.onChange('reason')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.reason});
    this.setState({lastSubmitted: this.props.state.reason})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }


}

class EncounterEnd extends Component<Props> {

  render() {
    let state = ((this.props.state: any): EncounterEndState);
    return (
      <div>
        {this.renderDischargeDisposition()}
      </div>
    );
  }

  renderDischargeDisposition() {
    let state = ((this.props.state: any): EncounterEndState);
    if (!state.discharge_disposition) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('discharge_disposition')({val: {id: getTemplate('Type.Code.Nubc')}})}>Add Discharge Disposition</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          <Code code={state.discharge_disposition} system={"NUBC"} onChange={this.props.onChange('discharge_disposition')} />
          <a className='editable-text' onClick={() => this.props.onChange('discharge_disposition')({val: {id: null}})}>Remove Discharge Disposition</a>
          <br />
        </div>
      );
    }
  }

}

class ConditionOnset extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.assign_to_attribute,//'',
      lastSubmitted : this.props.state.assign_to_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.assign_to_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }

    let state = ((this.props.state: any): ConditionOnsetState);
    return (
      <div>
        {this.renderTargetEncounter()}
        {this.renderAssignToAttribute()}
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
        </div>
      </div>
    );
  }

  renderTargetEncounter() {
    let state = ((this.props.state: any): ConditionOnsetState);
    let encounters = this.props.otherStates.filter((s) => {return s.type === "Encounter"});
    let options = encounters.map((e) => {return {id: e.name, text: e.name}});
    let initial_value = (state.target_encounter ? {id: state.target_encounter, text: state.target_encounter} : options[0]);
    let targetEncounter = <RIESelect className='editable-text' value={initial_value} propName={'target_encounter'}  change={this.props.onChange('target_encounter')} options={options} />
    if (state.target_encounter) {
      return (
        <div>
          Target Encounter: {targetEncounter}
          <br/>
          <a className='editable-text' onClick={() => this.props.onChange('target_encounter')({val: {id: null}})}>(remove to diagnose immediately)</a>
          <br/>
        </div>
      );
    } else {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('target_encounter')({val: initial_value})}>Add Target Encounter</a>
          <br />
        </div>
      );
    }
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): ConditionOnsetState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.assign_to_attribute]!= undefined)
        {
          Object.keys(data[state.assign_to_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.assign_to_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.assign_to_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: "text"}})}>Add Assign to Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Assign to Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.assign_to_attribute != this.state.value)
    {
      this.props.onChange('assign_to_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.assign_to_attribute});
    this.setState({lastSubmitted: this.props.state.assign_to_attribute})
  }
  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}


class ConditionEnd extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.referenced_by_attribute,
      lastSubmitted : this.props.state.referenced_by_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.referenced_by_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): ConditionEndState);
    return (
      <div>
        {this.renderConditionOnset()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderConditionOnset() {
    let state = ((this.props.state: any): ConditionEndState);
    let conditionOnset = this.props.otherStates.filter((s) => {return s.type === "ConditionOnset"});
    let options = conditionOnset.map((e) => {return {id: e.name, text: e.name}});
    if (!state.condition_onset) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('condition_onset')({val: {id: "text"}})}>Add Condition Onset</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Condition Onset: <RIESelect className='editable-text' value={{id: state.condition_onset, text: state.condition_onset}} propName={'condition_onset'}  change={this.props.onChange('condition_onset')} options={options} />
          <a className='editable-text' onClick={() => this.props.onChange('condition_onset')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): ConditionEndState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.referenced_by_attribute]!= undefined)
        {
          Object.keys(data[state.referenced_by_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.referenced_by_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.referenced_by_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: "text"}})}>Add Referenced by Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Referenced by Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderCodes() {
    let state = ((this.props.state: any): ConditionEndState);
    if (!state.codes) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [getTemplate('Type.Code.Snomed')]}})}>Add Codes</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: null}})}>Remove Codes</a>
          <br />
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.referenced_by_attribute != this.state.value)
    {
      this.props.onChange('referenced_by_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.referenced_by_attribute});
    this.setState({lastSubmitted: this.props.state.referenced_by_attribute})
  }
  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class AllergyOnset extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.assign_to_attribute,//'',
      lastSubmitted : this.props.state.assign_to_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.assign_to_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): AllergyOnsetState);
    let encounters = this.props.otherStates.filter((s) => {return s.type === "Encounter"});
    let options = encounters.map((e) => {return {id: e.name, text: e.name}});
    options.unshift({id: '', text: ''})
    let initial_value = (state.target_encounter ? {id: state.target_encounter, text: state.target_encounter} : options[0]);
    let targetEncounter = <RIESelect className='editable-text' value={initial_value} propName={'target_encounter'}  change={this.props.onChange('target_encounter')} options={options} />
    return (
      <div>
        Target Encounter: {targetEncounter}
        <br />
        {this.renderAssignToAttribute()}
        <div className='section'>
          Codes
          <br />
          { state.category == "medication" ? <Codes codes={state.codes} system={"RxNorm"} onChange={this.props.onChange('codes')} /> : <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} /> }
        </div>
        <div>
          <label>Allergy Type:
            <RIESelect className='editable-text'
              propName='allergy_type'
              value={{id: state.allergy_type, text: state.allergy_type}}
              change={this.props.onChange('allergy_type')}
              options={[{id:'allergy', text: 'Allergy'}, {id:'intolerance', text: 'Intolerance'}]}
            />
          </label>
        </div>
        <div>
          <label>Category:
            <RIESelect className='editable-text'
              propName='category'
              value={{id: state.category, text: state.category}}
              change={this.props.onChange('category')}
              options={[{id:'food', text: 'Food'},
                        {id:'medication', text: 'Medication'},
                        {id:'environment', text: 'Environment'}]}
            />
          </label>
        </div>
        <div className='section'>
        Reactions:
        {this.renderReactions(state)}
        <a className='editable-text' onClick={() => this.props.onChange(`reactions[${this.props.state.reactions.length}]`)({val: {id: {reaction: {code: "1234", system: "SNOMED-CT", display: "SNOMED Code"}, possible_severities: [{level: "mild", value: 1}]}}})}>+</a>
        </div>
      </div>
    );
  }

  renderReactions(state) {
    if(state.reactions == null) {
      return null;
    } else {
      return state.reactions.map((r, i) => {
          return (
            <div className='section' key={i}>
              <a className='editable-text delete-button' onClick={() => this.props.onChange(`reactions[${i}]`)({val: {id: null}})}>remove</a>
              <Reaction reaction={r} onChange={this.props.onChange(`reactions[${i}]`)}/>
            </div>
          );
      });
    }
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): AllergyOnsetState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.assign_to_attribute]!= undefined)
        {
          Object.keys(data[state.assign_to_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.assign_to_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.assign_to_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: "text"}})}>Add Assign to Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Assign to Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.assign_to_attribute != this.state.value)
    {
      this.props.onChange('assign_to_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.assign_to_attribute});
    this.setState({lastSubmitted: this.props.state.assign_to_attribute})
  }
  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class AllergyEnd extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.referenced_by_attribute,
      lastSubmitted : this.props.state.referenced_by_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.referenced_by_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): AllergyEndState);
    return (
      <div>
        {this.renderAllergyOnset()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderAllergyOnset() {
    let state = ((this.props.state: any): AllergyEndState);
    let allergyOnset = this.props.otherStates.filter((s) => {return s.type === "AllergyOnset"});
    let options = allergyOnset.map((e) => {return {id: e.name, text: e.name}});
    if (!state.allergy_onset) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('allergy_onset')({val: {id: "text"}})}>Add Allergy Onset</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Allergy Onset: <RIESelect className='editable-text' value={{id: state.allergy_onset, text: state.allergy_onset}} propName={'allergy_onset'}  change={this.props.onChange('allergy_onset')} options={options} />
          <a className='editable-text' onClick={() => this.props.onChange('allergy_onset')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): AllergyEndState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.referenced_by_attribute]!= undefined)
        {
          Object.keys(data[state.referenced_by_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.referenced_by_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.referenced_by_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: "text"}})}>Add Referenced by Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Referenced by Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderCodes() {
    let state = ((this.props.state: any): AllergyEndState);
    if (!state.codes) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [getTemplate('Type.Code.Snomed')]}})}>Add Codes</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: null}})}>Remove Codes</a>
          <br />
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.referenced_by_attribute != this.state.value)
    {
      this.props.onChange('referenced_by_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.referenced_by_attribute});
    this.setState({lastSubmitted: this.props.state.referenced_by_attribute})
  }
  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class MedicationOrder extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChangeReason = this.handleTextChangeReason.bind(this);
    this.handleSubmitReason = this.handleSubmitReason.bind(this);
    this.state = {
      value : this.props.state.assign_to_attribute,
      lastSubmitted : this.props.state.assign_to_attribute,
      displayLabel : true,
      valueReason : this.props.state.reason,
      lastSubmittedReason : this.props.state.reason,
      displayLabelReason : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.assign_to_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): MedicationOrderState);
    return (
      <div>
        {this.renderAssignToAttribute()}
        {this.renderReason()}
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"RxNorm"} onChange={this.props.onChange('codes')} />
          <br />
        </div>
        {this.renderPrescription()}
        {this.renderChronicMed()}
        {this.renderCreateAdministration()}
      </div>
    );
  }

  renderChronicMed() {
    let state = ((this.props.state: any): MedicationOrder);
    return (
      <div>
        <input type="checkbox" checked={state.chronic} onChange={() => this.props.onChange('chronic')({ val: { id: !state.chronic } })} /> Chronic Medication.
      </div>
    );
  }

  renderCreateAdministration() {
    let state = ((this.props.state: any): MedicationOrder);
    return (
      <div>
        <input type="checkbox" checked={state.administration} onChange={() => this.props.onChange('administration')({ val: { id: !state.administration } })} /> Administration of the medication.
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): ConditionOnsetState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.assign_to_attribute]!= undefined)
        {
          Object.keys(data[state.assign_to_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.assign_to_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.assign_to_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: "text"}})}>Add Assign to Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Assign to Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReason() {
    let state = ((this.props.state: any): MedicationOrder);
    if (!state.reason) {
      if( this.state.valueReason !== 'text')
      {
        this.setState({valueReason: 'text'});
      }
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: "Select Condition/Enter Attribute"}})}>Add Reason</a>
          <br />
        </div>
      );
    } else {
      let conditionOnset = this.props.otherStates.filter((s) => {return s.type === "ConditionOnset"});
      let options = conditionOnset.map((e) => {return {id: e.name, text: e.name}});
      let inputAttribute = [{id: "*Input Attribute*", text: "*Input Attribute*"}];
      let allOptions = options.concat(inputAttribute);
      let reason = <RIESelect className='editable-text' value={{id: state.reason, text: state.reason}} propName={'reason'}  change={this.props.onChange('reason')} options={allOptions} />
      if (state.reason === "*Input Attribute*") {
        let displayAttribute;
        if (this.state.displayLabelReason)
        {
          displayAttribute = <label className="editable-text" onClick={this.toggleLabelReason}>{state.reason}</label>

        }
        else
        {
         displayAttribute = <AutoCompleteText onChange={this.handleTextChangeReason} onBlur={this.handleSubmitReason} text={this.state.valueReason} items={Attributes}/>
        }
        return (
          <div>
            Reason: {reason}
            <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
            <br/>
            Attribute: {displayAttribute}
            <br/>
          </div>
        );
      } else {
        return (
          <div>
            Reason: {reason}
            <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
            <br/>
          </div>
        );
      }
    }
  }

  renderPrescription() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('prescription')({val: {id: getTemplate('Attribute.Prescription')}})}>Add Prescription</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Prescription
          {this.renderRefills()}
          {this.renderAsNeeded()}
          {this.renderDosage()}
          {this.renderDuration()}
          {this.renderInstructions()}
          <a className='editable-text' onClick={() => this.props.onChange('prescription')({val: {id: null}})}> Remove Prescription</a>
        </div>
      );
    }
  }

  renderRefills() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription.refills) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('prescription.refills')({val: {id: 1}})}>Add Prescription Refills</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Prescription Refills: <RIENumber className='editable-text' value={state.prescription.refills} propName={'refills'}  change={this.props.onChange('prescription.refills')} />
          <a className='editable-text' onClick={() => this.props.onChange('prescription.refills')({val: {id: null}})}>(remove)</a>
          <br />
        </div>
      );
    }
  }

  renderAsNeeded() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (state.prescription.as_needed == null) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('prescription.as_needed')({val: {id: true}})}>Add Prescription As Needed</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Prescription As Needed
          <a className='editable-text' onClick={() => this.props.onChange('prescription.as_needed')({val: {id: null}})}>(remove)</a>
          <br />
        </div>
      );
    }
  }

  renderDosage() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription.dosage) {
      return null;
    }
    return (
      <div className='section'>
        Dosage Amount: <RIENumber className='editable-text' value={state.prescription.dosage.amount} propName={'amount'}  change={this.props.onChange('prescription.dosage.amount')} />
        <br />
        Dosage Frequency: <RIENumber className='editable-text' value={state.prescription.dosage.frequency} propName={'frequency'}  change={this.props.onChange('prescription.dosage.frequency')} />
        <br />
        Dosage Period: <RIENumber className='editable-text' value={state.prescription.dosage.period} propName={'period'}  change={this.props.onChange('prescription.dosage.period')} />
        <br />
        Dosage Unit: <RIESelect className='editable-text' value={{id: state.prescription.dosage.unit, text: state.prescription.dosage.unit}} propName="unit" change={this.props.onChange('prescription.dosage.unit')} options={unitOfTimeOptions} />
        <br />
      </div>
    );
  }

  renderDuration() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription.duration) {
      return null;
    }
    return (
      <div className='section'>
        Duration Quantity: <RIENumber className='editable-text' value={state.prescription.duration.quantity} propName={'quantity'}  change={this.props.onChange('prescription.duration.quantity')} />
        <br />
        Duration Unit: <RIESelect className='editable-text' value={{id: state.prescription.duration.unit, text: state.prescription.duration.unit}} propName="unit" change={this.props.onChange('prescription.duration.unit')} options={unitOfTimeOptions} />
        <br />
      </div>
    );
  }

  renderInstructions() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription.instructions) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('prescription.instructions')({val: {id: [getTemplate('Type.Code.Snomed')]}})}>Add Instructions</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Instructions
          <br />
          <Codes codes={state.prescription.instructions} system={"SNOMED-CT"} onChange={this.props.onChange('prescription.instructions')} />
          <a className='editable-text' onClick={() => this.props.onChange('prescription.instructions')({val: {id: null}})}>Remove Instructions</a>
          <br />
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});
  }

  handleSubmit(save) {
    if (save && this.props.state.assign_to_attribute != this.state.value)
    {
      this.props.onChange('assign_to_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.assign_to_attribute});
    this.setState({lastSubmitted: this.props.state.assign_to_attribute})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

  handleTextChangeReason(value) {
    this.setState({valueReason: value});

  }

  handleSubmitReason(save) {
    if (save && this.props.state.reason != this.state.valueReason)
    {
      this.props.onChange('reason')({val: this.state.valueReason})
      this.setState({lastSubmittedReason: this.state.valueReason})
    }
    else {
      this.setState({valueReason: this.state.lastSubmittedReason})
    }
    this.toggleLabelReason();
  }

  toggleLabelReason = () =>  {
    this.setState({displayLabelReason: !this.state.displayLabelReason});
  }

}

class MedicationEnd extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.referenced_by_attribute,
      lastSubmitted : this.props.state.referenced_by_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.referenced_by_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): MedicationEndState);
    return (
      <div>
        {this.renderMedicationOrder()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderMedicationOrder() {
    let state = ((this.props.state: any): MedicationEndState);
    let medicationOrder = this.props.otherStates.filter((s) => {return s.type === "MedicationOrder"});
    let options = medicationOrder.map((e) => {return {id: e.name, text: e.name}});
    if (!state.medication_order) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('medication_order')({val: {id: "text"}})}>Add Medication Order</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Medication Order: <RIESelect className='editable-text' value={{id: state.medication_order, text: state.medication_order}} propName={'medication_order'}  change={this.props.onChange('medication_order')} options={options} />
          <a className='editable-text' onClick={() => this.props.onChange('medication_order')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): MedicationEndState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.referenced_by_attribute]!= undefined)
        {
          Object.keys(data[state.referenced_by_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.referenced_by_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.referenced_by_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: "text"}})}>Add Referenced by Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Referenced by Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderCodes() {
    let state = ((this.props.state: any): MedicationEndState);
    if (!state.codes) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [getTemplate('Type.Code.RxNorm')]}})}>Add Codes</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: null}})}>Remove Codes</a>
          <br />
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});
  }

  handleSubmit(save) {
    if (save && this.props.state.referenced_by_attribute != this.state.value)
    {
      this.props.onChange('referenced_by_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.referenced_by_attribute});
    this.setState({lastSubmitted: this.props.state.referenced_by_attribute})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class CarePlanStart extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChangeReason = this.handleTextChangeReason.bind(this);
    this.handleSubmitReason = this.handleSubmitReason.bind(this);
    this.state = {
      value : this.props.state.assign_to_attribute,
      lastSubmitted : this.props.state.assign_to_attribute,
      displayLabel : true,
      valueReason : this.props.state.reason,
      lastSubmittedReason : this.props.state.reason,
      displayLabelReason : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.assign_to_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): CarePlanStartState);
    return (
      <div>
        {this.renderAssignToAttribute()}
        {this.renderReason()}
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <br />
        </div>
        {this.renderActivities()}
        {this.renderGoals()}
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): CarePlanStartState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.assign_to_attribute]!= undefined)
        {
          Object.keys(data[state.assign_to_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.assign_to_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.assign_to_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: "text"}})}>Add Assign to Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Assign to Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReason() {
    let state = ((this.props.state: any): CarePlanStart);
    if (!state.reason) {
      if( this.state.valueReason !== 'text')
      {
        this.setState({valueReason: 'text'});
      }
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: "Select Condition/Enter Attribute"}})}>Add Reason</a>
          <br />
        </div>
      );
    } else {
      let conditionOnset = this.props.otherStates.filter((s) => {return s.type === "ConditionOnset"});
      let options = conditionOnset.map((e) => {return {id: e.name, text: e.name}});
      let inputAttribute = [{id: "*Input Attribute*", text: "*Input Attribute*"}];
      let allOptions = options.concat(inputAttribute);
      let reason = <RIESelect className='editable-text' value={{id: state.reason, text: state.reason}} propName={'reason'}  change={this.props.onChange('reason')} options={allOptions} />
      if (state.reason === "*Input Attribute*") {
        let displayAttribute;

        if (this.state.displayLabelReason)
        {
            displayAttribute = <label className="editable-text" onClick={this.toggleLabelReason}>{state.reason}</label>
        }
        else
        {
         displayAttribute = <AutoCompleteText onChange={this.handleTextChangeReason} onBlur={this.handleSubmitReason} text={this.state.valueReason} items={Attributes}/>
        }
        return (
          <div>
            Reason: {reason}
            <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
            <br/>
            Attribute: {displayAttribute}
            <br/>
          </div>
        );
      } else {
        return (
          <div>
            Reason: {reason}
            <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
            <br/>
          </div>
        );
      }
    }
  }

  renderActivities() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.activities) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('activities')({val: {id: [getTemplate('Type.Code.Snomed')]}})}>Add Activities</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Activities
          <br />
          <Codes codes={state.activities} system={"SNOMED-CT"} onChange={this.props.onChange('activities')} />
          <a className='editable-text' onClick={() => this.props.onChange('activities')({val: {id: null}})}>Remove Activities</a>
          <br />
        </div>
      );
    }
  }

  renderGoals() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.goals) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('goals')({val: {id: [getTemplate('Attribute.Goal')]}})}>Add Goals</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Goals
          <br />
          <Goals goals={state.goals} onChange={this.props.onChange('goals')} />
          <a className='editable-text' onClick={() => this.props.onChange('goals')({val: {id: null}})}>Remove Goals</a>
          <br />
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});
  }

  handleSubmit(save) {
    if (save && this.props.state.assign_to_attribute != this.state.value)
    {
      this.props.onChange('assign_to_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.assign_to_attribute});
    this.setState({lastSubmitted: this.props.state.assign_to_attribute})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }
  handleTextChangeReason(value) {
    this.setState({valueReason: value});

  }

  handleSubmitReason(save) {
    if (save && this.props.state.reason != this.state.valueReason)
    {
      this.props.onChange('reason')({val: this.state.valueReason})
      this.setState({lastSubmittedReason: this.state.valueReason})
    }
    else {
      this.setState({valueReason: this.state.lastSubmittedReason})
    }
    this.toggleLabelReason();
  }

  toggleLabelReason = () =>  {
    this.setState({displayLabelReason: !this.state.displayLabelReason});
  }
}

class CarePlanEnd extends Component<Props> {

  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.referenced_by_attribute,
      lastSubmitted : this.props.state.referenced_by_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.referenced_by_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): CarePlanEndState);
    return (
      <div>
        {this.renderCarePlan()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderCarePlan() {
    let state = ((this.props.state: any): CarePlanEndState);
    let careplans = this.props.otherStates.filter((s) => {return s.type === "CarePlanStart"});
    let options = careplans.map((e) => {return {id: e.name, text: e.name}});
    if (!state.careplan) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('careplan')({val: {id: "text"}})}>Add Care Plan</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Care Plan: <RIESelect className='editable-text' value={{id: state.careplan, text: state.careplan}} propName={'careplan'}  change={this.props.onChange('careplan')} options={options} />
          <a className='editable-text' onClick={() => this.props.onChange('careplan')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): CarePlanEndState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.referenced_by_attribute]!= undefined)
        {
          Object.keys(data[state.referenced_by_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.referenced_by_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.referenced_by_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: "text"}})}>Add Referenced by Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Referenced by Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderCodes() {
    let state = ((this.props.state: any): CarePlanEndState);
    if (!state.codes) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [getTemplate('Type.Code.Snomed')]}})}>Add Codes</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: null}})}>Remove Codes</a>
          <br />
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.referenced_by_attribute != this.state.value)
    {
      this.props.onChange('referenced_by_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.referenced_by_attribute});
    this.setState({lastSubmitted: this.props.state.referenced_by_attribute})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class Procedure extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChangeReason = this.handleTextChangeReason.bind(this);
    this.handleSubmitReason = this.handleSubmitReason.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.assign_to_attribute,//'',
      lastSubmitted : this.props.state.assign_to_attribute,
      displayLabel : true,
      valueReason : this.props.state.reason,
      lastSubmittedReason : this.props.state.reason,
      displayLabelReason : true,
    }
  }

  legacyGMF() {
    let state = ((this.props.state: any): ProcedureState);
    if (state.duration) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let state = ((this.props.state: any): ProcedureState);
    let durationEditor;
    if (this.legacyGMF()) {
      durationEditor = this.renderLegacyDuration();
    } else {
      durationEditor = this.renderDuration();
    }
    return (
      <div>
        {this.renderReason()}
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <br />
        </div>
        {durationEditor}
        {this.renderAssignToAttribute()}
      </div>
    );
  }

  renderReason() {
    let state = ((this.props.state: any): Procedure);
    if (!state.reason) {
      if( this.state.valueReason !== 'text')
      {
        this.setState({valueReason: 'text'});
      }
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: "Select Condition/Enter Attribute"}})}>Add Reason</a>
          <br />
        </div>
      );
    } else {
      let conditionOnset = this.props.otherStates.filter((s) => {return s.type === "ConditionOnset"});
      let options = conditionOnset.map((e) => {return {id: e.name, text: e.name}});
      let inputAttribute = [{id: "*Input Attribute*", text: "*Input Attribute*"}];
      let allOptions = options.concat(inputAttribute);
      let reason = <RIESelect className='editable-text' value={{id: state.reason, text: state.reason}} propName={'reason'}  change={this.props.onChange('reason')} options={allOptions} />
      if (state.reason === "*Input Attribute*") {
        let displayAttribute;

        if (this.state.displayLabelReason)
        {
            displayAttribute = <label className="editable-text" onClick={this.toggleLabelReason}>{state.reason}</label>
        }
        else
        {
         displayAttribute = <AutoCompleteText onChange={this.handleTextChangeReason} onBlur={this.handleSubmitReason} text={this.state.valueReason} items={Attributes}/>
        }
        return (
          <div>
            Reason: {reason}
            <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
            <br/>
            Attribute: {displayAttribute}
            <br/>
          </div>
        );
      } else {
        return (
          <div>
            Reason: {reason}
            <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
            <br/>
          </div>
        );
      }
    }
  }

  renderDuration() {
    let state = ((this.props.state: any): ProcedureState);
    if (state.distribution) {
      return (
        <div>
          <Distribution kind={state.distribution.kind}
                        parameters={state.distribution.parameters}
                        onChange={this.props.onChange('distribution')} />
          Unit: <RIESelect className='editable-text'
                          value={{id: state.unit, text: state.unit}}
                          propName="unit"
                          change={this.props.onChange('unit')}
                          options={unitOfTimeOptions} />
          <br />
          <a className='editable-text' onClick={() => this.props.onChange('distribution')({val: {id: null}})}>(remove)</a>
        </div>
      );
    } else {
      return (
        <div>
          <a className='editable-text' onClick={() => {
            this.props.onChange('distribution')({val: {id: {kind: "UNIFORM", parameters:{low: 30, high: 60}}}});
            this.props.onChange('unit')({val: {id: "minutes"}});
          }}>Add Duration</a>
          <br />
        </div>
      );
    }
  }

  renderLegacyDuration() {
    let state = ((this.props.state: any): ProcedureState);
    if (!state.duration) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('duration')({val: {id: {low: 10, high: 20, unit: 'days'}}})}>Add Duration</a>
          <br />
        </div>
      );
      return null;
    } else {
      return (
        <div className='section'>
          Duration Low: <RIENumber className='editable-text' value={state.duration.low} propName={'low'}  change={this.props.onChange('duration.low')} />
          <br />
          Duration High: <RIENumber className='editable-text' value={state.duration.high} propName={'high'}  change={this.props.onChange('duration.high')} />
          <br />
          Duration Unit: <RIESelect className='editable-text' value={{id: state.duration.unit, text: state.duration.unit}} propName="unit" change={this.props.onChange('duration.unit')} options={unitOfTimeOptions} />
          <br />
          <a className='editable-text' onClick={() => this.props.onChange('duration')({val: {id: null}})}>(remove)</a>
        </div>
      );
    }
  }

  handleTextChangeReason(value) {
    this.setState({valueReason: value});

  }

  handleSubmitReason(save) {
    if (save && this.props.state.reason != this.state.valueReason)
    {
      this.props.onChange('reason')({val: this.state.valueReason})
      this.setState({lastSubmittedReason: this.state.valueReason})
    }
    else {
      this.setState({valueReason: this.state.lastSubmittedReason})
    }
    this.toggleLabelReason();
  }

  toggleLabelReason = () =>  {
    this.setState({displayLabelReason: !this.state.displayLabelReason});
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): ProcedureState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.assign_to_attribute]!= undefined)
        {
          Object.keys(data[state.assign_to_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.assign_to_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.assign_to_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: "text"}})}>Add Assign to Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Assign to Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});
  }

  handleSubmit(save) {
    if (save && this.props.state.assign_to_attribute != this.state.value)
    {
      this.props.onChange('assign_to_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.assign_to_attribute});
    this.setState({lastSubmitted: this.props.state.assign_to_attribute})
  }
  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class Vaccine extends Component<Props> {
  constructor (props) {
    super(props)
  }

  legacyGMF() {
    let state = ((this.props.state: any): VaccineState);
  }

  render() {
    let state = ((this.props.state: any): VaccineState);
    return (
      <div>
        <div className='section'>
          Series: <RIEInput className='editable-text' value={state.series} propName={'series'} change={this.props.onChange('series')} />
          <br />
          Codes
          <br />
          <Codes codes={state.codes} system={"CVX"} onChange={this.props.onChange('codes')} />
          <br />
        </div>
      </div>
    );
  }
}

class VitalSign extends Component<Props> {

  render() {
    let state = ((this.props.state: any): VitalSignState);
    let distroForm;
    if (this.legacyGMF()) {
      distroForm = this.renderExactOrRange();
    } else {
      distroForm = this.renderDistribution();
    }
    return (
      <div>
        Vital Sign: <RIEInput className='editable-text' value={state.vital_sign} propName={'vital_sign'} change={this.props.onChange('vital_sign')} />
        <br/>
        Unit: <RIEInput className='editable-text' value={state.unit} propName={'unit'} change={this.props.onChange('unit')} />
        <br/>
        {distroForm}
      </div>
    );
  }

  legacyGMF() {
    let state = ((this.props.state: any): VitalSignState);
    if (state.exact || state.range) {
      return true;
    } else {
      return false;
    }
  }

  renderDistribution() {
    let state = ((this.props.state: any): SymptomState);
    return (
      <div>
        <Distribution kind={state.distribution.kind}
                      parameters={state.distribution.parameters}
                      onChange={this.props.onChange('distribution')} />
        <br />
      </div>
    );
  }

  renderExactOrRange() {
    let state = ((this.props.state: any): VitalSignState);
    if (state.exact) {
      return (
        <div className='section'>
          Exact Quantity: <RIENumber className='editable-text' value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: getTemplate('Attribute.Range')}}); this.props.onChange('exact')({val: {id: null}})}}>Change to Range</a>
          <br />
        </div>
      );
    }
    else {
      return (
        <div className='section'>
          Range Low: <RIENumber className='editable-text' value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
          <br />
          Range High: <RIENumber className='editable-text' value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: getTemplate('Attribute.Exact')}}); this.props.onChange('range')({val: {id: null}})}}>Change to Exact</a>
          <br />
        </div>
      );
    }
  }

}

class Observation extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.attribute,//'',
      lastSubmitted : this.props.state.attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): ObservationState);
    let options = [
      {id: 'social-history', text: 'social-history'},
      {id: 'vital-signs', text: 'vital-signs'},
      {id: 'imaging', text: 'imaging'},
      {id: 'laboratory', text: 'laboratory'},
      {id: 'procedure', text: 'procedure'},
      {id: 'survey', text: 'survey'},
      {id: 'exam', text: 'exam'},
      {id: 'therapy', text: 'therapy'}
    ];
    return (
      <div>
        Category: <RIESelect className='editable-text' value={{id: state.category, text: state.category}} propName="category" change={this.props.onChange('category')} options={options} />
        <br/>
        Unit: <RIEInput className='editable-text' value={state.unit} propName={'unit'} change={this.props.onChange('unit')} />
        <br/>
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"LOINC"} onChange={this.props.onChange('codes')} />
          <br/>
        </div>
        {this.renderValueContainer()}
      </div>
    );
  }

  legacyGMF() {
    let state = ((this.props.state: any): ObservationState);
    if (state.exact || state.range) {
      return true;
    } else {
      return false;
    }
  }

  renderValueContainer() { // renders exact, range, attribute, or vital_sign
    let state = ((this.props.state: any): ObservationState);
    if (this.legacyGMF() && state.exact) {
      let value = state.exact.quantity;
      if(typeof value === 'boolean'){
        value = String(value);
      }
      return (
        <div className='section'>
          Exact Value: <RIEInput className='editable-text' value={value} propName='quantity' change={this.props.onChange('exact.quantity')} />
          <br />
          { this.renderToggles('exact') }
        </div>
      );
    } else if (this.legacyGMF() && state.range) {
      return (
        <div className='section'>
          Range Low: <RIENumber className='editable-text' value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
          <br />
          Range High: <RIENumber className='editable-text' value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
          <br />
          { this.renderToggles('range') }
        </div>
      );
    } else if (state.distribution) {
      return (
        <Distribution kind={state.distribution.kind}
                      round={state.distribution.round}
                      parameters={state.distribution.parameters}
                      onChange={this.props.onChange('distribution')}
                      otherToggles={this.renderToggles('distribution')} />
      );
    } else if (state.attribute) {
      let displayAttribute;
      if (this.state.displayLabel)
      {
          const data = AttributeData;
          let others = [this.props.moduleName];
          if (data[state.attribute]!= undefined)
          {
            Object.keys(data[state.attribute].read).forEach(i => {others.push(i)})
            Object.keys(data[state.attribute].write).forEach(i => {others.push(i)})
          }
          others = others.filter((x, i, a) => a.indexOf(x) == i)
          others.splice(others.indexOf[this.props.moduleName], 1);

          if (others.length > 0)
          {
            displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.attribute}</label>
            <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
            </span>
          }
          else{
            displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.attribute}</label>
          }

      }
      else
      {
       displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
      }
      return (
        <div className='section'>
          Attribute: {displayAttribute}
          <br/>
          { this.renderToggles('attribute') }
        </div>
      );
    } else if (state.value_code) {
      return (
        <div className='section'>
          <Code code={state.value_code} system={"SNOMED-CT"} onChange={this.props.onChange('value_code')} />
          { this.renderToggles('value_code') }
        </div>
      );
    } else if (state.vital_sign) {
      return (
        <div className='section'>
          Vital Sign: <RIEInput className='editable-text' value={state.vital_sign} propName={'vital_sign'}  change={this.props.onChange('vital_sign')} />
          { this.renderToggles('vital_sign') }
        </div>
      );
    } else if (state.attachment) {
      return (
        <div className='section'>
          Observation Attachments Not Supported.
        </div>
      );
    } else if (state.sampled_data) {
      return (
        <div className='section'>
          Observation Sampled Data Not Supported.
        </div>
      );
    }
  }

  clearProps(...propsToClear) {
    propsToClear.forEach((propName) => {
      this.props.onChange(propName)({val: {id: null}});
    })
  }

  renderToggles(currentItem) {
    console.log(currentItem);

    let toggles = [];

    if (currentItem !== 'exact' && currentItem !== 'distribution') {
      toggles.push(
                <div key='exact'>
                  <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: getTemplate('Attribute.Exact')}}); this.clearProps('range', 'attribute', 'vital_sign', 'value_code', 'distribution')}}>Change to Exact</a>
                  <br />
                </div>
        );
    }

    if (currentItem !== 'range' && currentItem !== 'distribution') {
      toggles.push(
                <div key='range'>
                  <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: getTemplate('Attribute.Range')}}); this.clearProps('exact', 'attribute', 'vital_sign', 'value_code', 'distribution')}}>Change to Range</a>
                  <br />
                </div>
        );
    }

    if (currentItem !== 'attribute') {
      toggles.push(
                <div key='attribute'>
                  <a className='editable-text' onClick={() => {this.props.onChange('attribute')({val: {id: "text"}}); this.clearProps('exact', 'range', 'vital_sign', 'value_code', 'distribution')}}>Change to Attribute</a>
                  <br />
                </div>
        );
    }

    if (currentItem !== 'vital_sign') {
      toggles.push(
                <div key='vital_sign'>
                  <a className='editable-text' onClick={() => {this.props.onChange('vital_sign')({val: {id: "text"}}); this.clearProps('exact', 'range', 'attribute', 'value_code', 'distribution')}}>Change to Vital Sign</a>
                  <br />
                </div>
        );
    }

    if (currentItem !== 'value_code') {
      toggles.push(
                <div key='value_code'>
                  <a className='editable-text' onClick={() => {this.props.onChange('value_code')({val: {id:  getTemplate('Type.Code.Snomed')}}); this.clearProps('exact', 'range', 'attribute', 'vital_sign', 'distribution')}}>Change to Value Code</a>
                  <br />
                </div>
        );
    }

    return toggles;
  }
  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.attribute != this.state.value)
    {
      this.props.onChange('attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.attribute});
    this.setState({lastSubmitted: this.props.state.attribute})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

class MultiObservation extends Component<Props> {

  render() {
    let state = ((this.props.state: any): MultiObservationState);
    let observationCount = (state.observations && state.observations.length) || 0;
    let options = [
      {id: 'social-history', text: 'social-history'},
      {id: 'vital-signs', text: 'vital-signs'},
      {id: 'imaging', text: 'imaging'},
      {id: 'laboratory', text: 'laboratory'},
      {id: 'procedure', text: 'procedure'},
      {id: 'survey', text: 'survey'},
      {id: 'exam', text: 'exam'},
      {id: 'therapy', text: 'therapy'}
    ];
    return (
      <div>
        Category: <RIESelect className='editable-text' value={{id: state.category, text: state.category}} propName="category" change={this.props.onChange('category')} options={options} />
        <br />
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"LOINC"} onChange={this.props.onChange('codes')} />
          <br />
        </div>
        <div className='section'>
          <b>Observations</b>
          <br />
          {state.observations && state.observations.map((observation, i) => {
            return (
              <div className='section' key={i}>
                Observation #{i+1} (<a className='editable-text delete-button' onClick={() => this.props.onChange(`observations.[${i}]`)({val: {id: null}})}>remove</a>)
                <Observation state={observation} onChange={this.props.onChange(`observations.[${i}]`)} />
              </div>
            )
          })}
          <a className='editable-text' onClick={() => this.props.onChange(`observations.[${observationCount}]`)({val: {id: _.cloneDeep(getTemplate('Contained.Observation'))}})}>+</a>
        </div>
      </div>
    );
  }

}

class DiagnosticReport extends Component<Props> {

  render() {
    let state = ((this.props.state: any): DiagnosticReportState);
    let observationCount = (state.observations && state.observations.length) || 0;
    return (
      <div>
        <div className='section'>
          <b>Codes</b>
          <br />
          <Codes codes={state.codes} system={"LOINC"} onChange={this.props.onChange('codes')} />
        </div>
        <div className='section'>
          <b>Observations</b>
          <br />
          {state.observations && state.observations.map((observation, i) => {
            return (
              <div className='section' key={i}>
                Observation #{i+1} (<a className='editable-text delete-button' onClick={() => this.props.onChange(`observations.[${i}]`)({val: {id: null}})}>remove</a>)
                <Observation state={observation} onChange={this.props.onChange(`observations.[${i}]`)} />
              </div>
            )
          })}
        <a className='editable-text' onClick={() => this.props.onChange(`observations.[${observationCount}]`)({val: {id: _.cloneDeep(getTemplate('Contained.Observation'))}})}>+</a>

        </div>
      </div>
    );
  }

}

class ImagingStudy extends Component<Props> {

  render() {
    let state = ((this.props.state: any): ImagingStudyState);
    return (
      <div>
        <div className='section'>
          <b>Procedure Code:</b>
          <Code code={state.procedure_code} system={"SNOMED-CT"} onChange={this.props.onChange('procedure_code')} />
          <br />
        </div>
        <div className='section'>
          <b>Series:</b>
          <br />
          <SeriesList series={state.series} onChange={this.props.onChange('series')} />
          <br />
        </div>
      </div>
    );
  }

}

class Symptom extends Component<Props> {

  render() {
    let state = ((this.props.state: any): SymptomState);
    let distroForm;
    if (this.legacyGMF()) {
      distroForm = this.renderExactOrRange();
    } else {
      distroForm = this.renderDistribution();
    }
    return (
      <div>
        Symptom: <RIEInput className='editable-text' value={state.symptom} propName={'symptom'} change={this.props.onChange('symptom')} />
        <br/>
        {this.renderProbability()}
        {this.renderCause()}
        {distroForm}
      </div>
    );
  }

  renderDistribution() {
    let state = ((this.props.state: any): SymptomState);
    return (
      <div>
        <Distribution kind={state.distribution.kind}
                      parameters={state.distribution.parameters}
                      onChange={this.props.onChange('distribution')} />
        <br />
      </div>
    );
  }

  legacyGMF() {
    let state = ((this.props.state: any): SymptomState);
    if (state.exact || state.range) {
      return true;
    } else {
      return false;
    }
  }

  renderProbability() {
    let state = ((this.props.state: any): SymptomState);
    if (!state.probability) {
      return (
        <div>
          Probability: <RIENumber className='editable-text' value={1} propName={'probability'} editProps={{step: .01, min: 0, max: 1}} change={this.props.onChange('probability')} format={this.formatAsPercentage} validate={this.checkInRange} classInvalid="invalid" />
        </div>
      );
    } else {
      return (
        <div>
          Probability: <RIENumber className='editable-text' value={state.probability} propName={'probability'} editProps={{step: .01, min: 0, max: 1}} change={this.props.onChange('probability')} format={this.formatAsPercentage} validate={this.checkInRange} classInvalid="invalid"/>
        </div>
      );
    }
  }

  checkInRange(num: number) {
    return ((num >= 0) && (num <= 1));
  }

  formatAsPercentage(num: number) {
    return (num * 100) + "%";
  }

  renderCause() {
    let state = ((this.props.state: any): SymptomState);
    if (!state.cause) {
      return (
        <div>
          Cause: <RIEInput className='editable-text' value={this.props.moduleName} propName={'cause'} change={this.props.onChange('cause')} />
          <br/>
        </div>
      );
    } else {
      return (
        <div>
          Cause: <RIEInput className='editable-text' value={state.cause} propName={'cause'} change={this.props.onChange('cause')} />
          <br/>
        </div>
      );
    }
  }

  renderExactOrRange() {
    let state = ((this.props.state: any): SymptomState);
    if (state.exact) {
      return (
        <div className='section'>
          Exact Quantity: <RIENumber className='editable-text' value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: getTemplate('Attribute.Range')}}); this.props.onChange('exact')({val: {id: null}})}}>Change to Range</a>
          <br />
        </div>
      );
    }
    else {
      return (
        <div className='section'>
          Range Low: <RIENumber className='editable-text' value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
          <br />
          Range High: <RIENumber className='editable-text' value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: getTemplate('Attribute.Exact')}}); this.props.onChange('range')({val: {id: null}})}}>Change to Exact</a>
          <br />
        </div>
      );
    }
  }

}

class SupplyList extends Component<Props> {
  render() {
    let state = ((this.props.state: any): SupplyListState);
    let supplyCount = (state.supplies && state.supplies.length) || 0;
    return (
      <div>
        <b>Supplies</b>
        <br />
        {state.supplies && state.supplies.map((supply, i) => {
          return (
            <div className='section' key={i}>
              Supply #{i+1} (<a className='editable-text delete-button' onClick={() => this.props.onChange(`supplies.[${i}]`)({val: {id: null}})}>remove</a>)
              { this.renderSupply(supply, i) }
            </div>
          )
        })}
        <a className='editable-text' onClick={() => this.props.onChange(`supplies.[${supplyCount}]`)({val: {id: _.cloneDeep(getTemplate('Attribute.Supply'))}})}>+</a>
      </div>
    );
  }

  renderSupply(supply, i) {
    const onChange = this.props.onChange(`supplies[${i}]`);
    return (
      <div>
        Quantity: <RIENumber className='editable-text' value={supply.quantity} propName='quantity' change={onChange('quantity')} />
        <br />
        Code:
        <div className='section'>
          <Code code={supply.code} system={"SNOMED-CT"} onChange={onChange('code')} />
        </div>
      </div>
      );
  }
}

class Device extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.assign_to_attribute,//'',
      lastSubmitted : this.props.state.assign_to_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.assign_to_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): DeviceState);

    return (
      <div>
        Code:
        <div className='section'>
          <Code code={state.code} system={"SNOMED-CT"} onChange={this.props.onChange('code')} />
        </div>
        { this.renderManufacturer(state) }
        { this.renderModel(state) }
        { this.renderAssignToAttribute(state) }
      </div>
      );
  }

  renderManufacturer(state) {
    if (state.manufacturer) {
      return (
        <div>
          Manufacturer: <RIEInput className='editable-text' value={state.manufacturer} propName={'manufacturer'} change={this.props.onChange('manufacturer')} /><br/>
        </div>
      );
    } else {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('manufacturer')({val: {id: "text"}})}>Add Manufacturer</a>
          <br />
        </div>
      );
    }
  }

  renderModel(state) {
    if (state.model) {
      return (
        <div>
          Model: <RIEInput className='editable-text' value={state.model} propName={'model'} change={this.props.onChange('model')} /><br/>
        </div>
      );
    } else {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('model')({val: {id: "text"}})}>Add Model</a>
          <br />
        </div>
      );
    }
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): DeviceState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.assign_to_attribute]!= undefined)
        {
          Object.keys(data[state.assign_to_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.assign_to_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.assign_to_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.assign_to_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: "text"}})}>Add Assign to Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Assign to Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});
  }

  handleSubmit(save) {
    if (save && this.props.state.assign_to_attribute != this.state.value)
    {
      this.props.onChange('assign_to_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.assign_to_attribute});
    this.setState({lastSubmitted: this.props.state.assign_to_attribute})
  }
  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }
}

class DeviceEnd extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.referenced_by_attribute,
      lastSubmitted : this.props.state.referenced_by_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.referenced_by_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): DeviceEndState);
    return (
      <div>
        {this.renderDevice()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderDevice() {
    let state = ((this.props.state: any): DeviceEndState);
    let deviceStates = this.props.otherStates.filter((s) => {return s.type === "Device"});
    let options = deviceStates.map((e) => {return {id: e.name, text: e.name}});
    if (options.length === 1) {
      options.unshift({}); // blank to make sure the dropdown works when there's only one choice
    }
    if (!state.device) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('device')({val: {id: "text"}})}>Add Device State</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Device: <RIESelect className='editable-text' value={{id: state.device, text: state.device}} propName={'device'}  change={this.props.onChange('device')} options={options} />
          <a className='editable-text' onClick={() => this.props.onChange('device')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): DeviceEndState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.referenced_by_attribute]!= undefined)
        {
          Object.keys(data[state.referenced_by_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.referenced_by_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.referenced_by_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: "text"}})}>Add Referenced by Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Referenced by Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderCodes() {
    let state = ((this.props.state: any): DeviceEndState);
    if (!state.codes) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [getTemplate('Type.Code.Snomed')]}})}>Add Codes</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: null}})}>Remove Codes</a>
          <br />
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.referenced_by_attribute != this.state.value)
    {
      this.props.onChange('referenced_by_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.referenced_by_attribute});
    this.setState({lastSubmitted: this.props.state.referenced_by_attribute})
  }
  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }
}

class Death extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value : this.props.state.referenced_by_attribute,
      lastSubmitted : this.props.state.referenced_by_attribute,
      displayLabel : true,
    }
  }

  render() {
    // check for undo/redo
    if (this.props.state.referenced_by_attribute != this.state.value && this.state.value == this.state.lastSubmitted)
    {
      this.fixTextBox();
    }
    let state = ((this.props.state: any): DeathState);
    return (
      <div>
        {this.renderExactOrRange()}
        {this.renderCodes()}
        {this.renderConditionOnset()}
        {this.renderReferencedByAttribute()}
      </div>
    );
  }

  renderExactOrRange() {
    let state = ((this.props.state: any): DeathState);
    if (state.exact) {
      return (
        <div className='section'>
          Exact Quantity: <RIENumber className='editable-text' value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
          <br />
          Exact Unit: <RIESelect className='editable-text' value={{id: state.exact.unit, text: state.exact.unit}} propName="unit" change={this.props.onChange('exact.unit')} options={unitOfTimeOptions} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: getTemplate('Attribute.RangeWithUnit')}}); this.props.onChange('exact')({val: {id: null}})}}>Change to Range</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: null}}); this.props.onChange('exact')({val: {id: null}})}}>Remove Exact/Range</a>
          <br />
        </div>
      );
    }
    else if (state.range) {
      return (
        <div className='section'>
          Range Low: <RIENumber className='editable-text' value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
          <br />
          Range High: <RIENumber className='editable-text' value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
          <br />
          Range Unit: <RIESelect className='editable-text' value={{id: state.range.unit, text: state.range.unit}} propName="unit" change={this.props.onChange('range.unit')} options={unitOfTimeOptions} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: getTemplate('Attribute.ExactWithUnit')}}); this.props.onChange('range')({val: {id: null}})}}>Change to Exact</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: null}}); this.props.onChange('exact')({val: {id: null}})}}>Remove Exact/Range</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: getTemplate('Attribute.ExactWithUnit')}}); this.props.onChange('range')({val: {id: null}})}}>Add Exact/Range</a>
          <br />
        </div>
      );
    }
  }

  renderCodes() {
    let state = ((this.props.state: any): DeathState);
    if (!state.codes) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [getTemplate('Type.Code.Snomed')]}})}>Add Codes</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: null}})}>Remove Codes</a>
          <br />
        </div>
      );
    }
  }

  renderConditionOnset() {
    let state = ((this.props.state: any): DeathState);
    let conditionOnset = this.props.otherStates.filter((s) => {return s.type === "ConditionOnset"});
    let options = conditionOnset.map((e) => {return {id: e.name, text: e.name}});
    if (!state.condition_onset) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('condition_onset')({val: {id: "text"}})}>Add Condition Onset</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Condition Onset: <RIESelect className='editable-text' value={{id: state.condition_onset, text: state.condition_onset}} propName={'condition_onset'}  change={this.props.onChange('condition_onset')} options={options} />
          <a className='editable-text' onClick={() => this.props.onChange('condition_onset')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): DeathState);
    let displayAttribute;
    if (this.state.displayLabel)
    {
        const data = AttributeData;
        let others = [this.props.moduleName];
        if (data[state.referenced_by_attribute]!= undefined)
        {
          Object.keys(data[state.referenced_by_attribute].read).forEach(i => {others.push(i)})
          Object.keys(data[state.referenced_by_attribute].write).forEach(i => {others.push(i)})
        }
        others = others.filter((x, i, a) => a.indexOf(x) == i)
        others.splice(others.indexOf[this.props.moduleName], 1);

        if (others.length > 0)
        {
          displayAttribute = <span><label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
          <button className="attribute-button" onClick={this.props.displayAttributes}>See other uses</button>
          </span>
        }
        else{
          displayAttribute = <label className="editable-text" onClick={this.toggleLabel}>{state.referenced_by_attribute}</label>
        }

    }
    else
    {
     displayAttribute = <AutoCompleteText onChange={this.handleTextChange} onBlur={this.handleSubmit} text={this.state.value} items={Attributes}/>
    }
    if (!state.referenced_by_attribute) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: "text"}})}>Add Referenced by Attribute</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Referenced by Attribute: {displayAttribute}
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  handleTextChange(value) {
    this.setState({value: value});

  }

  handleSubmit(save) {
    if (save && this.props.state.referenced_by_attribute != this.state.value)
    {
      this.props.onChange('referenced_by_attribute')({val: this.state.value})
      this.setState({lastSubmitted: this.state.value})
    }
    else {
      this.setState({value: this.state.lastSubmitted})
    }
    this.toggleLabel();
  }

  fixTextBox() {
    this.setState({value: this.props.state.referenced_by_attribute});
    this.setState({lastSubmitted: this.props.state.referenced_by_attribute})
  }

  toggleLabel = () =>  {
    this.setState({displayLabel: !this.state.displayLabel});
  }

}

export default StateEditor;
