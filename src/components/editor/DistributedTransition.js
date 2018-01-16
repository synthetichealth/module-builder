// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';


import type { DistributedTransition as DistributedTransitionType } from '../../types/Transition';
import type { State } from '../../types/State';

type Props = {
  options: State[],
  transition?: DistributedTransitionType,
  onChange: any
}

class DistributedTransition extends Component<Props> {
  render() {
    let currentValue = [];
    if (this.props.transition) {
      currentValue = this.props.transition.transition;
    }
    if(!this.props.transition) {
      return null;
    }
    let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});

    return (
      <label>
        Distributed Transition To:
        {currentValue.map((t, i) => {
          return <div>
            <label>To:
              <RIESelect propName='transition' value={{id:t.to, text:t.to}} change={this.props.onChange(`[${i}].transition`)} options={options} />
            </label>
            <label> Weight:
            <RIENumber value={t.distribution} propName='distribution' change={this.props.onChange(`[${i}].distribution`)} />

            </label>

          </div>
        })}
      </label>
    );
  }
}

export default DistributedTransition;
