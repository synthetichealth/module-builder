export const TypeTemplates = {
  Range: {
    Exact: {
      quantity: 0
    },
    ExactWithUnit: {
      quantity: 0,
      unit: "days"
    }
  },

  Code: {
    Snomed: {
      system: "SNOMED-CT",
      code: "1234",
      display: "SNOMED Code"
    },
    Loinc: {
      system: "LOINC",
      code: "1234",
      display: "LOINC Code"
    },
    RxNorm: {
      system: "RxNorm",
      code: "1234",
      display: "RxNorm Code"
    },
    Nubc: {
      system: "NUBC",
      code: "1234",
      display: "NUBC Code"
    }
  },

  Condition: {
    Gender: {
      condition_type: 'Gender',
      gender: 'F'
    },
    Age: {
      condition_type: 'Age',
      operator: ">",
      quantity: 0,
      unit: "years"
    },
    Date: {
      condition_type: 'Date',
      operator: ">",
      year: 2000,
    },
    ActiveCondition: {
      condition_type: 'Active Condition',
      codes: [{
        system: "SNOMED-CT",
        code: "1234",
        display: "SNOMED Code"
      }],
    }
  }
}

export const TransitionTemplates = {
  Direct: 'Initial',
  Conditional: [{transition: 'Initial', condition: {...TypeTemplates.Condition.Age}}],
  Distributed: [{transition: 'Initial', distribution: 0.0}],
  Complex: [{condition: {...TypeTemplates.Condition.Age}, distributions: [], to: 'Initial'}]
}

export const StateTemplates = {
  Initial: {
    type: "Initial",
  },

  Terminal: {
    type: "Terminal",
  },

  Simple: {
    type: "Simple",
  },

  Guard: {
    type: "Guard",
    allow: {...TypeTemplates.Condition.Age}
  },

  Delay: {
    type: "Delay",
    exact: {...TypeTemplates.Range.ExactWithUnit}
  },

  SetAttribute: {
    type: "SetAttribute",
    attribute: ""
  },

  Counter: {
    type: "Counter",
    attribute: "",
    action: "increment"
  },

  CallSubmodule: {
    type: "CallSubmodule",
    submodule: ""
  },

  Encounter: {
    type: "Encounter",
    encounter_class: "ambulatory",
    reason: "",
    codes: [{...TypeTemplates.Code}]
  },

  EncounterEnd: {
    type: "EncounterEnd"
  },

  ConditionOnset: {
    type: "ConditionOnset",
    assign_to_attribute: "",
    target_encounter: "",
    codes: [{...TypeTemplates.Code.Snomed}]
  },

  ConditionEnd: {
    type: "ConditionEnd"
  },

  AllergyOnset: {
    type: "AllergyOnset",
    target_encounter: "",
    codes: [{...TypeTemplates.Code.Snomed}]
  },

  AllergyEnd: {
    type: "AllergyEnd"
  },

  MedicationOrder: {
    type: "MedicationOrder",
    codes: [{...TypeTemplates.Code.RxNorm}]
  },

  MedicationEnd: {
    type: "MedicationEnd"
  },

  CarePlanStart: {
    type: "CarePlanStart",
    codes: [{...TypeTemplates.Code.Snomed}]
  },

  CarePlanEnd: {
    type: "CarePlanEnd"
  },

  Procedure: {
    type: "Procedure",
    codes: [{...TypeTemplates.Code.Snomed}]
  },

  VitalSign: {
    type: "VitalSign",
    vital_sign: "",
    unit: "",
    exact: {...TypeTemplates.Range.Exact}
  },

  Observation: {
    type: "Observation",
    category: "vital-signs",
    unit: "",
    codes: [{...TypeTemplates.Code.Loinc}],
    exact: {...TypeTemplates.Range.Exact}
  },

  MultiObservation: {
    type: "MultiObservation",
    category: "vital-signs",
    number_of_observations: 0,
    codes: [{...TypeTemplates.Code.Loinc}]
  },

  DiagnosticReport: {
    type: "DiagnosticReport",
    number_of_observations: 0,
    codes: [{...TypeTemplates.Code.Loinc}]
  },

  Symptom: {
    type: "Symptom",
    symptom: "",
    cause: "",
    exact: {...TypeTemplates.Range.Exact}
  },

  Death: {
    type: "Death",
    exact: {...TypeTemplates.Range.ExactWithUnit}
  }
}

