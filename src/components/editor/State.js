// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber, RIEToggle } from 'riek';
import _ from 'lodash';

import type { State, InitialState, TerminalState, SimpleState, GuardState, DelayState, SetAttributeState, CounterState, CallSubmoduleState, EncounterState, EncounterEndState, ConditionOnsetState, ConditionEndState, AllergyOnsetState, AllergyEndState, MedicationOrderState, MedicationEndState, CarePlanStartState, CarePlanEndState, ProcedureState, VitalSignState, ObservationState, MultiObservationState, DiagnosticReportState, SymptomState, DeathState } from '../../types/State';

import { Code, Codes } from './Code';
import { Goals } from './Goal';
import ConditionalEditor from './Conditional';
import Transition from './Transition';
import { AttributeTemplates, TypeTemplates, StateTemplates } from '../../templates/Templates';
import { BasicTutorial, EditTutorial } from '../../templates/Tutorial';


import './State.css';

type Props = {
  moduleName: string,
  state: State,
  otherStates: State[],
  onChange: any,
  renameNode: any,
  changeType: any,
  addTransition: any,
  helpFunction: any
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
      case "Symptom":
        return <Symptom {...props} />
      case "Death":
        return <Death {...props} />
      default:
        return this.props.state.type
    }
  }

  render() {
    if(!this.props.state) {
      return null;
    }

    let typeOptions = Object.keys(StateTemplates).sort().map((k) => {return {id: k, text: k}});
    const transitionOptions = [
      {id:"Direct" ,text:"Direct"},
      {id:"Distributed" ,text:"Distributed"},
      {id:"Conditional" ,text:"Conditional"},
      {id:"Complex" ,text:"Complex"},
    ]

    const transitionType = (this.props.state.transition||{}).type;
    return (
        <div className="State">
          <h3><RIEInput className='editable-text' className='editable-text' propName={'name'} value={this.props.state.name} change={this.props.renameNode} /></h3>
          State Type: <RIESelect className='editable-text' className='editable-text' value={{id: this.props.state.type, text: this.props.state.type}} propName='type'change={this.props.changeType} options={typeOptions}/>
          <br/>
          <div className="State-Editor">
            {this.renderStateType()}
          </div>
          <br />
          <hr />
          <div>
            <div className="Transition-Type">Transition Type:
              <RIESelect className='editable-text' className='editable-text' value={{id: transitionType, text: transitionType}} propName='transition'change={(e) => this.props.addTransition(e.transition.id)} options={transitionOptions}/>
            </div>
          </div>
          <div className="Transition">
            <Transition
              options={this.props.otherStates.sort((a,b) => a.name > b.name? 1 : -1)}
              transition={this.props.state.transition}
              onChange={this.props.onChange(`states.${this.props.state.name}`)} />
          </div>
            <br/>
            <a className="editable-text delete-button" onClick={() => this.props.onChange(`states.${this.props.state.name}`)({val: {id: null}})}>Remove State</a>
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
        <ConditionalEditor conditional={state.allow} onChange={this.props.onChange('allow')} />
      </div>
    );
  }

}

class Delay extends Component<Props> {

  render() {
    let state = ((this.props.state: any): DelayState);
    return (
      <div>
        {this.renderExactOrRange()}
      </div>
    );
  }

  renderExactOrRange() {
    let state = ((this.props.state: any): DelayState);
    if (state.exact) {
      return (
        <div>
          Exact Quantity: <RIENumber className='editable-text' value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
          <br />
          Exact Unit: <RIESelect className='editable-text' value={{id: state.exact.unit, text: state.exact.unit}} propName="unit" change={this.props.onChange('exact.unit')} options={unitOfTimeOptions} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: _.cloneDeep(AttributeTemplates.RangeWithUnit)}}); this.props.onChange('exact')({val: {id: null}})}}>Change to Range</a>
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
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: _.cloneDeep(AttributeTemplates.ExactWithUnit)}}); this.props.onChange('range')({val: {id: null}})}}>Change to Exact</a>
          <br />
        </div>
      );
    }
  }

}

