// @flow
import React, { Component } from 'react';
import { RIESelect } from 'riek';
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
          console.log(t.to);
          let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});
          return <div>
            <label>If: <ConditionalEditor conditional={t.condition} onChange={this.props.onChange}/></label>
            <label>Transition To:
              <RIESelect propName='to' value={{id:t.to, text:t.to}} change={() => {}} options={options} />

            </label>


          </div>
        })}
      </label>
    );
  }
}

export default ConditionalTransition;
