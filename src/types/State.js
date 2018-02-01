// @flow
import type { Transition } from './Transition';
import type { Conditional } from './Conditional';
import type { Code } from './Code';
import type { UnitOfTime } from './Units';

export type InitialState = {
  name: string,
  type: 'Initial',
  transition?: Transition
}

export type TerminalState = {
  name: string,
  type: 'Terminal',
  transition?: Transition
}

export type SimpleState = {
  name: string,
  type: 'Simple',
  transition?: Transition
}

export type GuardState = {
  name: string,
  type: 'Guard',
  allow: Conditional,
  transition?: Transition
}

export type DelayState = {
  name: string,
  type: 'Delay',
  exact?: {
    quantity: number,
    unit: UnitOfTime
  },
  range?: {
    low: number,
    high: number,
    unit: UnitOfTime
  },
  transition?: Transition
}

export type SetAttributeState = {
  name: string,
  type: 'SetAttribute',
  attribute: string,
  value?: number | boolean | string,
  transition?: Transition
}

export type CounterState = {
  name: string,
  type: 'Counter',
  attribute: string,
  action: 'increment' | 'decrement',
  transition?: Transition
}

export type CallSubmoduleState = {
  name: string,
  type: 'CallSubmodule',
  submodule: string,
  transition?: Transition
}

export type EncounterState = {
  name: string,
  type: 'Encounter',
  wellness?: boolean,
  encounter_class: 'emergency' | 'inpatient' | 'ambulatory',
  reason?: string,
  codes: Code[],
  transition?: Transition
}

export type EncounterEndState = {
  name: string,
  type: 'EncounterEnd',
  discharge_disposition?: Code,
  transition?: Transition
}

export type ConditionOnsetState = {
  name: string,
  type: 'ConditionOnset',
  target_encounter: string,
  assign_to_attribute?: string,
  codes: Code[],
  transition?: Transition
}

export type ConditionEndState = {
  name: string,
  type: 'ConditionEnd',
  condition_onset?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition
}

export type AllergyOnsetState = {
  name: string,
  type: 'AllergyOnset',
  target_encounter: string,
  assign_to_attribute?: string,
  codes: Code[],
  transition?: Transition
}

export type AllergyEndState = {
  name: string,
  type: 'AllergyEnd',
  allergy_onset?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition
}

export type MedicationOrderState = {
  name: string,
  type: 'MedicationOrder',
  assign_to_attribute?: string,
  reason?: string,
  codes: Code[],
  prescription?: {
    refills?: number,
    as_needed?: boolean,
    dosage: {
      amount: number,
      frequency: number,
      period: number,
      unit: UnitOfTime
    },
    duration: {
      quantity: number,
      unit: UnitOfTime
    },
    instructions?: Code[]
  },
  transition?: Transition
}

export type MedicationEndState = {
  name: string,
  type: 'MedicationEnd',
  medication_order?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition
}

export type CarePlanStartState = {
  name: string,
  type: 'CarePlanStart',
  assign_to_attribute?: string,
  reason?: string,
  codes: Code[],
  activities?: Code[],
  goals?: {
    observation?: {
      codes: Code[],
      operator: '==' | '!=' | "<" | "<=" | ">" | ">=" | "is nil" | "is not nil",
      value: number
    },
    text?: string,
    addresses: string[]
  },
  transition?: Transition
}

export type CarePlanEndState = {
  name: string,
  type: 'CarePlanEnd',
  careplan?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition
}

export type ProcedureState = {
  name: string,
  type: 'Procedure',
  reason?: string,
  codes: Code[],
  duration: {
    low: number,
    high: number,
    unit: UnitOfTime
  },
  transition?: Transition
}

export type VitalSignState = {
  name: string,
  type: 'VitalSign',
  vital_sign: string,
  unit: string,
  exact?: {
    quantity: number
  },
  range?: {
    low: number,
    high: number
  },
  transition?: Transition
}

export type ObservationState = {
  name: string,
  type: 'Observation',
  category: string,
  unit: string,
  codes: Code[],
  exact?: {
    quantity: number
  },
  range?: {
    low: number,
    high: number
  },
  attribute?: string,
  vital_sign?: string,
  transition?: Transition
}

export type MultiObservationState = {
  name: string,
  type: 'MultiObservation',
  category: string,
  number_of_observations: number,
  codes: Code[],
  transition?: Transition
}

export type DiagnosticReportState = {
  name: string,
  type: 'DiagnosticReport',
  number_of_observations: number,
  codes: Code[],
  transition?: Transition
}

export type SymptomState = {
  name: string,
  type: 'Symptom',
  symptom: string,
  cause: string, // TODO implement setting equal to module name if missing
  exact?: {
    quantity: number
  },
  range?: {
    low: number,
    high: number
  },
  transition?: Transition
}

export type DeathState = {
  name: string,
  type: 'Death',
  exact?: {
    quantity: number,
    unit: UnitOfTime
  },
  range?: {
    low: number,
    high: number,
    unit: UnitOfTime
  },
  codes?: Code[],
  condition_onset?: string,
  referenced_by_attribute?: string,
  transition?: Transition
}

export type State = InitialState | TerminalState | SimpleState | GuardState | DelayState | SetAttributeState | CounterState | CallSubmoduleState | EncounterState | EncounterEndState | ConditionOnsetState | ConditionEndState | AllergyOnsetState | AllergyEndState | MedicationOrderState | MedicationEndState | CarePlanStartState | CarePlanEndState | ProcedureState | VitalSignState | ObservationState | MultiObservationState | DiagnosticReportState | SymptomState | DeathState;
