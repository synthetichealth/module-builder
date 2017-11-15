// @flow
import type { State } from './State';
import type { Conditional } from './Conditional';

export type DirectTransition = {
  to: string,
  type: 'Direct'
}

export type DistributedTransition = {
  type: 'Distributed',
  transitions: [
      {
        distibution: number,
        to: string
      }
    ]
};

export type ConditionalTransition = {
  type: 'Conditional',
  transitions: [
    {
      condition?: Conditional,
      transition: string
    }
  ]
}

export type ComplexTransition = {
  type: 'Complex',
  transitions: [{
    condition ?: Conditional,
    distributions ?: DistributedTransition,
    transition ?: DirectTransition
  }]
}

export type Transition = DirectTransition | DistributedTransition | ConditionalTransition | ComplexTransition;
