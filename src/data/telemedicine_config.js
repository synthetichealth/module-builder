export default {
  "start_year": 2020,
  "high_emergency_use_insurance_names": ["Medicaid", "Dual Eligible", "NO_INSURANCE"],
  "pre_telemedicine": {
    "high_emergency_distribution": {
      "ambulatory": 0.65,
      "emergency": 0.35
    },
    "typical_emergency_distribution": {
      "ambulatory": 0.75,
      "emergency": 0.25
    }
  },
  "during_telemedicine": {
    "high_emergency_distribution": {
      "ambulatory": 0.66,
      "emergency": 0.25,
      "telemedicine": 0.09
    },
    "typical_emergency_distribution": {
      "ambulatory": 0.56,
      "emergency": 0.2,
      "telemedicine": 0.24
    }
  }
}