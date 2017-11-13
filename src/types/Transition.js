// @flow
import type { State } from './State';

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
