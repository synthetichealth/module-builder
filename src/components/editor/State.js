// @flow
import React, { Component } from 'react';
import { RIEInput } from 'riek';


import type { State } from '../../types/State';

import StringEditor from './String';
import Transition from './Transition';

type Props = {
  state: State,
  otherStates: State[],
  onChangeBuilder: any
}

class StateEditor extends Component<Props> {
  render() {
    if(!this.props.state) {
      return null;
    }
    return (
        <div>
          <RIEInput propName={'Name'} value={this.props.state.name} change={this.props.onChangeBuilder('name')} />
          <br />
          <Transition
            options={this.props.otherStates}
            transition={this.props.state.transition}
            onChange={this.props.onChangeBuilder} />
        </div>
    )
  }
}

export default StateEditor;
