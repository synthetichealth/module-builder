// @flow
import React, { Component } from 'react';
import type { Transition as TransitionType } from '../../types/Transition';
import type { State } from '../../types/State';
import DirectTransition from './DirectTransition';
import DistributedTransition from './DistributedTransition';
import ConditionalTransition from './ConditionalTransition';
import ComplexTransition from './ComplexTransition';
import TypeOfCareTransition from './TypeOfCareTransition';
import TableTransition from './TableTransition';

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
          return <DirectTransition {...this.props} onChange={this.props.onChange('direct_transition')} />
        case "Distributed":
          return <DistributedTransition {...this.props} onChange={this.props.onChange('distributed_transition')} />
        case "Conditional":
          return <ConditionalTransition {...this.props} onChange={this.props.onChange('conditional_transition')} />
        case "Complex":
          return <ComplexTransition {...this.props} onChange={this.props.onChange('complex_transition')} />
        case "TypeOfCare":
          return <TypeOfCareTransition {...this.props} onChange={this.props.onChange('type_of_care_transition')} />
        case "Table":
          return <TableTransition {...this.props} onChange={this.props.onChange('lookup_table_transition')} />
        case "None":
          return <div> No transition </div>
        default:
          return <div> {this.props.transition.type} Transition is not supported at this time </div>
      }
    }
    return <div> No Transition </div>
  }
}

export default Transition;
