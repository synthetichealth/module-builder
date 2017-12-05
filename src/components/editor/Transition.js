// @flow
import React, { Component } from 'react';
import type { Transition as TransitionType } from '../../types/Transition';
import type { State } from '../../types/State';
import DirectTransition from './DirectTransition';
import DistributedTransition from './DistributedTransition';
import ConditionalTransition from './ConditionalTransition';

type Props = {
  options: State[],
  transition?: Transition,
  onChange: any
}

class Transition extends Component<Props> {
  render() {
    if(this.props.transition){
      switch (this.props.transition.type) {
        case "Direct":
          return <DirectTransition {...this.props} />
        case "Distributed":
          return <DistributedTransition {...this.props} />
        case "Conditional":
          return <ConditionalTransition {...this.props} />
        default:
          return <div> Unknown Transition </div>
      }
    }
    return <div> No Transition </div>
  }
}

export default Transition;
