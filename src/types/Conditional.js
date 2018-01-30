// @flow

import type { Code } from './Code';
import type { UnitOfAge } from './Units';

export type GenderConditional = {
  condition_type: 'Gender',
  gender: 'M' | 'F'
}

export type AgeConditional = {
  condition_type: 'Age',
  operator: '==' | '!=' | "<" | "<=" | ">" | ">=",
  quantity: number,
  unit: UnitOfAge
}

export type DateConditional = {
  condition_type: "Date",
  operator: '==' | '!=' | "<" | "<=" | ">" | ">=",
  year: number
}

export type SocioeconomicStatusConditional = {
  condition_type: "Socioeconomic Status",
  category: "Low" | "Middle" | "High"
}

export type RaceConditional = {
  condition_type: "Race",
  race: "White" | "Native" | "Hispanic" | "Black" | "Asian" | "Other"
}

export type SymptomConditional = {
  condition_type:  "Symptom",
  symptom: string,
  operator: '==' | '!=' | "<" | "<=" | ">" | ">=",
  value: number
}

export type ObservationConditional = {
  condition_type: "Observation",
  codes: Code[] | string,
  operator: '==' | '!=' | "<" | "<=" | ">" | ">=" | "is nil" | "is not nil",
  value: number
}

export type VitalSignConditional = {
  condition_type: "Vital Sign",
  vital_sign: string,
  operator: '==' | '!=' | "<" | "<=" | ">" | ">=",
  value: number
}

export type ActiveConditionConditional = {
  condition_type: 'Active Condition',
  codes: Code[] | string,
}


export type ActiveMedicationConditional = {
  condition_type: 'Active Medication',
  codes: Code[] | string,
}

export type ActiveCarePlanConditional = {
  condition_type: 'Active CarePlan',
  codes: Code[] | string,
}

export type PriorStateConditional = {
  condition_type: 'Prior State',
  name: string,
  since: string
}

export type AttributeConditional = {
  condition_type: 'Attribute',
  attribute: string,
  operator: '==' | '!=' | "<" | "<=" | ">" | ">=" | "is nil" | "is not nil",
  value: number | string
}

export type AndConditional = {
  condition_type: 'And',
  conditions: Conditional[]
}

export type OrConditional = {
  condition_type: 'Or',
  conditions: Conditional[]
}

export type AtLeastConditional = {
  condition_type: 'At Least',
  minimum: number,
  conditions: Conditional[]
}

export type AtMostConditional = {
  condition_type: 'At Most',
  maximum: number,
  conditions: Conditional[]
}

export type NotConditional = {
  condition_type: 'Not',
  condition: Conditional
}

export type Conditional = GenderConditional | AgeConditional | DateConditional | SocioeconomicStatusConditional | RaceConditional | SymptomConditional | ObservationConditional | VitalSignConditional | ActiveConditionConditional | ActiveMedicationConditional | ActiveCarePlanConditional | PriorStateConditional | AttributeConditional | AndConditional | OrConditional | AtLeastConditional | AtMostConditional | NotConditional;
