// @flow
import type { State } from './State';

export type Module = {
  name: string,
  remarks: ?string[],
  states: ?State[]
}