class SetAttribute extends Component<Props> {

  render() {
    let state = ((this.props.state: any): SetAttributeState);
    return (
      <div>
        Attribute: <RIEInput className='editable-text' value={state.attribute} propName={'attribute'} change={this.props.onChange('attribute')} />
        <br/>
        {this.renderValue()}
      </div>
    );
  }

  renderValue() {
    let state = ((this.props.state: any): SetAttributeState);
    if (state.value == null) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('value')({val: {id: "text"}})}>Add Value</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Value: <RIEInput className='editable-text' value={state.value} propName={'value'} change={this.props.onChange('value')} />
          <a className='editable-text' onClick={() => this.props.onChange('value')({val: {id: null}})}>(remove)</a>
          <br />
        </div>
      );
    }
  }

}

class Counter extends Component<Props> {

  render() {
    let state = ((this.props.state: any): CounterState);
    let options = [
      {id: 'increment', text: 'increment'},
      {id: 'decrement', text: 'decrement'}
    ];
    return (
      <div>
        Attribute: <RIEInput className='editable-text' value={state.attribute} propName={'attribute'} change={this.props.onChange('attribute')} />
        <br/>
        Action: <RIESelect className='editable-text' value={{id: state.action, text: state.action}} propName="action" change={this.props.onChange('action')} options={options} />
      </div>
    );
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

  render() {
    let state = ((this.props.state: any): EncounterState);
    let options = [
      {id: 'emergency', text: 'emergency'},
      {id: 'inpatient', text: 'inpatient'},
      {id: 'ambulatory', text: 'ambulatory'}
    ];
    return (
      <div>
        {this.renderWellness()}
        Encounter Class: <RIESelect className='editable-text' value={{id: state.encounter_class, text: state.encounter_class}} propName="encounter_class" change={this.props.onChange('encounter_class')} options={options} />
        <br />
        {this.renderReason()}
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
        </div>
      </div>
    );
  }

  renderWellness() {
    let state = ((this.props.state: any): EncounterState);
    if (state.wellness == null) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('wellness')({val: {id: true}})}>Add Wellness</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Wellness
          <a className='editable-text' onClick={() => this.props.onChange('wellness')({val: {id: null}})}>(remove)</a>
          <br />
        </div>
      );
    }

  }

  renderReason() {
    let state = ((this.props.state: any): EncounterState);
    if (!state.reason) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: "text"}})}>Add Reason</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Reason: <RIEInput className='editable-text' value={state.reason} propName={'reason'}  change={this.props.onChange('reason')} />
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
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
          <a className='editable-text' onClick={() => this.props.onChange('discharge_disposition')({val: {id: _.cloneDeep(TypeTemplates.Code.Nubc)}})}>Add Discharge Disposition</a>
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

  render() {
    let state = ((this.props.state: any): ConditionOnsetState);
    return (
      <div>
        Target Encounter: <RIEInput className='editable-text' value={state.target_encounter || ''} propName={'target_encounter'} change={this.props.onChange('target_encounter')} />
        <br />
        {this.renderAssignToAttribute()}
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
        </div>
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): ConditionOnsetState);
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
          Assign to Attribute: <RIEInput className='editable-text' value={state.assign_to_attribute} propName={'assign_to_attribute'}  change={this.props.onChange('assign_to_attribute')} />
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

}

class ConditionEnd extends Component<Props> {

  render() {
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
          Condition Onset: <RIEInput className='editable-text' value={state.condition_onset} propName={'condition_onset'}  change={this.props.onChange('condition_onset')} />
          <a className='editable-text' onClick={() => this.props.onChange('condition_onset')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): ConditionEndState);
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
          Referenced by Attribute: <RIEInput className='editable-text' value={state.referenced_by_attribute} propName={'referenced_by_attribute'}  change={this.props.onChange('referenced_by_attribute')} />
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
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [_.cloneDeep(TypeTemplates.Code.Snomed)]}})}>Add Codes</a>
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

}

