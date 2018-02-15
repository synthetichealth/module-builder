// @flow
import React, { Component } from 'react';
import { RIESelect } from 'riek';

import type { DirectTransition } from '../../types/Transition';
import type { State } from '../../types/State';

type Props = {
  options: State[],
  transition?: DirectTransition,
  onChange: any
}

class DirectTransitionEditor extends Component<Props> {
  render() {
    let currentValue = "";
    let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});
    // options.push({id: '', text: "-" });

    if (this.props.transition) {
      currentValue = this.props.transition.to;
    }
    return (
      <label>
        Transition To:
        <RIESelect className='editable-text' propName='to' value={{id:this.props.transition.to, text:this.props.transition.to}} change={this.props.onChange} options={options} />
      </label>
    );
  }
}

export default DirectTransitionEditor;
