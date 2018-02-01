// @flow
import React, { Component } from 'react';
import { RIESelect } from 'riek';
import _ from 'lodash';

import type { ConditionalTransition as ConditionalTransitionType } from '../../types/Transition';
import { TransitionTemplates } from '../../templates/Templates';
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
          let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});
          return <div key={i}>
            <label>If: <ConditionalEditor conditional={t.condition} onChange={this.props.onChange(`${i}.condition`)}/></label>
            <label>Transition To:
              <RIESelect propName='to' value={{id:t.to, text:t.to}} change={this.props.onChange(`${i}.transition`)} options={options} />

            </label>
            <br/>
            <a onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>

          </div>
        })}
        <a onClick={() => this.props.onChange(`[${currentValue.length}]`)({val: {id: _.cloneDeep(TransitionTemplates.Conditional[0])}})}>+</a>

      </label>
    );
  }
}

export default ConditionalTransition;
