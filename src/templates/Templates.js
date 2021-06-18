import _ from 'lodash';

// do not allow direct access because it is easy to forget to clone these templates
export function getTemplate(path){

  const parsedPath = path.split('.')
  const template = parsedPath.shift();
  const reducedPath = parsedPath.join('.')

  let typeVar = null;
  switch(template){
    case 'Type':
      typeVar = TypeTemplates;
      break;

    case 'Attribute':
      typeVar = AttributeTemplates;
      break;

    case 'Transition':
      typeVar = TransitionTemplates;
      break;

    case 'State':
      typeVar = StateTemplates;
      break;

    case 'Contained':
      typeVar = ContainedTemplates;
      break;

    case 'Structure':
      typeVar = StructureTemplates;
      break;

    case 'Module':
      typeVar = ModuleTemplates;
      break;
    default:
      break;
  }


  if(reducedPath.length === 0){
    return typeVar
  }

  return _.cloneDeep(_.get(typeVar, reducedPath));
}

const TypeTemplates = {
  Date: {
    Year: 2000,
    Month: 12,
    Day: 25,
    Hour: 0,
    Minute: 0,
    Second: 0,
    Millisecond: 0
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
    },
    DicomDCM: {
      system: "DICOM-DCM",
      code: "XX",
      display: "DICOM Modality Code"
    },
    DicomSOP: {
      system: "DICOM-SOP",
      code: "1.2.3.4.5.6.7.8",
      display: "DICOM Subject-Object Pair Code"
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
    "Active Condition": {
      condition_type: 'Active Condition',
      codes: [{
        system: "SNOMED-CT",
        code: "1234",
        display: "SNOMED Code"
      }],
    },
    "Socioeconomic Status": {
        "condition_type": "Socioeconomic Status",
        "category": "Middle"
    },
    Race: {
      "condition_type": "Race",
      "race": "Hispanic"
    },
    Symptom: {
      "condition_type": "Symptom",
      "symptom" : "Chest Pain",
      "operator": ">=",
      "value": 50
    },
    Observation: {
      "condition_type": "Observation",
      "codes": [
        {
          "system": "LOINC",
          "code": "72107-6",
          "display": "Mini Mental State Examination"
        }
      ],
      "operator": "==",
      "value": 0
    },
    "Vital Sign": {
        "condition_type" : "Vital Sign",
        "vital_sign" : "Systolic Blood Pressure",
        "operator" : ">",
        "value" : 120
    },
    "Active Allergy": {
      "condition_type": "Active Allergy",
      "codes": [
        {
          "system": "RxNorm",
          "code": "7984",
          "display": "Penicillin V"
        }
      ]
    },
    "Active Medication": {
      "condition_type": "Active Medication",
      "codes": [
        {
          "system": "RxNorm",
          "code": "849727",
          "display": "Naproxen sodium 220 MG [Aleve]"
        }
      ]
    },
    "Active CarePlan": {
      "condition_type": "Active CarePlan",
      "codes": [
        {
          "system": "SNOMED-CT",
          "code": "698360004",
          "display": "Diabetes self management plan"
        }
      ]
    },
    PriorState: {
      "condition_type": "PriorState",
      "name": ""
    },
    Attribute: {
      "condition_type": "Attribute",
      "attribute": "opiod_prescription",
      "operator": "==",
      "value": "Vicodin"
    },
    And: {
      "condition_type": "And",
      "conditions": [
        {
          "condition_type": "Gender",
          "gender": "M"
        },
        {
          "condition_type": "Age",
          "operator": ">=",
          "quantity": 40,
          "unit": "years"
        }
      ]
    },
    Or: {
      "condition_type": "Or",
      "conditions": [
        {
          "condition_type": "Gender",
          "gender": "M"
        },
        {
          "condition_type": "Age",
          "operator": ">=",
          "quantity": 40,
          "unit": "years"
        }
      ]
    },
    "At Least" : {
      "condition_type": "At Least",
      "minimum": 2,
      "conditions": [
        {
          "condition_type": "Gender",
          "gender": "M"
        },
        {
          "condition_type": "Age",
          "operator": ">=",
          "quantity": 40,
          "unit": "years"
        },
        {
          "condition_type" : "Active CarePlan",
          "codes": [
            {
              "system": "SNOMED-CT",
              "code": "698360004",
              "display": "Diabetes self management plan"
            }
          ]
        }
      ]
    },
    "At Most": {
      "condition_type": "At Most",
      "maximum" : 2,
      "conditions": [
        {
          "condition_type": "Gender",
          "gender": "M"
        },
        {
          "condition_type": "Age",
          "operator": ">=",
          "quantity": 40,
          "unit": "years"
        },
        {
          "condition_type": "Active CarePlan",
          "codes": [
            {
              "system": "SNOMED-CT",
              "code": "698360004",
              "display": "Diabetes self management plan"
            }
          ]
        }
      ]
    },
    Not: {
      "condition_type": "Not",
      "condition": {
        "condition_type": "Gender",
        "gender": "M"
      }
    },
    "True": {
      condition_type: "True"
    },
    "False": {
      condition_type: "False"
    }
  }
}

