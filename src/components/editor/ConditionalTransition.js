// @flow
import React, { Component } from 'react';
import { RIESelect } from 'riek';
import _ from 'lodash';

import type { ConditionalTransition as ConditionalTransitionType } from '../../types/Transition';
import { getTemplate } from '../../templates/Templates';
import ConditionalEditor from './Conditional';
import type { State } from '../../types/State';
import './Transition.css';



type Props = {
  options: State[],
  transition?: ConditionalTransitionType,
  onChange: any
}

class ConditionalTransition extends Component<Props> {

  swapItems(indexTo,indexFrom) {
    if(indexTo >= 0 && indexTo < this.props.transition.transition.length){

      let oldEntry = {
        transition: this.props.transition.transition[indexTo].to,
        condition: _.clone(this.props.transition.transition[indexTo].condition)
      };

      let newEntry = {
        transition: this.props.transition.transition[indexFrom].to,
        condition: _.clone(this.props.transition.transition[indexFrom].condition)
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

    return (
      <label>
        Conditional Transition To:
        {currentValue.map((t, i) => {
          let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});
          return <div key={i} className='transition-option'>
            <label>
              {this.renderIf(i)} <ConditionalEditor {...this.props} conditional={t.condition} onChange={this.props.onChange(`${i}.condition`)}/>
            </label>
            <label>
              Transition To: <RIESelect className='editable-text' propName='to' value={{id:t.to, text:t.to}} change={this.props.onChange(`${i}.transition`)} options={options} />
            </label>
            <br/>
            {this.renderUpDown(i)}
            <br/>
            <a className="editable-text delete-button" onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>

          </div>
        })}
        <a className='editable-text add-button' onClick={() => this.props.onChange(`[${currentValue.length}]`)({val: {id: getTemplate('Transition.Conditional[0]')}})}>+</a>

      </label>
    );
  }
}

export default ConditionalTransition;
