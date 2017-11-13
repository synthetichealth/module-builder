// @flow
import React, { Component } from 'react';
import type { DirectTransition } from '../../types/Transition';
import type { State } from '../../types/State';

type Props = {
  options: State[],
  transition?: DirectTransition,
  onChange?: any
}

class DirectTransitionEditor extends Component<Props> {
  render() {
    let currentValue = null;
    if (this.props.transition) {
      currentValue = this.props.transition.to;
    }
    return (
      <label>
        Transition To:
        <select value={currentValue} onChange={this.props.onChange}>
          <option value={null}>–none–</option>
          {this.props.options.map((s) => {
            return <option key={s.name} value={s.name}>{s.name}</option>
          })}
        </select>
      </label>
    );
  }
}

export default DirectTransitionEditor;
