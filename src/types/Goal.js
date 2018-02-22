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
