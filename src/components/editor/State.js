// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber, RIEToggle } from 'riek';

import type { State, InitialState, TerminalState, SimpleState, GuardState, DelayState, SetAttributeState, CounterState, CallSubmoduleState, EncounterState, EncounterEndState, ConditionOnsetState, ConditionEndState, AllergyOnsetState, AllergyEndState, MedicationOrderState, MedicationEndState, CarePlanStartState, CarePlanEndState, ProcedureState, VitalSignState, ObservationState, MultiObservationState, DiagnosticReportState, SymptomState, DeathState } from '../../types/State';

import { Code, Codes } from './Code';
import ConditionalEditor from './Conditional';
import StringEditor from './String';
import Transition from './Transition';
import {StateTemplates} from '../../templates/Templates';


import './State.css';

type Props = {
  state: State,
  otherStates: State[],
  onChange: any,
  renameNode: any,
  changeType: any,
  addTransition: any
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

    return (
        <div className="State">
          State Type: <RIESelect value={{id: this.props.state.type, text: this.props.state.type}} propName='type'change={this.props.changeType} options={typeOptions}/>
          <br/>
          {this.renderStateType()}
          <br />
          <div>
            <a onClick={() => this.props.addTransition('Direct')}>Direct</a>|
            <a onClick={() => this.props.addTransition('Conditional')}>Conditional</a>|
            <a onClick={() => this.props.addTransition('Distributed')}>Distributed</a>
          </div>
          <Transition
            options={this.props.otherStates}
            transition={this.props.state.transition}
            onChange={this.props.onChange(`states.${this.props.state.name}`)} />
            <br/>
            <button className="btn btn-error" onClick={() => this.props.onChange(`states.${this.props.state.name}`)({val: {id: null}})}>Delete State</button>
        </div>
    )
  }

}

class Initial extends Component<Props> {

