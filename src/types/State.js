// @flow
import type { DirectTransition, DistributedTransition, ConditionalTransition } from './Transition';

export type State = {
  name: string,
  id: string,
  type: "Simple" | "Initial" | "Terminal",
  // TODO Figure out the flow definition for this to allow it to be optional
  transition?: DirectTransition | DistributedTransition | ConditionalTransition
}
