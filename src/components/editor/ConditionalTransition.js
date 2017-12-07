// @flow
import React, { Component } from 'react';
import type { ConditionalTransition as ConditionalTransitionType } from '../../types/Transition';
import ConditionalEditor from './Conditional';
import type { State } from '../../types/State';

type Props = {
  options: State[],
  transition?: ConditionalTransitionType,
  onChange: any
}

class ConditionalTransition extends Component<Props> {
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
        Conditional Transition To:
        {currentValue.map((t, i) => {
          return <div>
            <label>If: <ConditionalEditor conditional={t.condition} /></label>
            <label>Transition To:
              <select value={t.to} onChange={this.props.onChange(`transition.transition[${i}].to`)}>
                <option value=""></option>
                {this.props.options.map((s) => {
                  return <option key={s.name} value={s.name}>{s.name}</option>
                })}
              </select>
            </label>


          </div>
        })}
      </label>
    );
  }
}

export default ConditionalTransition;
