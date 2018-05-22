// @flow
import React, { Component } from 'react';
import { RIESelect } from 'riek';
import _ from 'lodash';

import type { ConditionalTransition as ConditionalTransitionType } from '../../types/Transition';
import { getTemplate } from '../../templates/Templates';
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

  swapItems(indexTo,indexFrom) {
    if(indexTo >= 0 && indexTo < this.props.transition.transition.length){
      let oldEntry = {};
      let newEntry = {};

      if(this.props.transition.transition[indexTo].condition){
        oldEntry.condition = _.clone(this.props.transition.transition[indexTo].condition)
      }
      if(this.props.transition.transition[indexTo].distributions){
        oldEntry.distributions = _.clone(this.props.transition.transition[indexTo].distributions.map((d) => ({distribution: d.distribution, transition: d.to})))
      }
      if(this.props.transition.transition[indexTo].transition.to){
        oldEntry.transition = this.props.transition.transition[indexTo].transition.to
      }

      if(this.props.transition.transition[indexFrom].condition){
        newEntry.condition = _.clone(this.props.transition.transition[indexFrom].condition)
      }
      if(this.props.transition.transition[indexFrom].distributions){
        newEntry.distributions = _.clone(this.props.transition.transition[indexFrom].distributions.map((d) => ({distribution: d.distribution, transition: d.to})))
      }
      if(this.props.transition.transition[indexFrom].transition.to){
        newEntry.transition = this.props.transition.transition[indexFrom].transition.to
      }

      return () => {
        this.props.onChange(indexTo)({val: {id: newEntry}});
        this.props.onChange(indexFrom)({val: {id: oldEntry}});
      }
    }

    return () => {};
  }

  renderUpDown(index: number) {
  
    if(this.props.transition && this.props.transition.transition){
      if(index < this.props.transition.transition.length - 1 && index > 0){
        return <span>
            <a className="editable-text delete-button" onClick={this.swapItems(index-1, index)}>move up</a> | 
            <a className="editable-text delete-button" onClick={this.swapItems(index, index+1)}>move down</a>
          </span>
      } else if(index < this.props.transition.transition.length - 1){
        return <a className="editable-text delete-button" onClick={this.swapItems(index, index+1)}>move down</a>
      } else if(index > 0){
        return <a className="editable-text delete-button" onClick={this.swapItems(index-1, index)}>move up</a>
      }
    }
  }

  renderIf(index){
    if(!this.props.transition.transition[index].condition){
      return 'Else:'
    }
    if(index === 0){
      return <span>If:</span>
    }else{
      return <span>Else If:</span>
    }
  }

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
    return (
      <label>
        Complex Transition:
        {currentValue.map((t, i) => {
          return <div className='transition-option' key={i}>
            <label>
            {this.renderIf(i)} <ConditionalEditor {...this.props} conditional={t.condition} onChange={this.props.onChange(`${i}.condition`)}/>
            </label>
            <br/>
            <label>
              <DistributedTransitionEditor transition={{transition: t.distributions}} options={states} onChange={this.props.onChange(`[${i}].distributions`)} />
            </label>
            <br/>
            {this.renderUpDown(i)}
            <br/>
            <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>

          </div>
        })}

        <a className='editable-text add-button' onClick={() => this.props.onChange(`[${currentValue.length}]`)({val: {id: getTemplate('Transition.Complex[0]')}})}>+</a>

      </label>
    );
  }
}

export default ComplexTransition;
