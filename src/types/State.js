// @flow
import type { DirectTransition, DistributedTransition, ConditionalTransition, ComplexTransition } from './Transition';
import type { Conditional } from './Conditional';
import type { Code } from './Code';

export type BaseState = BaseState & {
  transition?: DirectTransition | DistributedTransition | ConditionalTransition | ComplexTransition
}

export type InitialState = BaseState & {
  type: 'Initial'
}

export type TerminalState = BaseState & {
  type: 'Terminal'
}

export type SimpleState = BaseState & {
  type: 'Simple'
}

export type GuardState = BaseState & {
  type: 'Guard',
  allow: Conditional
}

export type DelayState = BaseState & {
  type: 'Delay',
  exact?: {
    quantity: number,
    unit: string
  },
  range?: {
    low: number,
    high: number,
    unit: string
  }
}

export type SetAttributeState = BaseState & {
  type: 'SetAttribute',
  attribute: string,
  value?: number | boolean | string
}

export type CounterState = BaseState & {
  type: 'Counter',
  attribute: string,
  action: 'increment' | 'decrement'
}

export type CallSubmoduleState = BaseState & {
  type: 'CallSubmodule',
  submodule: string
}

export type EncounterState = BaseState & {
  type: 'Encounter',
  wellness?: boolean,
  encounter_class: 'emergency' | 'inpatient' | 'ambulatory',
  reason?: string,
  codes: Code[]
}

export type EncounterEndState = BaseState & {
  type: 'EncounterEnd',
  discharge_disposition?: Code
}

export type ConditionOnsetState = BaseState & {
  type: 'ConditionOnset',
  target_encounter: string,
  assign_to_attribute?: string,
  codes: Code[]
}

export type ConditionEndState = BaseState & {
  type: 'ConditionEnd',
  condition_onset?: string,
  referenced_by_attribute?: string,
  codes?: Code[]
}

export type AllergyOnsetState = BaseState & {
  type: 'AllergyOnset',
  target_encounter: string,
  assign_to_attribute?: string,
  codes: Code[]
}

export type AllergyEndState = BaseState & {
  type: 'AllergyEnd',
  allergy_onset?: string,
  referenced_by_attribute?: string,
  codes?: Code[]
}

export type MedicationOrderState = BaseState & {
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
      unit: string
    },
    duration: {
      quantity: number,
      unit: string
    },
    instructions?: Code[]
  }
}

export type MedicationEndState = BaseState & {
  type: 'MedicationEnd',
  medication_order?: string,
  referenced_by_attribute?: string,
  codes?: Code[]
}

export type CarePlanStartState = BaseState & {
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
  }
}

export type CarePlanEndState = BaseState & {
  type: 'CarePlanEnd',
  careplan?: string,
  referenced_by_attribute?: string,
  codes?: Code[]
}

export type ProcedureState = BaseState & {
  type: 'Procedure',
  reason?: string,
  codes: Code[],
  duration: {
    low: number,
    high: number,
    unit: string
  }
}

export type VitalSignState = BaseState & {
  type: 'VitalSign',
  vital_sign: string,
  unit: string,
  exact?: {
    quantity: number
  },
  range?: {
    low: number,
    high: number
  }
}

export type ObservationState = BaseState & {
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
  vital_sign?: string
}

export type MultiObservationState = BaseState & {
  type: 'MultiObservation',
  category: string,
  number_of_observations: number,
  codes: Code[]
}

export type DiagnosticReportState = BaseState & {
  type: 'DiagnosticReport',
  number_of_observations: number,
  codes: Code[]
}

export type SymptomState = BaseState & {
  type: 'Symptom',
  symptom: string,
  cause: string,
  exact?: {
    quantity: number
  },
  range?: {
    low: number,
    high: number
  }
}

export type DeathState = BaseState & {
  type: 'Death',
  exact?: {
    quantity: number,
    unit: string
  },
  range?: {
    low: number,
    high: number,
    unit: string
  },
  codes?: Code[],
  condition_onset?: string,
  referenced_by_attribute?: string
}

export type State = InitialState | TerminalState | SimpleState | GuardState | DelayState | SetAttributeState | CounterState | CallSubmoduleState | EncounterState | EncounterEndState | ConditionOnsetState | ConditionEndState | AllergyOnsetState | AllergyEndState | MedicationOrderState | MedicationEndState | CarePlanStartState | CarePlanEndState | ProcedureState | VitalSignState | ObservationState | MultiObservationState | DiagnosticReportState | SymptomState | DeathState;
