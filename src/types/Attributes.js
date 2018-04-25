// @flow
import type { Code } from './Code';

export type Goal = {
  observation?: {
    codes: Code[],
    operator: '==' | '!=' | "<" | "<=" | ">" | ">=" | "is nil" | "is not nil",
    value: number
  },
  text?: string,
  addresses: string[]
}

export type Instance = {
  title: string,
  sop_class: Code
}

export type Series = {
  body_site: Code,
  modality: Code,
  instances: Instance[]
}
