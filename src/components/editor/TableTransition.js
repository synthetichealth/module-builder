// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber, RIETextArea } from 'riek';
import _ from 'lodash';
import Papa from 'papaparse'


//import type { TableTransition as TableTransitionType } from '../../types/Transition';
import { getTemplate } from '../../templates/Templates';
//import type { State } from '../../types/State';
import './Transition.css';
import Table from './Table'
import './TableTransition.css';
import { isNumber } from 'util';


type Props = {
  options: State[],
  transition?: TableTransitionType,
  onChange: any
}

class TableTransition extends Component<Props> {

  render() {
    let currentValue = [];
    let lookupTableName;
    if (this.props.transition) {
      currentValue = this.props.transition.transition;
      lookupTableName = this.props.transition.lookup_table_name_ModuleBuilder;
    } else {
      return null;
    }
    
    // update lookup table name for each transition
    for (let i = 0; i<this.props.transition.transition.length; i++)
    {
      if (this.props.transition.transition[i].lookup_table_name != lookupTableName)
      {
        this.props.onChange(`transitions[${i}].lookup_table_name`)({val: lookupTableName});
      }
    }

    let buttonText;
    let displayTable;
    
    if (this.props.transition.viewTable && this.props.transition.parsedData.length > 0 && Object.keys(this.props.transition.parsedData[0]).length > 0){
      buttonText = 'Display Editable Text Area'
      console.log('keys')
      console.log(Object.keys(this.props.transition.parsedData[0]))
      console.log('rows')
      console.log(this.props.transition.parsedData)
      displayTable = 
        <div className="TableTransition-table">
          <Table columnHeaders={Object.keys(this.props.transition.parsedData[0])} rows={this.props.transition.parsedData} />
        </div>
    }else{
      buttonText = 'Display Read Only Table'
      if (this.props.transition.lookuptable == ''){
        this.props.onChange(`lookuptable`)({val: 'Enter table'});
      }
      if (isNumber(this.props.transition.lookuptable)){
        this.props.transition.lookuptable = this.props.transition.lookuptable.toString();
      }
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
        {this.renderWarning()}
        <br/>
        </label>
        <div>
          <label>Lookup Table: 
            <RIEInput className='editable-text' value={lookupTableName} propName='lookup_table_name_ModuleBuilder' change={this.props.onChange(`lookup_table_name_ModuleBuilder`)} />
          </label>
          <br/>
         <button onClick={() => this.displayTableView()}>{buttonText}</button>
        <br/> 
        {displayTable}
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
    if (isNumber(data))
    {
      data  = data.toString();
    }
    Papa.parse(data, {
    header: true,
    complete: function(results) {
        d=results;
    }
    });
    
    for (let i=0; i<d.data.length; i++)
    {
        d.data[i]["originalIndex"] = i;
    }
    
    this.props.onChange('parsedData')({val:{id: d.data}});
  }    

  displayTableView() {        
    this.parseTextArea(this.props.transition.lookuptable);
    this.props.onChange('viewTable')({val: !this.props.transition.viewTable})
  }
}

export default TableTransition;
