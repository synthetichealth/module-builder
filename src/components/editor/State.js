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
  changeType: any
}

class StateEditor extends Component<Props> {

  renderStateType() {
    let props = {...this.props};
    props.state.name |= 'Unnamed Node';
    props.onChange = this.props.onChange(`states.${this.props.state.name}`);
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

    // let typeOptions = [
    //   {id: 'Initial', text: 'Initial'},
    //   {id: 'Terminal', text: 'Terminal'},
    //   {id: 'Simple', text: 'Simple'},
    //   {id: 'Guard', text: 'Guard'},
    //   {id: 'Delay', text: 'Delay'},
    //   {id: 'SetAttribute', text: 'SetAttribute'},
    //   {id: 'Counter', text: 'Counter'},
    //   {id: 'CallSubmodule', text: 'CallSubmodule'},
    //   {id: 'Encounter', text: 'Encounter'},
    //   {id: 'EncounterEnd', text: 'EncounterEnd'},
    //   {id: 'ConditionOnset', text: 'ConditionOnset'},
    //   {id: 'ConditionEnd', text: 'ConditionEnd'},
    //   {id: 'AllergyOnset', text: 'AllergyOnset'},
    //   {id: 'AllergyEnd', text: 'AllergyEnd'},
    //   {id: 'MedicationOrder', text: 'MedicationOrder'},
    //   {id: 'MedicationEnd', text: 'MedicationEnd'},
    //   {id: 'CarePlanStart', text: 'CarePlanStart'},
    //   {id: 'CarePlanEnd', text: 'CarePlanEnd'},
    //   {id: 'Procedure', text: 'Procedure'},
    //   {id: 'VitalSign', text: 'VitalSign'},
    //   {id: 'Observation', text: 'Observation'},
    //   {id: 'MultiObservation', text: 'MultiObservation'},
    //   {id: 'DiagnosticReport', text: 'DiagnosticReport'},
    //   {id: 'Symptom', text: 'Symptom'},
    //   {id: 'Death', text: 'Death'}
    // ]

    let typeOptions = Object.keys(StateTemplates).sort().map((k) => {return {id: k, text: k}});

    return (
        <div className="State">
          State Type: <RIESelect value={{id: this.props.state.type, text: this.props.state.type}} propName='type'change={this.props.changeType} options={typeOptions}/>
          <br/>
          {this.renderStateType()}
          <br />
          <Transition
            options={this.props.otherStates}
            transition={this.props.state.transition}
            onChange={this.props.onChange(`states.${this.props.state.name}`)} />
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
        Exact Unit: <RIEInput value={state.exact.unit} propName='unit' change={this.props.onChange('exact.unit')} />
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
        Range Unit: <RIEInput value={state.range.unit} propName='unit' change={this.props.onChange('range.unit')} />
        <br />
      </label>
    );
  }

}

class SetAttribute extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): SetAttributeState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Counter extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): CounterState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class CallSubmodule extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): CallSubmoduleState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
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
    if (!state.wellness) {
      return null;
    }
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

class ConditionEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): ConditionEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class AllergyOnset extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): AllergyOnsetState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class AllergyEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): AllergyEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
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
    if (!state.prescription.as_needed) {
      return null;
    }
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
        Dosage Unit: <RIEInput value={state.prescription.dosage.unit} propName={'unit'}  change={this.props.onChange('prescription.dosage.unit')} />
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
        Duration Unit: <RIEInput value={state.prescription.duration.unit} propName={'unit'}  change={this.props.onChange('prescription.duration.unit')} />
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

class MedicationEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): MedicationEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class CarePlanStart extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): CarePlanStartState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class CarePlanEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): CarePlanEndState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
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
        Duration Unit: <RIEInput value={state.duration.unit} propName={'unit'}  change={this.props.onChange('duration.unit')} />
        <br />
      </label>
    );
  }

}

class VitalSign extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): VitalSignState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Observation extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): ObservationState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class MultiObservation extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): MultiObservationState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class DiagnosticReport extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): DiagnosticReportState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Symptom extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): SymptomState);
    return (
      <div>
        Name: <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
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
        Exact Unit: <RIEInput value={state.exact.unit} propName='unit' change={this.props.onChange('exact.unit')} />
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
        Range Unit: <RIEInput value={state.range.unit} propName='unit' change={this.props.onChange('range.unit')} />
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
