export const TypeTemplates = {
  Range: {
    Exact: {
      quantity: 0,
      unit: "days"
    }
  },

  Code: {
    system: "SNOMED-CT",
    code: "1234",
    display: "SNOMED Code"
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
  Direct: '',
  Conditional: [{transition: '', condition: {...TypeTemplates.Condition.Age}}]
}

export const StateTemplates = {
  Simple: {
    type: "Simple",
    name: "Simple_Template",
  },

  Initial: {
    type: "Initial",
    name: "Initial_Template",
  },

  Terminal: {
    type: "Terminal",
    name: "Terminal_Template",
  },

  Death: {
    type: "Death",
    name: "Death_Template",
  },

  Delay: {
    type: "Delay",
    name: "Delay_Template",
    exact: {...TypeTemplates.Range.Exact}
  },

  ConditionOnset: {
    type: "ConditionOnset",
    assign_to_attribute: "",
    target_encounter: "",
    codes: [{...TypeTemplates.Code}]
  },

  Encounter: {
    type: "Encounter",
    encounter_class: "ambulatory",
    reason: "",
    codes: [{...TypeTemplates.Code}]
  },

  Guard: {
    type: "Guard",
    allow: {...TypeTemplates.Condition.Age}
  }
}

export const StructureTemplates = {
  CheckYearly: {
    CheckYearly: {...StateTemplates.Delay, exact: {...TypeTemplates.exact, quantity: 1, unit: 'years'},
      conditional_transition: [{transition: 'CheckYearly'},{transition: 'HasCondition', condition: {...TypeTemplates.Condition.ActiveCondition}}]},
    HasCondition: {...StateTemplates.Simple, direct_transition: 'Terminal'}
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