  render() {
    let state = ((this.props.state: any): InitialState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Terminal extends Component<Props> {

  render() {
    let state = ((this.props.state: any): TerminalState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Simple extends Component<Props> {

  render() {
    let state = ((this.props.state: any): SimpleState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Guard extends Component<Props> {

  render() {
    let state = ((this.props.state: any): GuardState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
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
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
        {this.renderExact()}
        <br />
        {this.renderRange()}
      </div>
    );
  }

  renderExact() {
    let state = ((this.props.state: any): DelayState);
    if (!state.exact) {
      return null;
    }
    return (
      <label>
        Exact Quantity: <RIENumber value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
        <br />
        Exact Unit: <RIESelect value={{id: state.exact.unit, text: state.exact.unit}} propName="unit" change={this.props.onChange('exact.unit')} options={unitOfTimeOptions} />
        <br />
      </label>
    );
  }

  renderRange() {
    let state = ((this.props.state: any): DelayState);
    if (!state.range) {
      return null;
    }
    return (
      <label>
        Range Low: <RIENumber value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
        <br />
        Range High: <RIENumber value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
        <br />
        Range Unit: <RIESelect value={{id: state.range.unit, text: state.range.unit}} propName="unit" change={this.props.onChange('range.unit')} options={unitOfTimeOptions} />
        <br />
      </label>
    );
  }

}

class SetAttribute extends Component<Props> {

  render() {
    let state = ((this.props.state: any): SetAttributeState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Attribute: <RIEInput value={state.attribute} propName={'attribute'} change={this.props.onChange('attribute')} />
        <br/>
        {this.renderValue()}
      </div>
    );
  }

  renderValue() {
    let state = ((this.props.state: any): SetAttributeState);
    return (
      <label>
        Exact Quantity: <RIEInput value={state.value} propName='value' change={this.props.onChange('value')} />
        <br />
      </label>
    );
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
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Attribute: <RIEInput value={state.attribute} propName={'attribute'} change={this.props.onChange('attribute')} />
        <br/>
        Action: <RIESelect value={{id: state.action, text: state.action}} propName="action" change={this.props.onChange('action')} options={options} />
      </div>
    );
  }

}

class CallSubmodule extends Component<Props> {

  render() {
    let state = ((this.props.state: any): CallSubmoduleState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Submodule: <RIEInput value={state.submodule} propName={'submodule'} change={this.props.onChange('submodule')} />
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
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
        {this.renderWellness()}
        Encounter Class: <RIESelect value={{id: state.encounter_class, text: state.encounter_class}} propName="encounter_class" change={this.props.onChange('encounter_class')} options={options} />
        <br />
        {this.renderReason()}
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
      </div>
    );
  }

  renderWellness() {
    let state = ((this.props.state: any): EncounterState);
    return (
      <label>
        Wellness: <RIEToggle value={state.wellness} propName={'wellness'}  change={this.props.onChange('wellness')} />
        <br />
      </label>
    );
  }

  renderReason() {
    let state = ((this.props.state: any): EncounterState);
    if (!state.reason) {
      return null;
    }
    return (
      <label>
        Reason: <RIEInput value={state.reason} propName={'reason'}  change={this.props.onChange('reason')} />
        <br />
      </label>
    );
  }

}

class EncounterEnd extends Component<Props> {

  render() {
    let state = ((this.props.state: any): EncounterEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
        {this.renderDischargeDisposition()}
      </div>
    );
  }

  renderDischargeDisposition() {
    let state = ((this.props.state: any): EncounterEndState);
    if (!state.discharge_disposition) {
      return null;
    }
    return (
      <label>
        <Code code={state.discharge_disposition} onChange={this.props.onChange('discharge_disposition')} />
        <br />
      </label>
    );
  }

}

class ConditionOnset extends Component<Props> {

  render() {
    let state = ((this.props.state: any): ConditionOnsetState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
        Target Encounter: <RIEInput value={state.target_encounter || ''} propName={'target_encounter'} change={this.props.onChange('target_encounter')} />
        <br />
        {this.renderAssignToAttribute()}
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): ConditionOnsetState);
    if (!state.assign_to_attribute) {
      return null;
    }
    return (
      <label>
        Assign to Attribute: <RIEInput value={state.assign_to_attribute} propName={'assign_to_attribute'} change={this.props.onChange('assign_to_attribute')} />
        <br />
      </label>
    );
  }

}

class ConditionEnd extends Component<Props> {

  render() {
    let state = ((this.props.state: any): ConditionEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        {this.renderConditionOnset()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderConditionOnset() {
    let state = ((this.props.state: any): ConditionEndState);
    if (!state.condition_onset) {
      return null;
    }
    return (
      <label>
        Condition Onset: <RIEInput value={state.condition_onset} propName={'condition_onset'} change={this.props.onChange('condition_onset')} />
        <br />
      </label>
    );
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): ConditionEndState);
    if (!state.referenced_by_attribute) {
      return null;
    }
    return (
      <label>
        Referenced by Attribute: <RIEInput value={state.referenced_by_attribute} propName={'referenced_by_attribute'} change={this.props.onChange('referenced_by_attribute')} />
        <br />
      </label>
    );
  }

  renderCodes() {
    let state = ((this.props.state: any): ConditionEndState);
    if (!state.codes) {
      return null;
    }
    return (
      <label>
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br />
      </label>
    );
  }

}

class AllergyOnset extends Component<Props> {

  render() {
    let state = ((this.props.state: any): AllergyOnsetState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Target Encounter: <RIEInput value={state.target_encounter} propName={'target_encounter'} change={this.props.onChange('target_encounter')} />
        <br />
        {this.renderAssignToAttribute()}
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): AllergyOnsetState);
    if (!state.referenced_by_attribute) {
      return null;
    }
    return (
      <label>
        Referenced by Attribute: <RIEInput value={state.referenced_by_attribute} propName={'referenced_by_attribute'} change={this.props.onChange('referenced_by_attribute')} />
        <br />
      </label>
    );
  }

}

class AllergyEnd extends Component<Props> {

  render() {
    let state = ((this.props.state: any): AllergyEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        {this.renderAllergyOnset()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderAllergyOnset() {
    let state = ((this.props.state: any): AllergyEndState);
    if (!state.allergy_onset) {
      return null;
    }
    return (
      <label>
        Allergy Onset: <RIEInput value={state.allergy_onset} propName={'allergy_onset'} change={this.props.onChange('allergy_onset')} />
        <br />
      </label>
    );
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): AllergyEndState);
    if (!state.referenced_by_attribute) {
      return null;
    }
    return (
      <label>
        Referenced by Attribute: <RIEInput value={state.referenced_by_attribute} propName={'referenced_by_attribute'} change={this.props.onChange('referenced_by_attribute')} />
        <br />
      </label>
    );
  }

  renderCodes() {
    let state = ((this.props.state: any): AllergyEndState);
    if (!state.codes) {
      return null;
    }
    return (
      <label>
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br />
      </label>
    );
  }

}

class MedicationOrder extends Component<Props> {

  render() {
    let state = ((this.props.state: any): MedicationOrderState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
        {this.renderAssignToAttribute()}
        {this.renderReason()}
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br />
        {this.renderPrescription()}
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): ConditionOnsetState);
    if (!state.assign_to_attribute) {
      return null;
    }
    return (
      <label>
        Assign to Attribute: <RIEInput value={state.assign_to_attribute} propName={'assign_to_attribute'} change={this.props.onChange('assign_to_attribute')} />
        <br />
      </label>
    );
  }

  renderReason() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.reason) {
      return null;
    }
    return (
      <label>
        Reason: <RIEInput value={state.reason} propName={'reason'}  change={this.props.onChange('reason')} />
        <br />
      </label>
    );
  }

  renderPrescription() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription) {
      return null;
    }
    return (
      <label>
        {this.renderRefills()}
        {this.renderAsNeeded()}
        {this.renderDosage()}
        {this.renderDuration()}
        {this.renderInstructions()}
      </label>
    );
  }

  renderRefills() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription.refills) {
      return null;
    }
    return (
      <label>
        Prescription Refills: <RIENumber value={state.prescription.refills} propName={'refills'}  change={this.props.onChange('prescription.refills')} />
        <br />
      </label>
    );
  }

  renderAsNeeded() {
    let state = ((this.props.state: any): MedicationOrderState);
    return (
      <label>
        Prescription As Needed: <RIEToggle value={state.prescription.as_needed} propName={'as_needed'}  change={this.props.onChange('prescription.as_needed')} />
        <br />
      </label>
    );
  }

  renderDosage() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription.dosage) {
      return null;
    }
    return (
      <label>
        Dosage Amount: <RIENumber value={state.prescription.dosage.amount} propName={'amount'}  change={this.props.onChange('prescription.dosage.amount')} />
        <br />
        Dosage Frequency: <RIENumber value={state.prescription.dosage.frequency} propName={'frequency'}  change={this.props.onChange('prescription.dosage.frequency')} />
        <br />
        Dosage Period: <RIENumber value={state.prescription.dosage.period} propName={'period'}  change={this.props.onChange('prescription.dosage.period')} />
        <br />
        Dosage Unit: <RIESelect value={{id: state.prescription.dosage.unit, text: state.prescription.dosage.unit}} propName="unit" change={this.props.onChange('prescription.dosage.unit')} options={unitOfTimeOptions} />
        <br />
      </label>
    );
  }

  renderDuration() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription.duration) {
      return null;
    }
    return (
      <label>
        Duration Quantity: <RIENumber value={state.prescription.duration.quantity} propName={'quantity'}  change={this.props.onChange('prescription.duration.quantity')} />
        <br />
        Duration Unit: <RIESelect value={{id: state.prescription.duration.unit, text: state.prescription.duration.unit}} propName="unit" change={this.props.onChange('prescription.duration.unit')} options={unitOfTimeOptions} />
        <br />
      </label>
    );
  }

  renderInstructions() {
    let state = ((this.props.state: any): MedicationOrderState);
    if (!state.prescription.instructions) {
      return null;
    }
    return (
      <label>
        <Codes codes={state.prescription.instructions} onChange={this.props.onChange('prescription.instructions')} />
        <br />
      </label>
    );
  }

}

