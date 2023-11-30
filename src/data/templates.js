export default {
"incidence_1":{
  "name": "Incidence 1",
  "remarks": [
    "This template demonstrates an incidence-based approach for modeling condition onset in Synthea."
  ],
  "states": {
    "Initial": {
      "type": "Initial",
      "direct_transition": "No_Infection"
    },
    "No_Infection": {
      "type": "Delay",
      "exact": {
        "quantity": 1,
        "unit": "months"
      },
      "complex_transition": [
        {
          "condition": {
            "condition_type": "Age",
            "operator": "<",
            "quantity": 3,
            "unit": "years"
          },
          "distributions": [
            {
              "distribution": 0.02010556,
              "transition": "Gets_Ear_Infection"
            },
            {
              "distribution": 0.97989444,
              "transition": "No_Infection"
            }
          ]
        },
        {
          "condition": {
            "condition_type": "Age",
            "operator": "<",
            "quantity": 6,
            "unit": "years"
          },
          "distributions": [
            {
              "distribution": 0.0131625,
              "transition": "Gets_Ear_Infection"
            },
            {
              "distribution": 0.9868375,
              "transition": "No_Infection"
            }
          ]
        },
        {
          "condition": {
            "condition_type": "Age",
            "operator": "<",
            "quantity": 18,
            "unit": "years"
          },
          "distributions": [
            {
              "distribution": 0.0007444,
              "transition": "Gets_Ear_Infection"
            },
            {
              "distribution": 0.99925556,
              "transition": "No_Infection"
            }
          ]
        },
        {
          "condition": {
            "condition_type": "Age",
            "operator": ">=",
            "quantity": 18,
            "unit": "years"
          },
          "distributions": [
            {
              "distribution": 0.00020833,
              "transition": "Gets_Ear_Infection"
            },
            {
              "distribution": 0.99979167,
              "transition": "No_Infection"
            }
          ]
        }
      ]
    },
    "Gets_Ear_Infection": {
      "type": "ConditionOnset",
      "target_encounter": "Ear_Infection_Encounter",
      "codes": [
        {
          "system": "SNOMED-CT",
          "code": "65363002",
          "display": "Otitis media"
        }
      ],
      "direct_transition": "Ear_Infection_Encounter"
    },
    "Ear_Infection_Encounter": {
      "type": "Encounter",
      "encounter_class": "outpatient",
      "reason": "Gets_Ear_Infection",
      "codes": [
        {
          "system": "SNOMED-CT",
          "code": "185345009",
          "display": "Encounter for symptom"
        }
      ],
      "direct_transition": "Ear_Infection_Prescribed_OTC_Painkiller"
    },
    "Ear_Infection_Prescribed_OTC_Painkiller": {
      "type": "MedicationOrder",
      "codes": [
        {
          "system": "RxNorm",
          "code": "1234",
          "display": "RxNorm Code"
        }
      ],
      "direct_transition": "End_Encounter"
    },
    "End_Encounter": {
      "type": "EncounterEnd",
      "direct_transition": "New_State"
    },
    "New_State": {
      "type": "Delay",
      "distribution": {
        "kind": "EXACT",
        "parameters": {
          "value": 2
        }
      },
      "unit": "weeks",
      "direct_transition": "New_State_2"
    },
    "New_State_2": {
      "type": "MedicationEnd",
      "direct_transition": "No_Infection",
      "medication_order": "Ear_Infection_Prescribed_OTC_Painkiller"
    }
  },
  "gmf_version": 1
}
,
"incidence_2":{
  "name": "Incidence 2",
  "remarks": [
    "This template demonstrates an incidence-based approach for modeling condition onset in Synthea."
  ],
  "states": {
    "Initial": {
      "type": "Initial",
      "remarks": [
        "Initial impl == direct translation of ruby module"
      ],
      "direct_transition": "Age_Guard"
    },
    "Age_Guard": {
      "type": "Guard",
      "allow": {
        "condition_type": "Age",
        "operator": ">=",
        "quantity": 18,
        "unit": "years",
        "value": 0
      },
      "direct_transition": "Set_Yearly_Risk"
    },
    "Set_Yearly_Risk": {
      "type": "Simple",
      "remarks": [
        "By age 55 years, cumulative incidence of hypertension was 75.5% in black men, 75.7% in black women, 54.5% in white men, and 40.0% in white women -- https://www.ahajournals.org/doi/full/10.1161/JAHA.117.007988",
        "",
        "",
        "Cumulative Incidence  = 1 - e(-IR x D)",
        "e^(-IRxD) = 1 - CI",
        "-IR x D = ln(1-CI)",
        "IR = -ln(1-CI)/D",
        "",
        "Assuming 0% at age 18, and per the chart the increase is roughly linear, use the following yearly incidence rates:",
        "",
        "",
        "black men - 3.8%",
        "black women - 3.8%",
        "white men - 2.1%",
        "white women - 1.4%",
        "others - 2.5% (just a value in the middle, no source)"
      ],
      "conditional_transition": [
        {
          "transition": "Black",
          "condition": {
            "condition_type": "Race",
            "race": "Black"
          }
        },
        {
          "transition": "White",
          "condition": {
            "condition_type": "Race",
            "race": "White"
          }
        },
        {
          "transition": "Others"
        }
      ]
    },
    "Chance_of_Hypertension": {
      "type": "Simple",
      "complex_transition": [
        {
          "distributions": [
            {
              "transition": "Onset_Hypertension",
              "distribution": {
                "attribute": "risk_of_hypertension",
                "default": 0.05
              }
            },
            {
              "transition": "Wait_till_next_year",
              "distribution": 0.95
            }
          ]
        }
      ],
      "remarks": [
        "Use the risk set above, but also check if some other module may have set hypertension == true"
      ]
    },
    "Wait_till_next_year": {
      "type": "Delay",
      "distribution": {
        "kind": "EXACT",
        "parameters": {
          "value": 1
        }
      },
      "unit": "years",
      "direct_transition": "Chance_of_Hypertension"
    },
    "Onset_Hypertension": {
      "type": "SetAttribute",
      "attribute": "hypertension",
      "value": true,
      "direct_transition": "Wellness_Encounter"
    },
    "Black": {
      "type": "Simple",
      "conditional_transition": [
        {
          "transition": "Black_Female",
          "condition": {
            "condition_type": "Gender",
            "gender": "F"
          }
        },
        {
          "transition": "Black_Male"
        }
      ]
    },
    "White": {
      "type": "Simple",
      "conditional_transition": [
        {
          "transition": "White_Female",
          "condition": {
            "condition_type": "Gender",
            "gender": "F"
          }
        },
        {
          "transition": "White_Male"
        }
      ]
    },
    "Others": {
      "type": "SetAttribute",
      "attribute": "risk_of_hypertension",
      "direct_transition": "Chance_of_Hypertension",
      "value": 0.025
    },
    "Black_Female": {
      "type": "SetAttribute",
      "attribute": "risk_of_hypertension",
      "direct_transition": "Chance_of_Hypertension",
      "value": 0.038
    },
    "Black_Male": {
      "type": "SetAttribute",
      "attribute": "risk_of_hypertension",
      "direct_transition": "Chance_of_Hypertension",
      "value": 0.038
    },
    "White_Male": {
      "type": "SetAttribute",
      "attribute": "risk_of_hypertension",
      "direct_transition": "Chance_of_Hypertension",
      "value": 0.021
    },
    "White_Female": {
      "type": "SetAttribute",
      "attribute": "risk_of_hypertension",
      "direct_transition": "Chance_of_Hypertension",
      "value": 0.014
    },
    "Diagnose_Hypertension": {
      "type": "ConditionOnset",
      "codes": [
        {
          "system": "SNOMED-CT",
          "code": 59621000,
          "display": "Essential hypertension (disorder)"
        }
      ],
      "assign_to_attribute": "hypertension_dx",
      "direct_transition": "Terminal"
    },
    "Wellness_Encounter": {
      "type": "Encounter",
      "reason": "hypertension_screening_reason",
      "direct_transition": "Diagnose_Hypertension",
      "codes": [
        {
          "system": "SNOMED-CT",
          "code": "1234",
          "display": "SNOMED Code"
        }
      ],
      "encounter_class": "ambulatory",
      "telemedicine_possibility": "none"
    },
    "Terminal": {
      "type": "Terminal"
    }
  },
  "gmf_version": 1
}
,
"keep":{
  "name": "Generated Keep Module", 
  "states": { 
    "Initial": { 
      "type": "Initial", 
      "name": "Initial", 
      "conditional_transition": [ 
        { 
          "transition": "Keep", 
          "condition": { 
            "condition_type": "And", 
            "conditions": [ 
              { 
                "condition_type": "Active Condition", 
                "codes": [ 
                  { 
                    "system": "SNOMED-CT", 
                    "code": "26929004", 
                    "display": "Alzheimer's disease (disorder)" 
                  } 
                ] 
              } 
            ] 
          } 
        }, 
        { 
          "transition": "Terminal" 
        } 
      ] 
    }, 
    "Terminal": { 
      "type": "Terminal", 
      "name": "Terminal" 
    }, 
    "Keep": { 
      "type": "Terminal", 
      "name": "Keep" 
    } 
  }, 
  "gmf_version": 2 
} 
 
,
"onset_distribution":{
  "name": "Onset Distribution",
  "remarks": [
    "This template demonstrates a distribution-based approach for modeling age of condition onset in Synthea."
  ],
  "states": {
    "Initial": {
      "type": "Initial",
      "direct_transition": "Age_Guard"
    },
    "Age_Guard": {
      "type": "Guard",
      "allow": {
        "condition_type": "Age",
        "operator": ">=",
        "quantity": 18,
        "unit": "years"
      },
      "direct_transition": "Veteran_Diabetes_Prevalence"
    },
    "Eventual_Prediabetes": {
      "type": "Delay",
      "range": {
        "low": 0,
        "high": 37,
        "unit": "years"
      },
      "remarks": [
        "we assume that diabetes and prediabetes generally onset between the ages of 18-55"
      ],
      "direct_transition": "Onset_Prediabetes"
    },
    "Eventual_Diabetes": {
      "type": "SetAttribute",
      "attribute": "time_until_diabetes_onset",
      "direct_transition": "Already_age_18",
      "remarks": [
        "we assume that diabetes and prediabetes generally onset between the ages of 18-55",
        "this tracks a little lower so that we can diagnose prediabetes early and then diabetes later",
        "there is little info on how many patients with prediabetes progress to diabetes",
        "so we assume that 38% of patients with diabetes had a prediabetes diagnosis"
      ],
      "distribution": {
        "kind": "GAUSSIAN",
        "parameters": {
          "mean": 55,
          "standardDeviation": 15
        }
      }
    },
    "Onset_Prediabetes": {
      "type": "SetAttribute",
      "attribute": "prediabetes",
      "value": true,
      "direct_transition": "No_Diabetes"
    },
    "No_Diabetes": {
      "type": "Terminal"
    },
    "Onset_Prediabetes_Towards_Diabetes": {
      "type": "ConditionOnset",
      "codes": [
        {
          "system": "SNOMED-CT",
          "code": "1234",
          "display": "SNOMED Code"
        }
      ],
      "direct_transition": "Terminal"
    },
    "Veteran_Diabetes_Prevalence": {
      "type": "Simple",
      "distributed_transition": [
        {
          "transition": "Eventual_Diabetes",
          "distribution": 0.25
        },
        {
          "transition": "Eventual_Prediabetes",
          "distribution": 0.45
        },
        {
          "transition": "No_Diabetes",
          "distribution": 0.3
        }
      ]
    },
    "Onset_Prediabetes_2": {
      "type": "SetAttribute",
      "attribute": "prediabetes",
      "direct_transition": "Delay_Another_Year",
      "value": true
    },
    "Countdown to Diabetes": {
      "type": "Counter",
      "attribute": "time_until_diabetes_onset",
      "action": "decrement",
      "distributed_transition": [
        {
          "transition": "Onset_Prediabetes_2",
          "distribution": 0.05
        },
        {
          "transition": "Delay_Another_Year",
          "distribution": 0.95
        }
      ]
    },
    "Already_age_18": {
      "type": "Counter",
      "attribute": "time_until_diabetes_onset",
      "action": "decrement",
      "conditional_transition": [
        {
          "transition": "Onset_Prediabetes_Towards_Diabetes",
          "condition": {
            "condition_type": "Attribute",
            "attribute": "time_until_diabetes_onset",
            "operator": "<=",
            "value": 0
          }
        },
        {
          "transition": "Countdown to Diabetes"
        }
      ],
      "amount": 18
    },
    "Delay_Another_Year": {
      "type": "Delay",
      "distribution": {
        "kind": "EXACT",
        "parameters": {
          "value": 1
        }
      },
      "unit": "years",
      "conditional_transition": [
        {
          "transition": "Onset_Prediabetes_Towards_Diabetes",
          "condition": {
            "condition_type": "Attribute",
            "attribute": "time_until_diabetes_onset",
            "operator": "<=",
            "value": 0
          }
        },
        {
          "transition": "Countdown to Diabetes"
        }
      ]
    },
    "Terminal": {
      "type": "Terminal"
    }
  },
  "gmf_version": 1
}
,
"prevalence":{
  "name": "Prevalence",
  "remarks": [
    "This template demonstrates a 'Pure Prevalence' type approach of modeling condition onset in Synthea."
  ],
  "states": {
    "Initial": {
      "type": "Initial",
      "conditional_transition": [
        {
          "transition": "Female",
          "condition": {
            "condition_type": "Gender",
            "gender": "F"
          }
        },
        {
          "transition": "Male",
          "condition": {
            "condition_type": "Gender",
            "gender": "M"
          }
        },
        {
          "transition": "Terminal"
        }
      ]
    },
    "Terminal": {
      "type": "Terminal"
    },
    "Female": {
      "type": "Simple",
      "remarks": [
        "North American Indians have the highest reported rates of cholelithiasis, afflicting 64.1% of women and 29.5% of men. White Americans have an overall prevalence of 16.6% in women and 8.6% in men. Intermediate prevalence rates occur in Asian populations and Black Americans (13.9% of women; 5.3% of men)",
        "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3343155/",
        "The age-adjusted prevalence of gallstone disease (gallstones + cholecystectomy) among Mexican American men (7.2%) was 1.7 times that of Cuban American men and 1.8 times that of Puerto Rican men. The prevalence for Mexican American women (23.2%) was 1.5 times that of Cuban American women and 1.7 times that of Puerto Rican women.",
        "https://www.ncbi.nlm.nih.gov/pubmed/2642879"
      ],
      "complex_transition": [
        {
          "condition": {
            "condition_type": "Race",
            "race": "Native"
          },
          "distributions": [
            {
              "transition": "Female_Gallstone_Formation",
              "distribution": 0.641
            },
            {
              "transition": "Terminal",
              "distribution": 0.359
            }
          ]
        },
        {
          "condition": {
            "condition_type": "Race",
            "race": "White"
          },
          "distributions": [
            {
              "transition": "Female_Gallstone_Formation",
              "distribution": 0.166
            },
            {
              "transition": "Terminal",
              "distribution": 0.834
            }
          ]
        },
        {
          "distributions": [
            {
              "transition": "Female_Gallstone_Formation",
              "distribution": 0.139
            },
            {
              "transition": "Terminal",
              "distribution": 0.861
            }
          ],
          "condition": {
            "condition_type": "Race",
            "race": "Black"
          }
        },
        {
          "condition": {
            "condition_type": "Race",
            "race": "Asian"
          },
          "distributions": [
            {
              "transition": "Female_Gallstone_Formation",
              "distribution": 0.139
            },
            {
              "transition": "Terminal",
              "distribution": 0.861
            }
          ]
        },
        {
          "condition": {
            "condition_type": "Race",
            "race": "Hispanic"
          },
          "distributions": [
            {
              "transition": "Female_Gallstone_Formation",
              "distribution": 0.232
            },
            {
              "transition": "Terminal",
              "distribution": 0.768
            }
          ]
        }
      ]
    },
    "Male": {
      "type": "Simple",
      "remarks": [
        "North American Indians have the highest reported rates of cholelithiasis, afflicting 64.1% of women and 29.5% of men. White Americans have an overall prevalence of 16.6% in women and 8.6% in men. Intermediate prevalence rates occur in Asian populations and Black Americans (13.9% of women; 5.3% of men)",
        "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3343155/",
        "The age-adjusted prevalence of gallstone disease (gallstones + cholecystectomy) among Mexican American men (7.2%) was 1.7 times that of Cuban American men and 1.8 times that of Puerto Rican men. The prevalence for Mexican American women (23.2%) was 1.5 times that of Cuban American women and 1.7 times that of Puerto Rican women.",
        "https://www.ncbi.nlm.nih.gov/pubmed/2642879"
      ],
      "complex_transition": [
        {
          "condition": {
            "condition_type": "Race",
            "race": "Native"
          },
          "distributions": [
            {
              "transition": "Male_Gallstone_Formation",
              "distribution": 0.295
            },
            {
              "transition": "Terminal",
              "distribution": 0.705
            }
          ]
        },
        {
          "distributions": [
            {
              "transition": "Male_Gallstone_Formation",
              "distribution": 0.0866
            },
            {
              "transition": "Terminal",
              "distribution": 0.9134
            }
          ],
          "condition": {
            "condition_type": "Race",
            "race": "White"
          }
        },
        {
          "condition": {
            "condition_type": "Race",
            "race": "Black"
          },
          "distributions": [
            {
              "transition": "Male_Gallstone_Formation",
              "distribution": 0.053
            },
            {
              "transition": "Terminal",
              "distribution": 0.947
            }
          ]
        },
        {
          "condition": {
            "condition_type": "Race",
            "race": "Asian"
          },
          "distributions": [
            {
              "transition": "Male_Gallstone_Formation",
              "distribution": 0.053
            },
            {
              "transition": "Terminal",
              "distribution": 0.947
            }
          ]
        },
        {
          "condition": {
            "condition_type": "Race",
            "race": "Hispanic"
          },
          "distributions": [
            {
              "transition": "Male_Gallstone_Formation",
              "distribution": 0.072
            },
            {
              "transition": "Terminal",
              "distribution": 0.928
            }
          ]
        }
      ]
    },
    "Female_Gallstone_Formation": {
      "type": "Simple",
      "distributed_transition": [
        {
          "transition": "Age_20-29",
          "distribution": 0.0718
        },
        {
          "transition": "Age_30-39",
          "distribution": 0.1127
        },
        {
          "transition": "Age_40-49",
          "distribution": 0.1735
        },
        {
          "transition": "Age_50-59",
          "distribution": 0.2763
        },
        {
          "transition": "Age_60-74",
          "distribution": 0.3657
        }
      ],
      "remarks": [
        "Distribution of gallbladder disease prevalence by sex and age from Table 1: https://www.gastrojournal.org/article/S0016-5085(99)70456-7/pdf",
        "(Age prevalence percentages were converted to a proportion of the total prevalence, given the race and sex distribution already in place)"
      ]
    },
    "Male_Gallstone_Formation": {
      "type": "Simple",
      "distributed_transition": [
        {
          "transition": "Age_20-29",
          "distribution": 0.0274
        },
        {
          "transition": "Age_30-39",
          "distribution": 0.04
        },
        {
          "transition": "Age_40-49",
          "distribution": 0.1537
        },
        {
          "transition": "Age_50-59",
          "distribution": 0.2463
        },
        {
          "transition": "Age_60-74",
          "distribution": 0.5326
        }
      ],
      "remarks": [
        "Distribution of gallbladder disease prevalence by sex and age from Table 1: https://www.gastrojournal.org/article/S0016-5085(99)70456-7/pdf",
        "(Age prevalence percentages were converted to a proportion of the total prevalence, given the race and sex distribution already in place)"
      ]
    },
    "Age_20-29": {
      "type": "Delay",
      "direct_transition": "Gallstones",
      "range": {
        "low": 20,
        "high": 29,
        "unit": "years"
      }
    },
    "Age_30-39": {
      "type": "Delay",
      "direct_transition": "Gallstones",
      "range": {
        "low": 30,
        "high": 39,
        "unit": "years"
      }
    },
    "Age_40-49": {
      "type": "Delay",
      "direct_transition": "Gallstones",
      "range": {
        "low": 40,
        "high": 49,
        "unit": "years"
      }
    },
    "Age_50-59": {
      "type": "Delay",
      "direct_transition": "Gallstones",
      "range": {
        "low": 50,
        "high": 59,
        "unit": "years"
      }
    },
    "Age_60-74": {
      "type": "Delay",
      "direct_transition": "Gallstones",
      "range": {
        "low": 60,
        "high": 74,
        "unit": "years"
      }
    },
    "Gallstones": {
      "type": "ConditionOnset",
      "target_encounter": "Cholecystitis_Encounter",
      "codes": [
        {
          "system": "SNOMED-CT",
          "code": 235919008,
          "display": "Cholelithiasis"
        }
      ],
      "remarks": [
        "Up to 80% will never experience biliary pain or complications such as acute cholecystitis, cholangitis, or pancreatitis",
        "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3343155/"
      ],
      "direct_transition": "Cholecystitis_Encounter"
    },
    "Cholecystitis_Encounter": {
      "type": "Encounter",
      "encounter_class": "emergency",
      "codes": [
        {
          "system": "SNOMED-CT",
          "code": "50849002",
          "display": "Emergency room admission (procedure)"
        }
      ],
      "remarks": [
        "The ratio of LC performed increased from 83% in 1998 to 93% in 2005; 12% of cases were attempted laparoscopically but converted to OC.",
        "https://www.ncbi.nlm.nih.gov/pubmed/18656637"
      ],
      "direct_transition": "Terminal"
    }
  },
  "gmf_version": 1
}
,
};