// @flow
import React, { Component } from 'react';
import { RIESelect } from 'riek';
import _ from 'lodash';

import type { ConditionalTransition as ConditionalTransitionType } from '../../types/Transition';
import { TransitionTemplates } from '../../templates/Templates';
import ConditionalEditor from './Conditional';
import DistributedTransitionEditor from './DistributedTransition';
import DirectTransitionEditor from './DirectTransition';
import type { State } from '../../types/State';

import './Transition.css';



type Props = {
  options: State[],
  transition?: ConditionalTransitionType,
  onChange: any
}

class ComplexTransition extends Component<Props> {
  render() {
    let currentValue = [];
    if (this.props.transition) {
      currentValue = this.props.transition.transition;
    }
    if(!this.props.transition) {
      return null;
    }
    const states = this.props.options;
    const options = this.props.options.map((s) => {return {id: s.name, text: s.name}});
    console.log(currentValue);
    return (
      <label>
        Complex Transition:
        {currentValue.map((t, i) => {
          return <div className='transition-option' key={i}>
            <label>If: <ConditionalEditor conditional={t.condition} onChange={this.props.onChange(`[${i}].condition`)}/></label>
            <label>
              <DistributedTransitionEditor transition={{transition: t.distributions}} options={states} onChange={this.props.onChange(`[${i}].distributions`)} />
            </label>
            <br/>
            <a className='delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>

          </div>
        })}
        <a className='add-button' onClick={() => this.props.onChange(`[${currentValue.length}]`)({val: {id: _.cloneDeep(TransitionTemplates.Complex[0])}})}>+</a>

      </label>
    );
  }
}

export default ComplexTransition;