class MedicationEnd extends Component<Props> {

  render() {
    let state = ((this.props.state: any): MedicationEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        {this.renderMedicationOrder()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderMedicationOrder() {
    let state = ((this.props.state: any): MedicationEndState);
    if (!state.medication_order) {
      return null;
    }
    return (
      <label>
        Medication Order: <RIEInput value={state.medication_order} propName={'medication_order'} change={this.props.onChange('medication_order')} />
        <br />
      </label>
    );
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): MedicationEndState);
    if (!state.referenced_by_attribute) {
      return null;
    }
    return (
      <label>
        Referenced by Attribute: <RIEInput value={state.referenced_by_attribute} propName={'referenced_by_attribute'} change={this.props.onChange('referenced_by_attribute')} />
        <br />
      </label>
    );
  }

  renderCodes() {
    let state = ((this.props.state: any): MedicationEndState);
    if (!state.codes) {
      return null;
    }
    return (
      <label>
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br />
      </label>
    );
  }

}

class CarePlanStart extends Component<Props> {

  render() {
    let state = ((this.props.state: any): CarePlanStartState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        {this.renderAssignToAttribute()}
        {this.renderReason()}
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br/>
        {this.renderActivities()}
        {this.renderGoals()}
      </div>
    );
  }

  renderAssignToAttribute() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.assign_to_attribute) {
      return null;
    }
    return (
      <label>
        Assign to Attribute: <RIEInput value={state.assign_to_attribute} propName={'assign_to_attribute'} change={this.props.onChange('assign_to_attribute')} />
        <br />
      </label>
    );
  }

  renderReason() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.reason) {
      return null;
    }
    return (
      <label>
        Reason: <RIEInput value={state.reason} propName={'reason'}  change={this.props.onChange('reason')} />
        <br />
      </label>
    );
  }

  renderActivities() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.activities) {
      return null;
    }
    return (
      <label>
        <Codes codes={state.activities} onChange={this.props.onChange('activities')} />
        <br />
      </label>
    );
  }

  renderGoals() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.goals) {
      return null;
    }
    return (
      <label>
        {this.renderObservation()}
        {this.renderText()}
        {this.renderAddresses()}
      </label>
    );
  }

  renderObservation() {
    let state = ((this.props.state: any): CarePlanStartState);
    let options = [
      {id: '==' , text: '==' },
      {id: '!=' , text: '!=' },
      {id: "<" , text: "<" },
      {id: "<=" , text: "<=" },
      {id: ">" , text: ">" },
      {id: ">=", text: ">="},
      {id: "is nil", text: "is nil"},
      {id: "is not nil", text: "is not nil"}
    ];
    if (!state.goals.observation) {
      return null;
    }
    return (
      <label>
        <Codes codes={state.goals.observation.codes} onChange={this.props.onChange('goals.observation.codes')} />
        <br />
        Goal Observation Operator: <RIESelect value={{id: state.goals.observation.operator, text: state.goals.observation.operator}} propName="operator" change={this.props.onChange('goals.observation.operator')} options={options} />
        <br/>
        Goal Observation Value: <RIENumber value={state.goals.observation.value} propName={'value'}  change={this.props.onChange('goals.observation.value')} />
        <br/>
      </label>
    );
  }

  renderText() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.goals.text) {
      return null;
    }
    return (
      <label>
        Goal Text: <RIEInput value={state.goals.text} propName={'text'}  change={this.props.onChange('goals.text')} />
        <br />
      </label>
    );
  }

  renderAddresses() {
    let state = ((this.props.state: any): CarePlanStartState);
    if (!state.goals.addresses) {
      return null;
    }
    return (
      <label>
        Goal Addresses: <RIEInput value={state.goals.addresses} propName={'addresses'}  change={this.props.onChange('goals.addresses')} />
        <br />
      </label>
    );
  }

}

