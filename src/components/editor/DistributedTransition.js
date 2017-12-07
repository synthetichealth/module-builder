// @flow
import React, { Component } from 'react';
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
    return (
      <label>
        Distributed Transition To:
        {currentValue.map((t, i) => {
          return <div>
            <label>To:
              <select value={t.to} onChange={this.props.onChange(`transition.transition[${i}].to`)}>
                <option value=""></option>
                {this.props.options.map((s) => {
                  return <option key={s.name} value={s.name}>{s.name}</option>
                })}
              </select>
            </label>
            <label> Weight:
              <input value={t.distribution} type="number" onChange={this.props.onChange(`transition.transition[${i}].distribution`)} />
            </label>

          </div>
        })}
      </label>
    );
  }
}

export default DistributedTransition;
