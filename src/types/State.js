// @flow
import type { Transition } from "./Transition";
import type { Conditional } from "./Conditional";
import type { Code } from "./Code";
import type { Goal, Series, Supply } from "./Attributes";
import type { UnitOfTime } from "./Units";

export type InitialState = {
  name: string,
  remarks: string[],
  type: "Initial",
  transition?: Transition,
};

export type TerminalState = {
  name: string,
  remarks: string[],
  type: "Terminal",
  transition?: Transition,
};

export type SimpleState = {
  name: string,
  remarks: string[],
  type: "Simple",
  transition?: Transition,
};

export type GuardState = {
  name: string,
  remarks: string[],
  type: "Guard",
  allow: Conditional,
  transition?: Transition,
};

export type DelayState = {
  name: string,
  remarks: string[],
  type: "Delay",
  exact?: {
    quantity: number,
    unit: UnitOfTime,
  },
  range?: {
    low: number,
    high: number,
    unit: UnitOfTime,
  },
  transition?: Transition,
};

export type SetAttributeState = {
  name: string,
  remarks: string[],
  type: "SetAttribute",
  attribute: string,
  value?: number | boolean | string,
  range?: {
    low: number,
    high: number,
  },
  transition?: Transition,
};

export type CounterState = {
  name: string,
  remarks: string[],
  type: "Counter",
  attribute: string,
  action: "increment" | "decrement",
  transition?: Transition,
};

export type CallSubmoduleState = {
  name: string,
  remarks: string[],
  type: "CallSubmodule",
  submodule: string,
  transition?: Transition,
};

export type EncounterState = {
  name: string,
  remarks: string[],
  type: "Encounter",
  wellness?: boolean,
  encounter_class: "emergency" | "inpatient" | "ambulatory",
  encounter_status:
    | "planned"
    | "arrived"
    | "triaged"
    | "in-progress"
    | "onleave"
    | "finished"
    | "cancelled"
    | "entered-in-error"
    | "unknown",
  reason?: string,
  codes: Code[],
  duration: {
    low: number,
    high: number,
    unit: UnitOfTime,
  },
  transition?: Transition,
};

export type EncounterEndState = {
  name: string,
  remarks: string[],
  type: "EncounterEnd",
  discharge_disposition?: Code,
  transition?: Transition,
};

export type ConditionOnsetState = {
  name: string,
  remarks: string[],
  type: "ConditionOnset",
  target_encounter: string,
  assign_to_attribute?: string,
  codes: Code[],
  transition?: Transition,
};

export type ConditionEndState = {
  name: string,
  remarks: string[],
  type: "ConditionEnd",
  condition_onset?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition,
};

export type AllergyOnsetState = {
  name: string,
  remarks: string[],
  type: "AllergyOnset",
  target_encounter: string,
  assign_to_attribute?: string,
  codes: Code[],
  transition?: Transition,
};

export type AllergyEndState = {
  name: string,
  remarks: string[],
  type: "AllergyEnd",
  allergy_onset?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition,
};

export type MedicationOrderState = {
  name: string,
  remarks: string[],
  type: "MedicationOrder",
  target_encounter: string,
  assign_to_attribute?: string,
  administration?: boolean,
  chronic?: boolean,
  reason?: string,
  codes: Code[],
  prescription?: {
    refills?: number,
    as_needed?: boolean,
    dosage: {
      amount: number,
      frequency: number,
      period: number,
      unit: UnitOfTime,
    },
    duration: {
      quantity: number,
      unit: UnitOfTime,
    },
    instructions?: Code[],
  },
  transition?: Transition,
};

export type MedicationEndState = {
  name: string,
  remarks: string[],
  type: "MedicationEnd",
  medication_order?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition,
};

export type CarePlanStartState = {
  name: string,
  remarks: string[],
  type: "CarePlanStart",
  assign_to_attribute?: string,
  reason?: string,
  codes: Code[],
  activities?: Code[],
  goals?: Goal[],
  transition?: Transition,
};

export type CarePlanEndState = {
  name: string,
  remarks: string[],
  type: "CarePlanEnd",
  careplan?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition,
};

export type ProcedureState = {
  name: string,
  remarks: string[],
  type: "Procedure",
  reason?: string,
  codes: Code[],
  duration: {
    low: number,
    high: number,
    unit: UnitOfTime,
  },
  procedure_status:
    | "preparation"
    | "in-progress"
    | "not-done"
    | "on-hold"
    | "stopped"
    | "completed"
    | "entered-in-error"
    | "unknown",
  transition?: Transition,
};

export type VitalSignState = {
  name: string,
  remarks: string[],
  type: "VitalSign",
  vital_sign: string,
  unit: string,
  exact?: {
    quantity: number,
  },
  range?: {
    low: number,
    high: number,
  },
  transition?: Transition,
};

export type ObservationState = {
  name: string,
  remarks: string[],
  type: "Observation",
  category: string,
  unit: string,
  codes: Code[],
  exact?: {
    quantity: string,
  },
  range?: {
    low: number,
    high: number,
  },
  attribute?: string,
  vital_sign?: string,
  value_code?: Code,
  transition?: Transition,
};

export type MultiObservationState = {
  name: string,
  remarks: string[],
  type: "MultiObservation",
  category: string,
  number_of_observations: number,
  codes: Code[],
  transition?: Transition,
};

export type DiagnosticReportState = {
  name: string,
  remarks: string[],
  type: "DiagnosticReport",
  number_of_observations: number,
  codes: Code[],
  transition?: Transition,
};

export type DeviceState = {
  name: string,
  remarks: string[],
  type: "Device",
  code: Code,
  manufacturer?: string,
  model?: string,
  assign_to_attribute?: string,
  transition?: Transition,
};

export type DeviceEndState = {
  name: string,
  remarks: string[],
  type: "DeviceEnd",
  device?: string,
  referenced_by_attribute?: string,
  codes?: Code[],
  transition?: Transition,
};

export type SupplyListState = {
  name: string,
  remarks: string[],
  type: "SupplyList",
  supplies: Supply[],
  transition?: Transition,
};

export type ImagingStudyState = {
  name: string,
  remarks: string[],
  type: "ImagingStudy",
  procedure_code: Code,
  series: Series[],
  transition?: Transition,
};

export type SymptomState = {
  name: string,
  remarks: string[],
  type: "Symptom",
  symptom: string,
  cause: string,
  probability: number,
  exact?: {
    quantity: number,
  },
  range?: {
    low: number,
    high: number,
  },
  transition?: Transition,
};

export type DeathState = {
  name: string,
  remarks: string[],
  type: "Death",
  exact?: {
    quantity: number,
    unit: UnitOfTime,
  },
  range?: {
    low: number,
    high: number,
    unit: UnitOfTime,
  },
  codes?: Code[],
  condition_onset?: string,
  referenced_by_attribute?: string,
  transition?: Transition,
};

export type State =
  | InitialState
  | TerminalState
  | SimpleState
  | GuardState
  | DelayState
  | SetAttributeState
  | CounterState
  | CallSubmoduleState
  | EncounterState
  | EncounterEndState
  | ConditionOnsetState
  | ConditionEndState
  | AllergyOnsetState
  | AllergyEndState
  | MedicationOrderState
  | MedicationEndState
  | CarePlanStartState
  | CarePlanEndState
  | ProcedureState
  | VitalSignState
  | ObservationState
  | MultiObservationState
  | DiagnosticReportState
  | SymptomState
  | DeathState;