class CarePlanEnd extends Component<Props> {

  render() {
    let state = ((this.props.state: any): CarePlanEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        {this.renderCarePlan()}
        {this.renderReferencedByAttribute()}
        {this.renderCodes()}
      </div>
    );
  }

  renderCarePlan() {
    let state = ((this.props.state: any): CarePlanEndState);
    if (!state.careplan) {
      return null;
    }
    return (
      <label>
        Care Plan: <RIEInput value={state.careplan} propName={'careplan'} change={this.props.onChange('careplan')} />
        <br />
      </label>
    );
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): CarePlanEndState);
    if (!state.referenced_by_attribute) {
      return null;
    }
    return (
      <label>
        Referenced by Attribute: <RIEInput value={state.referenced_by_attribute} propName={'referenced_by_attribute'} change={this.props.onChange('referenced_by_attribute')} />
        <br />
      </label>
    );
  }

  renderCodes() {
    let state = ((this.props.state: any): CarePlanEndState);
    if (!state.codes) {
      return null;
    }
    return (
      <label>
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br />
      </label>
    );
  }

}

class Procedure extends Component<Props> {

  render() {
    let state = ((this.props.state: any): ProcedureState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
        {this.renderReason()}
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br />
        {this.renderDuration()}
      </div>
    );
  }

