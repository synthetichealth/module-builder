// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber, RIETextArea } from 'riek';
import Papa from 'papaparse'

import { getTemplate } from '../../templates/Templates';
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
      this.fixMissingValues();
      currentValue = this.props.transition.transition;
      lookupTableName = this.props.transition.lookup_table_name_ModuleBuilder;
    } else {
      return null;
    }

    let buttonText;
    let displayTable;
    let displayTableError;
    
    if (this.props.transition.viewTable && !this.doesDataHaveInputError()){
      buttonText = 'Display Editable Text Area';
      let data = this.parseTextArea(this.props.transition.lookuptable);
      displayTable = 
        <div className="TableTransition-table">
          <Table columnHeaders={Object.keys(data[0])} rows={data} />
        </div>
    }else{
      buttonText = 'Display Read Only Table';
      if (this.props.transition.lookuptable === ''){
        this.props.onChange(`lookuptable`)({val: 'Enter table'});
      }else if (isNumber(this.props.transition.lookuptable)){
        this.props.transition.lookuptable = this.props.transition.lookuptable.toString();
      }
      displayTable = 
        <div className='TableTransition-remarks'>
          <RIETextArea value={this.props.transition.lookuptable} propName='lookuptable' change={this.props.onChange(`lookuptable`)}/>
        </div>
    }
    if (this.doesDataHaveInputError()){
      displayTableError= <label className='warning'>Invalid table data. The table must have a header row and be separated by commas.</label>
    }else {
      let msg = this.checkTable();
      displayTableError = <label className='warning'>{msg}</label>
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
            <a className='editable-text delete-button' onClick={() => this.props.onChange(`transitions.[${i}]`)({val: {id: null}})}>remove</a>
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
          {displayTableError}
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
    if (sum !== 1) {
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
    let parsed;
    if (isNumber(data))
    {
      data  = data.toString();
    }
    Papa.parse(data, {
    header: true,
    complete: function(results) {
      parsed=results;
    }
    });

    return parsed.data;
  }    

  displayTableView() {        
    // need to check if the table is correct and that it will be ok being displayed as a table before changing this to true
    // otherwise the undo take an extra click
    if (!this.doesDataHaveInputError())
    {
      this.props.onChange('viewTable')({val: !this.props.transition.viewTable})
    }
  }

  fixMissingValues(){
    if (this.props.transition.lookuptable === undefined)
    {
      this.props.transition.lookuptable = '';
    }
    if (this.props.transition.viewTable === undefined)
    {
      this.props.transition.viewTable = false;
    }
    if (this.props.transition.lookup_table_name_ModuleBuilder === undefined)
    {
      if (this.props.transition.transition[0].lookup_table_name !== ''){
        this.props.transition.lookup_table_name_ModuleBuilder = this.props.transition.transition[0].lookup_table_name;
      }else{
        this.props.transition.lookup_table_name_ModuleBuilder = '';
      }
    }
  }

  doesDataHaveInputError(){    
    let data = this.parseTextArea(this.props.transition.lookuptable);
    let textOk = !(this.props.transition.lookuptable === 'Enter table' || this.props.transition.lookuptable === '')
    let parseOk = (data.length > 0 && Object.keys(data[0]).length > 0)
    if (textOk && parseOk ){
        return false;
      } else {
        return true;
      } 
  }

  checkTable(){
    let message = ''
    // check the last X columns vs X transitions
    if (this.doesDataHaveInputError()){
      return message;
    }
    let tableColumns = [];
    let data = this.parseTextArea(this.props.transition.lookuptable);
    if (data.length > 0){ 
      tableColumns = Object.keys(data[0]);
    }

    for (let i = 0; i < this.props.transition.transition.length; i++)
    {
      let transition = this.props.transition.transition[this.props.transition.transition.length - i - 1].transition;
      let column = tableColumns[tableColumns.length-i -1];
      if (transition !== column)
      {
        message += 'Invalid columns (table data and transitions to state don\'t match) '
        break;
      }
    }

    return message;    
  }
}

export default TableTransition;
