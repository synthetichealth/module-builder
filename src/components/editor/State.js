// @flow
import React, { Component } from 'react';

import type { State } from '../../types/State';

import StringEditor from './String';
import DirectTransitionEditor from './DirectTransition';

type Props = {
  state: State,
  otherStates: State[],
  onChangeBuilder: any
}

class StateEditor extends Component<Props> {
  render() {
    return (
        <div>
          <StringEditor label={'Name'} value={this.props.state.name} onChange={this.props.onChangeBuilder('name')} />
          <br />
          <DirectTransitionEditor
            options={this.props.otherStates}
            transition={this.props.state.transition}
            onChange={this.props.onChangeBuilder('transition.to')} />
        </div>
    )
  }
}

export default StateEditor;