  renderReason() {
    let state = ((this.props.state: any): ProcedureState);
    if (!state.reason) {
      return null;
    }
    return (
      <label>
        Reason: <RIEInput value={state.reason} propName={'reason'}  change={this.props.onChange('reason')} />
        <br />
      </label>
    );
  }

  renderDuration() {
    let state = ((this.props.state: any): ProcedureState);
    if (!state.duration) {
      return null;
    }
    return (
      <label>
        Duration Low: <RIENumber value={state.duration.low} propName={'low'}  change={this.props.onChange('duration.low')} />
        <br />
        Duration High: <RIENumber value={state.duration.high} propName={'high'}  change={this.props.onChange('duration.high')} />
        <br />
        Duration Unit: <RIESelect value={{id: state.duration.unit, text: state.duration.unit}} propName="unit" change={this.props.onChange('duration.unit')} options={unitOfTimeOptions} />
        <br />
      </label>
    );
  }

}

class VitalSign extends Component<Props> {

  render() {
    let state = ((this.props.state: any): VitalSignState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Vital Sign: <RIEInput value={state.vital_sign} propName={'vital_sign'} change={this.props.onChange('vital_sign')} />
        <br/>
        Unit: <RIEInput value={state.unit} propName={'unit'} change={this.props.onChange('unit')} />
        <br/>
        {this.renderExact()}
        {this.renderRange()}
      </div>
    );
  }

  renderExact() {
    let state = ((this.props.state: any): VitalSignState);
    if (!state.exact) {
      return null;
    }
    return (
      <label>
        Exact Quantity: <RIENumber value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
        <br />
      </label>
    );
  }

  renderRange() {
    let state = ((this.props.state: any): VitalSignState);
    if (!state.range) {
      return null;
    }
    return (
      <label>
        Range Low: <RIENumber value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
        <br />
        Range High: <RIENumber value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
        <br />
      </label>
    );
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
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Category: <RIESelect value={{id: state.category, text: state.category}} propName="category" change={this.props.onChange('category')} options={options} />
        <br/>
        Unit: <RIEInput value={state.unit} propName={'unit'} change={this.props.onChange('unit')} />
        <br/>
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br/>
        {this.renderExact()}
        {this.renderRange()}
        {this.renderAttribute()}
        {this.renderVitalSign()}
      </div>
    );
  }

  renderExact() {
    let state = ((this.props.state: any): ObservationState);
    if (!state.exact) {
      return null;
    }
    return (
      <label>
        Exact Quantity: <RIENumber value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
        <br />
      </label>
    );
  }

  renderRange() {
    let state = ((this.props.state: any): ObservationState);
    if (!state.range) {
      return null;
    }
    return (
      <label>
        Range Low: <RIENumber value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
        <br />
        Range High: <RIENumber value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
        <br />
      </label>
    );
  }

  renderAttribute() {
    let state = ((this.props.state: any): ObservationState);
    if (!state.attribute) {
      return null;
    }
    return (
      <label>
        Attribute: <RIEInput value={state.attribute} propName={'attribute'} change={this.props.onChange('attribute')} />
        <br/>
      </label>
    );
  }

  renderVitalSign() {
    let state = ((this.props.state: any): ObservationState);
    if (!state.vital_sign) {
      return null;
    }
    return (
      <label>
        Vital Sign: <RIEInput value={state.vital_sign} propName={'vital_sign'} change={this.props.onChange('vital_sign')} />
        <br/>
      </label>
    );
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
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Category: <RIESelect value={{id: state.category, text: state.category}} propName="category" change={this.props.onChange('category')} options={options} />
        <br/>
        Number of Observations: <RIENumber value={state.number_of_observations} propName='number_of_observations' change={this.props.onChange('number_of_observations')} />
        <br/>
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br/>
      </div>
    );
  }

}

