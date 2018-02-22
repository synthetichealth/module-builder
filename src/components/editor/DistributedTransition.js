// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';
import _ from 'lodash';


import type { DistributedTransition as DistributedTransitionType } from '../../types/Transition';
import { TransitionTemplates } from '../../templates/Templates';
import type { State } from '../../types/State';
import './Transition.css';


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

        Distributed Transition:
        {currentValue.map((t, i) => {
          return <div key={i} className="transition-option">
            <label>To:
              <RIESelect className='editable-text' propName='transition' value={{id:t.to, text:t.to}} change={this.props.onChange(`[${i}].transition`)} options={options} />
            </label>
            <br/>
            <label> Weight:
            <RIENumber className='editable-text' value={t.distribution} propName='distribution' change={this.props.onChange(`[${i}].distribution`)} />

            </label>
            <br/>
            <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
          </div>
        })}
        <a className='editable-text add-button' onClick={() => this.props.onChange(`[${currentValue.length}]`)({val: {id: _.cloneDeep(TransitionTemplates.Distributed[0])}})}>+</a>
      </label>
    );
  }
}

export default DistributedTransition;
