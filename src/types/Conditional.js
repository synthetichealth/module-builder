export type Conditional = GenderConditional | any;

export type GenderConditional = {
  condition_type: 'Gender',
  gender: 'M' | 'F'
}
