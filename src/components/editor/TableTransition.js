// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber, RIETextArea } from 'riek';
import _ from 'lodash';
import Papa from 'papaparse'


import type { TableTransition as TableTransitionType } from '../../types/Transition';
import { getTemplate } from '../../templates/Templates';
import type { State } from '../../types/State';
import './Transition.css';
import Table from './Table'
import './TableTransition.css';


type Props = {
  options: State[],
  transition?: TableTransitionType,
  onChange: any
}

class TableTransition extends Component<Props> {

  state = {
    parsedData : '',
    display : false,
    buttonText : 'Display Read-Only Table'
  } 

  render() {
    let currentValue = [];
    let cv;
    if (this.props.transition) {
      currentValue = this.props.transition.transition;
      cv = this.props.transition.lookup_table_name;
    }
    if(!this.props.transition) {
      return null;
    }

    let displayTable;

    if (this.state.display){
      displayTable = 
        <div className="TableTransition-table">
          <Table columnHeaders={Object.keys(this.state.parsedData[0])} initialRows={this.state.parsedData} />
        </div>
    }else{
      displayTable = 
        <div className='TableTransition-remarks'>
          <RIETextArea value={this.props.transition.lookuptable} propName='lookuptable' change={this.props.onChange(`lookuptable`)}/>
        </div>
    }
    let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});
    return (
      <div>
      <label>
        Table Transition:
        {
          currentValue.map((t, i) => {
          return <div key={i} className="transition-option">
            <label>To:
              <RIESelect className='editable-text' propName='transition' value={{id:t.transition, text:t.transition}} change={this.props.onChange(`transitions[${i}].transition`)} options={options} />
            </label>
            <br/>
            {this.renderDistribution(t.default_probability, i)}
            <br />
            <a className='editable-text delete-button' onClick={() => this.props.onChange(`transitions[${i}]`)({val: {id: null}})}>remove</a>
          </div>
        })}
        <a className='editable-text add-button' onClick={() => this.props.onChange(`transitions[${currentValue.length}]`)({val: {id: getTemplate('Transition.Table.transitions[0]')}})}>+</a>
        <br/>
        <br/>
        </label>
        <div>
          <label>Lookup Table: 
            <RIEInput className='editable-text' value={cv} propName='lookup_table_name' change={this.props.onChange(`lookup_table_name`)} />
          </label>
          <br/>
        <button onClick={() => this.displayTableView()}>{this.state.buttonText}</button>
        <br/>
        {displayTable}
        <br/>
        {this.renderWarning()}
      </div>
      </div>
    );
  }

  renderDistribution(distribution: mixed, index: number) {    
    let sum = this.props.transition.transition.reduce( (acc, val) => acc + val.default_probability, 0);
    let remainder = 1 - (sum - distribution);
    let remainderOption = null
    if (sum != 1) {
      remainderOption = <a className='editable-text' onClick={() => this.props.onChange(`transitions[${index}].default_probability`)({val: remainder})}>(Change to Remainder)</a>
    }
    return (
      <label> Default Weight:
        <RIENumber className='editable-text' value={distribution} propName='default_probability' editProps={{step: .01, min: 0, max: 1}} format={this.formatAsPercentage} validate={this.checkInRange} change={this.props.onChange(`transitions[${index}].default_probability`)} />
        {remainderOption}
        </label>
    );
  }

  renderWarning() {
    if(!this.props.transition) {
      return null;
    }
    let warn = (this.props.transition.transition.reduce((acc, val) => acc + (typeof val.default_probability === 'object' ? val.default_probability.default : val.default_probability), 0) !== 1);
    if (warn) {
      return (
        <label className='warning'>Weights do not add up to 100%.</label>
      );
    }
  }

  formatAsPercentage(num: number) {
    return (num * 100) + "%";
  }

  checkInRange(num: number) {
    return ((num >= 0) && (num <= 1));
  }

  parseTextArea(data) {
    let d;
    Papa.parse(data, {
    header: true,
    complete: function(results) {
        d=results;
    }
    });
    
    var i;
    for (i=0; i<d.data.length; i++)
    {
        d.data[i]["originalIndex"] = i;
    }
    this.setState({parsedData : d.data});
  }    

  displayTableView() {        
    console.log('in display table view')
    if (this.state.display){
      this.setState({buttonText: 'Display Read-Only Table'});
    }else {
      this.setState({buttonText: 'Display Editable Text Area'});
    }
    this.parseTextArea(this.props.transition.lookuptable);
    this.setState({display: !this.state.display});
  }
}

export default TableTransition;
