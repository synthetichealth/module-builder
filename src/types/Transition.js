// @flow
import type { Conditional } from './Conditional';

export type DirectTransition = {
  to: string,
  type: 'Direct'
};

export type DistributedTransition = {
  type: 'Distributed',
  transition: [
    {
      distribution: {
        attribute: string,
        default: number
      } | number,
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
};

export type ComplexTransition = {
  type: 'Complex',
  transition: [{
    condition ?: Conditional,
    distributions ?: DistributedTransition,
    transition ?: DirectTransition
  }]
};

export type TableTransition = {
  type: 'Table',
  //lookuptable: string,
  transition: [
    {
      distribution: number,
      file: string,
      to: string,
      lookuptable: string
    }
  ]
};

export type Transition = DirectTransition | DistributedTransition | ConditionalTransition | ComplexTransition | TableTransition;
