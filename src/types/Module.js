// @flow
import type { State } from './State';

export type Module = {
  name: string,
  gmf_version: ?number,
  remarks: ?string[],
  states: ?State[]
}