const AttributeTemplates = {
  Exact: {
    quantity: 1
  },
  ExactWithUnit: {
    quantity: 1,
    unit: "days"
  },
  Range: {
    low: 1,
    high: 2,
  },
  RangeWithUnit: {
    low: 1,
    high: 2,
    unit: "days"
  },
  Prescription: {
    dosage: {
      amount: 1,
      frequency: 1,
      period: 1,
      unit: "days"
    },
    duration: {
      quantity: 1,
      unit: "days"
    }
  },
  Goal: {
    addresses: ["text"]
  },
  Observation: {
    codes: [{...TypeTemplates.Code.Loinc}],
    operator: "==",
    value: 1
  },
  Since: " ",
  Within: {
    quantity: 1,
    unit: "days"
  },
  UnnamedDistribution: 1.0,
  NamedDistribution: {
    attribute: "attribute",
    default: 1.0
  },
  Supply: {
    quantity: 1,
    code: {...TypeTemplates.Code.Snomed}
  },

  ImagingStudy: {
    Instance: {
      title: "Title of this image",
      sop_class: {...TypeTemplates.Code.DicomSOP}
    },
    Series: {
      body_site: {...TypeTemplates.Code.Snomed},
      modality: {...TypeTemplates.Code.DicomDCM},
      instances: [{
        title: "Title of this image",
        sop_class: {...TypeTemplates.Code.DicomSOP}
      }]
    }
  }
}


const TransitionTemplates = {
  Direct: 'Initial',
  Conditional: [{transition: 'Initial', condition: {...TypeTemplates.Condition.Age}}],
  Distributed: [{transition: 'Initial', distribution: 1.0}],
  Complex: [{condition: {...TypeTemplates.Condition.Age}, distributions: [{transition: 'Initial', distribution: 1.0}]}],
  Table: {
    type: 'Table',
    lookuptable: 'age,Initial,Terminal\n0-50,.1,.9\n51-140,.4,.6',
    viewTable: true,
    lookup_table_name_ModuleBuilder: 'file.csv',
    transitions:[{transition: 'Initial', default_probability: 1.0, lookup_table_name: 'table.csv'}]
  }
}

const StateTemplates = {
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
    distribution: {"kind": "EXACT",
                   "parameters": {
                     "value": 1
                   }
    },
    "unit": "years"
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
    codes: [{...TypeTemplates.Code.Snomed}]
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
    allergy_type: "allergy",
    category: "food",
    type: "AllergyOnset",
    target_encounter: "",
    codes: [{...TypeTemplates.Code.Snomed}],
    reactions: []
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
    codes: [{...TypeTemplates.Code.Snomed}],
    distribution: {
      "kind": "UNIFORM",
      "parameters": {
        "high": 60,
        "low": 30
      }
    },
    "unit": "minutes"
  },

  VitalSign: {
    type: "VitalSign",
    vital_sign: "",
    unit: "",
    distribution: {kind: "EXACT", parameters: {value: 1}}
  },

  Observation: {
    type: "Observation",
    category: "vital-signs",
    unit: "",
    codes: [{...TypeTemplates.Code.Loinc}],
    distribution: {kind: "EXACT", round: false, parameters: {value: 1}}
  },

  MultiObservation: {
    type: "MultiObservation",
    category: "vital-signs",
    number_of_observations: 0,
    codes: [{...TypeTemplates.Code.Loinc}]
  },

  DiagnosticReport: {
    type: "DiagnosticReport",
    codes: [{...TypeTemplates.Code.Loinc}],
    observations: []
  },

  ImagingStudy: {
    type: "ImagingStudy",
    procedure_code: {...TypeTemplates.Code.Snomed},
    series: [{...AttributeTemplates.ImagingStudy.Series}]
  },

  Symptom: {
    type: "Symptom",
    symptom: "",
    cause: "",
    probability: 1.0,
    distribution: {kind: "EXACT", parameters: {value: 1}}
  },

  Device: {
    type: "Device",
    code: {...TypeTemplates.Code.Snomed}
  },

  DeviceEnd: {
    type: "DeviceEnd"
  },

  SupplyList: {
    type: "SupplyList",
    supplies: [{...AttributeTemplates.Supply}]
  },

  Death: {
    type: "Death",
    exact: {...AttributeTemplates.ExactWithUnit}
  }
}

const ContainedTemplates = {
  Observation: {
    category: "laboratory",
    unit: "",
    codes: [{...TypeTemplates.Code.Loinc}],
    exact: {...AttributeTemplates.Exact}
  }
}

const StructureTemplates = {
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

const ModuleTemplates = {
  Blank: {
    name: "Untitled",
    remarks: ["A blank module"],
    states: {
      Initial: {...StateTemplates.Initial, direct_transition: 'Terminal'},
      Terminal: {...StateTemplates.Terminal}
    }
  },

  Yearly: {
    name: "Yearly Check for Condition",
    remarks: ["Check yearly for patient to have a condition"],
    states: {
      ...StructureTemplates.CheckYearly,
      Initial: {...StateTemplates.Initial, direct_transition: 'CheckYearly'},
      Terminal: {...StateTemplates.Terminal}
    }
  },

  DeadAt40: {
    name: "Dead At 40",
    remarks: ["This module is an example of writing a template"],
    states: {
      Initial: {...StateTemplates.Initial, direct_transition: 'DelayUntil40'},
      DelayUntil40: {...StateTemplates.Delay, exact: {...TypeTemplates.exact, quantity: 40, unit: 'years'}, direct_transition: 'Death'},
      Death: {...StateTemplates.Death, direct_transition: 'Terminal'},
      Terminal: {...StateTemplates.Terminal}
    }
  }
}
