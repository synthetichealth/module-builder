// @flow
export type Code = {
  system: "SNOMED-CT" | "RxNorm" | "LOINC",
  code: string,
  display: string
}
