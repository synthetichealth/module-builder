// @flow
import type { DirectTransition } from './Transition';

export type State = {
  name: string,
  type: "Simple" | "Initial" | "Terminal",
  // TODO Figure out the flow definition for this to allow it to be optional
  transition?: DirectTransition
}