class AllergyOnset extends Component<Props> {

  render() {
    let state = ((this.props.state: any): AllergyOnsetState);
    return (
      <div>
        Target Encounter: <RIEInput className='editable-text' value={state.target_encounter} propName={'target_encounter'} change={this.props.onChange('target_encounter')} />
        <br />
        {this.renderAssignToAttribute()}
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
        </div>
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): AllergyOnsetState);
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
          Assign to Attribute: <RIEInput className='editable-text' value={state.assign_to_attribute} propName={'assign_to_attribute'}  change={this.props.onChange('assign_to_attribute')} />
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

}

class AllergyEnd extends Component<Props> {

  render() {
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
          Allergy Onset: <RIEInput className='editable-text' value={state.allergy_onset} propName={'allergy_onset'}  change={this.props.onChange('allergy_onset')} />
          <a className='editable-text' onClick={() => this.props.onChange('allergy_onset')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): AllergyEndState);
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
          Referenced by Attribute: <RIEInput className='editable-text' value={state.referenced_by_attribute} propName={'referenced_by_attribute'}  change={this.props.onChange('referenced_by_attribute')} />
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
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [_.cloneDeep(TypeTemplates.Code.Snomed)]}})}>Add Codes</a>
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

}

class MedicationOrder extends Component<Props> {

  render() {
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
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): ConditionOnsetState);
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
          Assign to Attribute: <RIEInput className='editable-text' value={state.assign_to_attribute} propName={'assign_to_attribute'}  change={this.props.onChange('assign_to_attribute')} />
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReason() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.reason) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: "text"}})}>Add Reason</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Reason: <RIEInput className='editable-text' value={state.reason} propName={'reason'}  change={this.props.onChange('reason')} />
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderPrescription() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('prescription')({val: {id: _.cloneDeep(AttributeTemplates.Prescription)}})}>Add Prescription</a>
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
          <a className='editable-text' onClick={() => this.props.onChange('prescription.instructions')({val: {id: [_.cloneDeep(TypeTemplates.Code.Snomed)]}})}>Add Instructions</a>
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

}

class MedicationEnd extends Component<Props> {

  render() {
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
          Medication Order: <RIEInput className='editable-text' value={state.medication_order} propName={'medication_order'}  change={this.props.onChange('medication_order')} />
          <a className='editable-text' onClick={() => this.props.onChange('medication_order')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): MedicationEndState);
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
          Referenced by Attribute: <RIEInput className='editable-text' value={state.referenced_by_attribute} propName={'referenced_by_attribute'}  change={this.props.onChange('referenced_by_attribute')} />
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
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [_.cloneDeep(TypeTemplates.Code.RxNorm)]}})}>Add Codes</a>
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

}

class CarePlanStart extends Component<Props> {

  render() {
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
          Assign to Attribute: <RIEInput className='editable-text' value={state.assign_to_attribute} propName={'assign_to_attribute'}  change={this.props.onChange('assign_to_attribute')} />
          <a className='editable-text' onClick={() => this.props.onChange('assign_to_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReason() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.reason) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: "text"}})}>Add Reason</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Reason: <RIEInput className='editable-text' value={state.reason} propName={'reason'}  change={this.props.onChange('reason')} />
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderActivities() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.activities) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('activities')({val: {id: [_.cloneDeep(TypeTemplates.Code.Snomed)]}})}>Add Activities</a>
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
          <a className='editable-text' onClick={() => this.props.onChange('goals')({val: {id: [_.cloneDeep(AttributeTemplates.Goal)]}})}>Add Goals</a>
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

}

class CarePlanEnd extends Component<Props> {