class DiagnosticReport extends Component<Props> {

  render() {
    let state = ((this.props.state: any): DiagnosticReportState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Number of Observations: <RIENumber value={state.number_of_observations} propName='number_of_observations' change={this.props.onChange('number_of_observations')} />
        <br/>
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
      </div>
    );
  }

}

class Symptom extends Component<Props> {

  render() {
    let state = ((this.props.state: any): SymptomState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br/>
        Symptom: <RIEInput value={state.symptom} propName={'symptom'} change={this.props.onChange('symptom')} />
        <br/>
        {this.renderCause()}
        {this.renderExact()}
        {this.renderRange()}
      </div>
    );
  }

  renderCause() {
    let state = ((this.props.state: any): SymptomState);
    if (!state.cause) {
      return null;
    }
    return (
      <label>
        Cause: <RIEInput value={state.cause} propName={'cause'} change={this.props.onChange('cause')} />
        <br/>
      </label>
    );
  }

  renderExact() {
    let state = ((this.props.state: any): SymptomState);
    if (!state.exact) {
      return null;
    }
    return (
      <label>
        Exact Quantity: <RIENumber value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
        <br />
      </label>
    );
  }

  renderRange() {
    let state = ((this.props.state: any): SymptomState);
    if (!state.range) {
      return null;
    }
    return (
      <label>
        Range Low: <RIENumber value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
        <br />
        Range High: <RIENumber value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
        <br />
      </label>
    );
  }

}

class Death extends Component<Props> {

  render() {
    let state = ((this.props.state: any): DeathState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
        {this.renderExact()}
        {this.renderRange()}
        {this.renderCodes()}
        {this.renderConditionOnset()}
        {this.renderReferencedByAttribute()}
      </div>
    );
  }

  renderExact() {
    let state = ((this.props.state: any): DeathState);
    if (!state.exact) {
      return null;
    }
    return (
      <label>
        Exact Quantity: <RIENumber value={state.exact.quantity} propName='quantity' change={this.props.onChange('exact.quantity')} />
        <br />
        Exact Unit: <RIESelect value={{id: state.exact.unit, text: state.exact.unit}} propName="unit" change={this.props.onChange('exact.unit')} options={unitOfTimeOptions} />
        <br />
      </label>
    );
  }

  renderRange() {
    let state = ((this.props.state: any): DeathState);
    if (!state.range) {
      return null;
    }
    return (
      <label>
        Range Low: <RIENumber value={state.range.low} propName='low' change={this.props.onChange('range.low')} />
        <br />
        Range High: <RIENumber value={state.range.high} propName='high' change={this.props.onChange('range.high')} />
        <br />
        Range Unit: <RIESelect value={{id: state.range.unit, text: state.range.unit}} propName="unit" change={this.props.onChange('range.unit')} options={unitOfTimeOptions} />
        <br />
      </label>
    );
  }

  renderCodes() {
    let state = ((this.props.state: any): DeathState);
    if (!state.codes) {
      return null;
    }
    return (
      <label>
        <Codes codes={state.codes} onChange={this.props.onChange('codes')} />
        <br />
      </label>
    );
  }

  renderConditionOnset() {
    let state = ((this.props.state: any): DeathState);
    if (!state.condition_onset) {
      return null;
    }
    return (
      <label>
        Condition Onset: <RIEInput value={state.condition_onset} propName={'condition_onset'} change={this.props.onChange('condition_onset')} />
        <br />
      </label>
    );
  }

  renderReferencedByAttribute() {
    let state = ((this.props.state: any): DeathState);
    if (!state.referenced_by_attribute) {
      return null;
    }
    return (
      <label>
        Referenced by Attribute: <RIEInput value={state.referenced_by_attribute} propName={'referenced_by_attribute'} change={this.props.onChange('referenced_by_attribute')} />
        <br />
      </label>
    );
  }

}

export default StateEditor;
