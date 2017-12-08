// @flow
import type { State } from './State';
import type { Conditional } from './Conditional';

export type DirectTransition = {
  to: string,
  type: 'Direct'
}

export type DistributedTransition = {
  type: 'Distributed',
  transition: [
      {
        distibution: number,
        to: string
      }
    ]
};

export type ConditionalTransition = {
  type: 'Conditional',
  transition: [
    {
      condition?: Conditional,
      to: string
    }
  ]
}

export type ComplexTransition = {
  type: 'Complex',
  transition: [{
    condition ?: Conditional,
    distributions ?: DistributedTransition,
    transition ?: DirectTransition
  }]
}

export type Transition = DirectTransition | DistributedTransition | ConditionalTransition | ComplexTransition;
