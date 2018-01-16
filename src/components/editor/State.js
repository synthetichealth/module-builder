// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';

import type { State, InitialState, TerminalState, SimpleState, GuardState, DelayState, SetAttributeState, CounterState, CallSubmoduleState, EncounterState, EncounterEndState, ConditionOnsetState, ConditionEndState, AllergyOnsetState, AllergyEndState, MedicationOrderState, MedicationEndState, CarePlanStartState, CarePlanEndState, ProcedureState, VitalSignState, ObservationState, MultiObservationState, DiagnosticReportState, SymptomState, DeathState } from '../../types/State';

import ConditionalEditor from './Conditional';
import StringEditor from './String';
import Transition from './Transition';

type Props = {
  state: State,
  otherStates: State[],
  onChange: any,
  renameNode: any
}

class StateEditor extends Component<Props> {

  renderStateType() {
    switch (this.props.state.type) {
      case "Initial":
        return <Initial {...this.props} />
      case "Terminal":
        return <Terminal {...this.props} />
      case "Simple":
        return <Simple {...this.props} />
      case "Guard":
        return <Guard {...this.props} />
      case "Delay":
        return <Delay {...this.props} />
      case "SetAttribute":
        return <SetAttribute {...this.props} />
      case "Counter":
        return <Counter {...this.props} />
      case "CallSubmodule":
        return <CallSubmodule {...this.props} />
      case "Encounter":
        return <Encounter {...this.props} />
      case "EncounterEnd":
        return <EncounterEnd {...this.props} />
      case "ConditionOnset":
        return <ConditionOnset {...this.props} />
      case "ConditionEnd":
        return <ConditionEnd {...this.props} />
      case "AllergyOnset":
        return <AllergyOnset {...this.props} />
      case "AllergyEnd":
        return <AllergyEnd {...this.props} />
      case "MedicationOrder":
        return <MedicationOrder {...this.props} />
      case "MedicationEnd":
        return <MedicationEnd {...this.props} />
      case "CarePlanStart":
        return <CarePlanStart {...this.props} />
      case "CarePlanEnd":
        return <CarePlanEnd {...this.props} />
      case "Procedure":
        return <Procedure {...this.props} />
      case "VitalSign":
        return <VitalSign {...this.props} />
      case "Observation":
        return <Observation {...this.props} />
      case "MultiObservation":
        return <MultiObservation {...this.props} />
      case "DiagnosticReport":
        return <DiagnosticReport {...this.props} />
      case "Symptom":
        return <Symptom {...this.props} />
      case "Death":
        return <Death {...this.props} />
      default:
        return this.props.state.type
    }
  }

  render() {
    if(!this.props.state) {
      return null;
    }
    return (
        <div>
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
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Terminal extends Component<Props> {

  render() {
    let state = ((this.props.state: any): TerminalState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Simple extends Component<Props> {

  render() {
    let state = ((this.props.state: any): SimpleState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Guard extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): GuardState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <ConditionalEditor conditional={state.allow} onChange={this.props.onChange('allow')} />
      </div>
    );
  }

}

class Delay extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): DelayState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class SetAttribute extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): SetAttributeState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
        <br />
      </div>
    );
  }

}

class Counter extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): CounterState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class CallSubmodule extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): CallSubmoduleState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Encounter extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): EncounterState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class EncounterEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): EncounterEndState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class ConditionOnset extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): ConditionOnsetState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class ConditionEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): ConditionEndState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class AllergyOnset extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): AllergyOnsetState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class AllergyEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): AllergyEndState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class MedicationOrder extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): MedicationOrderState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class MedicationEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): MedicationEndState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class CarePlanStart extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): CarePlanStartState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class CarePlanEnd extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): CarePlanEndState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Procedure extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): ProcedureState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class VitalSign extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): VitalSignState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Observation extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): ObservationState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class MultiObservation extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): MultiObservationState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class DiagnosticReport extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): DiagnosticReportState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Symptom extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): SymptomState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

class Death extends Component<Props> { // TODO

  render() {
    let state = ((this.props.state: any): DeathState);
    return (
      <div>
        <RIEInput propName={'name'} value={state.name} change={this.props.renameNode} />
      </div>
    );
  }

}

export default StateEditor;