export const StructureTemplates = {
  CheckYearly: {
    CheckYearly: {...StateTemplates.Delay, exact: {...TypeTemplates.exact, quantity: 1, unit: 'years'},
      conditional_transition: [{transition: 'HasCondition', condition: {...TypeTemplates.Condition.ActiveCondition}},{transition: 'CheckYearly'}]},
    HasCondition: {...StateTemplates.Simple, direct_transition: 'Terminal'}
  },

  ConditionIncidence: {
    RiskPerMonth: {...StateTemplates.Delay, exact: {...TypeTemplates.exact, quantity: 1, unit: 'months'},
      distributed_transition: [{distribution: 0.99, transition: 'RiskPerMonth'},{distribution: 0.01, transition: 'AcquireCondition'}]},
    AcquireCondition: {...StateTemplates.ConditionOnset, codes:[{system: 'SNOMED-CT', code: '', display: ''}], direct_transition: 'Terminal'}
  },

  GenderDifference: {
    GenderDifference: {...StateTemplates.Simple,
          conditional_transition: [
            {condition: {...TypeTemplates.Condition.Gender, gender: 'M'}, transition: 'Male'},
            {condition: {...TypeTemplates.Condition.Gender, gender: 'F'}, transition: 'Female'}]},
    Male: {...StateTemplates.Simple, direct_transition: 'Common'},
    Female: {...StateTemplates.Simple, direct_transition: 'Common'},
    Common: {...StateTemplates.Simple, direct_transition: 'Terminal'}
  },

  ConditionVariation: {
    VariantDistribution: {...StateTemplates.Simple,
      distributed_transition:[{distribution: 0.25, transition: 'Condition1'},{distribution: 0.35, transition: 'Condition2'},{distribution: 0.40, transition: 'Condition3'}]},
    Condition1: {...StateTemplates.ConditionOnset, codes:[{system: 'SNOMED-CT', code: '', display: ''}], direct_transition: 'Join'},
    Condition2: {...StateTemplates.ConditionOnset, codes:[{system: 'SNOMED-CT', code: '', display: ''}], direct_transition: 'Join'},
    Condition3: {...StateTemplates.ConditionOnset, codes:[{system: 'SNOMED-CT', code: '', display: ''}], direct_transition: 'Join'},
    Join: {...StateTemplates.Simple, direct_transition: 'Terminal'}
  },

  MedicationVariation: {
    VariantDistribution: {...StateTemplates.Simple,
      distributed_transition:[{distribution: 0.25, transition: 'Medication1'},{distribution: 0.35, transition: 'Medication2'},{distribution: 0.40, transition: 'Medication3'}]},
    Medication1: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    Medication2: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    Medication3: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    Join: {...StateTemplates.Simple, direct_transition: 'Terminal'}
  },

  ChildrensDose: {
    DosageDecision: {...StateTemplates.Simple,
          conditional_transition: [
            {condition: {...TypeTemplates.Condition.Age, operator: '>=', quantity: 18, unit: 'years'}, transition: 'AdultDose'},
            {transition: 'ChildrensDose'}]},
    AdultDose: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    ChildrensDose: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    Join: {...StateTemplates.Simple, direct_transition: 'Terminal'}
  },

  MedicationsByYear: {
    VariantsByYear: {...StateTemplates.Simple,
          conditional_transition: [
            {condition: {...TypeTemplates.Condition.Date, operator: '>=', year: 2007}, transition: 'Medication1'},
            {condition: {...TypeTemplates.Condition.Date, operator: '>=', year: 1992}, transition: 'Medication2'},
            {condition: {...TypeTemplates.Condition.Date, operator: '>=', year: 1978}, transition: 'Medication3'},
            {transition: 'Medication4'}]},
    Medication1: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    Medication2: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    Medication3: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    Medication4: {...StateTemplates.MedicationOrder, codes:[{system: 'RxNorm', code: '', display: ''}], direct_transition: 'Join'},
    Join: {...StateTemplates.Simple, direct_transition: 'Terminal'}
  },

  ProcedureVariation: {
    BeginEncounter: {...StateTemplates.Encounter, codes:[{system: 'SNOMED-CT', code: '', display: ''}],
      distributed_transition:[{distribution: 0.25, transition:'Procedure1'},{distribution: 0.35, transition:'Procedure2'},{distribution: 0.40, transition:'Procedure3'}]},
    Procedure1: {...StateTemplates.Procedure, codes:[{system: 'LOINC', code: '', display: ''}], direct_transition: 'Observation1'},
    Observation1: {...StateTemplates.Observation, codes:[{system: 'SNOMED-CT', code: '', display: ''}], direct_transition: 'Join'},
    Procedure2: {...StateTemplates.Procedure, codes:[{system: 'LOINC', code: '', display: ''}], direct_transition: 'Observation2'},
    Observation2: {...StateTemplates.Observation, codes:[{system: 'SNOMED-CT', code: '', display: ''}], direct_transition: 'Join'},
    Procedure3: {...StateTemplates.Procedure, codes:[{system: 'LOINC', code: '', display: ''}], direct_transition: 'Observation3'},
    Observation3: {...StateTemplates.Observation, codes:[{system: 'SNOMED-CT', code: '', display: ''}], direct_transition: 'Join'},
    Join: {...StateTemplates.Simple, direct_transition: 'Terminal'}
  }
}

export const ModuleTemplates = {
  Blank: {
    name: "My Module",
    remarks: "A blank module",
    states: {
      Initial: {...StateTemplates.Initial, direct_transition: 'Terminal'},
      Terminal: {...StateTemplates.Terminal}
    }
  },

  Yearly: {
    name: "Yearly Check for Condition",
    remarks: "Check yearly for patient to have a condition",
    states: {
      ...StructureTemplates.CheckYearly,
      Initial: {...StateTemplates.Initial, direct_transition: 'CheckYearly'},
      Terminal: {...StateTemplates.Terminal}
    }
  },

  DeadAt40: {
    name: "Dead At 40",
    remarks: "This module is an example of writing a template",
    states: {
      Initial: {...StateTemplates.Initial, direct_transition: 'DelayUntil40'},
      DelayUntil40: {...StateTemplates.Delay, exact: {...TypeTemplates.exact, quantity: 40, unit: 'years'}, direct_transition: 'Death'},
      Death: {...StateTemplates.Death, direct_transition: 'Terminal'},
      Terminal: {...StateTemplates.Terminal}
    }
  }
}