  render() {
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
          Care Plan: <RIEInput className='editable-text' value={state.careplan} propName={'careplan'}  change={this.props.onChange('careplan')} />
          <a className='editable-text' onClick={() => this.props.onChange('careplan')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): CarePlanEndState);
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
          Referenced by Attribute: <RIEInput className='editable-text' value={state.referenced_by_attribute} propName={'referenced_by_attribute'}  change={this.props.onChange('referenced_by_attribute')} />
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
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [_.cloneDeep(TypeTemplates.Code.Snomed)]}})}>Add Codes</a>
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

}

class Procedure extends Component<Props> {

  render() {
    let state = ((this.props.state: any): ProcedureState);
    return (
      <div>
        {this.renderReason()}
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"SNOMED-CT"} onChange={this.props.onChange('codes')} />
          <br />
        </div>
        {this.renderDuration()}
      </div>
    );
  }

  renderReason() {
    let state = ((this.props.state: any): ProcedureState);
    if (!state.reason) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: "text"}})}>Add Reason</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Reason: <RIEInput className='editable-text' value={state.reason} propName={'reason'}  change={this.props.onChange('reason')} />
          <a className='editable-text' onClick={() => this.props.onChange('reason')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderDuration() {
    let state = ((this.props.state: any): ProcedureState);
    if (!state.duration) {
      return null;
    }
    return (
      <div className='section'>
        Duration Low: <RIENumber className='editable-text' value={state.duration.low} propName={'low'}  change={this.props.onChange('duration.low')} />
        <br />
        Duration High: <RIENumber className='editable-text' value={state.duration.high} propName={'high'}  change={this.props.onChange('duration.high')} />
        <br />
        Duration Unit: <RIESelect className='editable-text' value={{id: state.duration.unit, text: state.duration.unit}} propName="unit" change={this.props.onChange('duration.unit')} options={unitOfTimeOptions} />
        <br />
      </div>
    );
  }

}

class VitalSign extends Component<Props> {

  render() {
    let state = ((this.props.state: any): VitalSignState);
    return (
      <div>
        Vital Sign: <RIEInput className='editable-text' value={state.vital_sign} propName={'vital_sign'} change={this.props.onChange('vital_sign')} />
        <br/>
        Unit: <RIEInput className='editable-text' value={state.unit} propName={'unit'} change={this.props.onChange('unit')} />
        <br/>
        {this.renderExactOrRange()}
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
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: _.cloneDeep(AttributeTemplates.Range)}}); this.props.onChange('exact')({val: {id: null}})}}>Change to Range</a>
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
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: _.cloneDeep(AttributeTemplates.Exact)}}); this.props.onChange('range')({val: {id: null}})}}>Change to Exact</a>
          <br />
        </div>
      );
    }
  }

}

class Observation extends Component<Props> {

  render() {
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

  renderValueContainer() { // renders exact, range, attribute, or vital_sign
    let state = ((this.props.state: any): ObservationState);
    if (state.exact) {
      return (
        <div className='section'>
          Exact Quantity: <RIENumber className='editable-text' value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: _.cloneDeep(AttributeTemplates.Range)}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Range</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('attribute')({val: {id: "text"}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Attribute</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('vital_sign')({val: {id: "text"}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}})}}>Change to Vital Sign</a>
          <br />
        </div>
      );
    } else if (state.range) {
      return (
        <div className='section'>
          Range Low: <RIENumber className='editable-text' value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
          <br />
          Range High: <RIENumber className='editable-text' value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: _.cloneDeep(AttributeTemplates.Exact)}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Exact</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('attribute')({val: {id: "text"}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Attribute</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('vital_sign')({val: {id: "text"}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}})}}>Change to Vital Sign</a>
          <br />
        </div>
      );
    } else if (state.attribute) {
      return (
        <div className='section'>
          Attribute: <RIEInput className='editable-text' value={state.attribute} propName={'attribute'}  change={this.props.onChange('attribute')} />
          <br/>
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: _.cloneDeep(AttributeTemplates.Exact)}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Exact</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: _.cloneDeep(AttributeTemplates.Range)}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Range</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('vital_sign')({val: {id: "text"}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}})}}>Change to Vital Sign</a>
          <br />
        </div>
      );
    } else { // vital_sign
      return (
        <div className='section'>
          Vital Sign: <RIEInput className='editable-text' value={state.vital_sign} propName={'vital_sign'}  change={this.props.onChange('vital_sign')} />
          <br/>
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: _.cloneDeep(AttributeTemplates.Exact)}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Exact</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: _.cloneDeep(AttributeTemplates.Range)}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('attribute')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Range</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('attribute')({val: {id: "text"}}); this.props.onChange('exact')({val: {id: null}}); this.props.onChange('range')({val: {id: null}}); this.props.onChange('vital_sign')({val: {id: null}})}}>Change to Attribute</a>
          <br />
        </div>
      );
    }
  }

}

