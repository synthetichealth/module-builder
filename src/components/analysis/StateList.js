// @flow
import React, { Component } from 'react';
import _ from 'lodash';

import './StateList.css';
import CancelButton from './cancel-button.svg';

type Props = {
  states: State[],
  selectedState: State,
  onChange: any,
}

class StateList extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {search: ''};
  }

  onClick(state) {
    return () => { console.log(state.name);this.props.onClick(state.name)}
  }

  onChange(event){
    this.setState({search: event.target.value});
    console.log(event.target.value)
  }

  clearSearch(){
    this.setState({search: ''})
  }

  stateFilter(state){
    return state.name.toLowerCase().includes(this.state.search.toLowerCase()) || 
           state.type.toLowerCase().includes(this.state.search.toLowerCase());
  }

  render() {
    return (<div className='StateList'>
          <div className='StateList-header'> 
             State List
          </div>
          <div className="btn-group">
            <input type="text" className="form-control" placeholder="Find" value={this.state.search} onChange={this.onChange.bind(this)}/>
            <img className="search-clear" src={CancelButton} onClick={this.clearSearch.bind(this)}/>
            <span id="searchclear" className="glyphicon glyphicon-remove-circle"></span>
          </div>
          <table className="table table-sm table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">State</th>
                  <th scope="col">Type</th>
                </tr>
              </thead>
              <tbody>
              {this.props.states.filter(this.stateFilter.bind(this)).map((state,i) => {
                return (
                  <tr key={i} onClick={this.onClick(state)} className={this.props.selectedState && (state.name === this.props.selectedState.name) ? "table-info" : ""}>
                    <th scope="row">{state.name}</th>
                    <td>{state.type}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>)
  }
}

export default StateList;