class MultiObservation extends Component<Props> {

  render() {
    let state = ((this.props.state: any): MultiObservationState);
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
        Number of Observations: <RIENumber className='editable-text' value={state.number_of_observations} propName='number_of_observations' change={this.props.onChange('number_of_observations')} />
        <br />
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"LOINC"} onChange={this.props.onChange('codes')} />
          <br />
        </div>
      </div>
    );
  }

}

class DiagnosticReport extends Component<Props> {

  render() {
    let state = ((this.props.state: any): DiagnosticReportState);
    return (
      <div>
        Number of Observations: <RIENumber className='editable-text' value={state.number_of_observations} propName='number_of_observations' change={this.props.onChange('number_of_observations')} />
        <br />
        <div className='section'>
          Codes
          <br />
          <Codes codes={state.codes} system={"LOINC"} onChange={this.props.onChange('codes')} />
        </div>
      </div>
    );
  }

}

class Symptom extends Component<Props> {

  render() {
    let state = ((this.props.state: any): SymptomState);
    return (
      <div>
        Symptom: <RIEInput className='editable-text' value={state.symptom} propName={'symptom'} change={this.props.onChange('symptom')} />
        <br/>
        {this.renderCause()}
        {this.renderExactOrRange()}
      </div>
    );
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
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: _.cloneDeep(AttributeTemplates.Range)}}); this.props.onChange('exact')({val: {id: null}})}}>Change to Range</a>
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
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: _.cloneDeep(AttributeTemplates.Exact)}}); this.props.onChange('range')({val: {id: null}})}}>Change to Exact</a>
          <br />
        </div>
      );
    }
  }

}

class Death extends Component<Props> {

  render() {
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
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: _.cloneDeep(AttributeTemplates.RangeWithUnit)}}); this.props.onChange('exact')({val: {id: null}})}}>Change to Range</a>
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
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: _.cloneDeep(AttributeTemplates.ExactWithUnit)}}); this.props.onChange('range')({val: {id: null}})}}>Change to Exact</a>
          <br />
          <a className='editable-text' onClick={() => {this.props.onChange('range')({val: {id: null}}); this.props.onChange('exact')({val: {id: null}})}}>Remove Exact/Range</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          <a className='editable-text' onClick={() => {this.props.onChange('exact')({val: {id: _.cloneDeep(AttributeTemplates.ExactWithUnit)}}); this.props.onChange('range')({val: {id: null}})}}>Add Exact/Range</a>
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
          <a className='editable-text' onClick={() => this.props.onChange('codes')({val: {id: [_.cloneDeep(TypeTemplates.Code.Snomed)]}})}>Add Codes</a>
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
          Condition Onset: <RIEInput className='editable-text' value={state.condition_onset} propName={'condition_onset'}  change={this.props.onChange('condition_onset')} />
          <a className='editable-text' onClick={() => this.props.onChange('condition_onset')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): DeathState);
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
          Referenced by Attribute: <RIEInput className='editable-text' value={state.referenced_by_attribute} propName={'referenced_by_attribute'}  change={this.props.onChange('referenced_by_attribute')} />
          <a className='editable-text' onClick={() => this.props.onChange('referenced_by_attribute')({val: {id: null}})}>(remove)</a>
          <br/>
        </div>
      );
    }
  }

}

export default StateEditor;
