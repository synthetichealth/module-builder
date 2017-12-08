// @flow
import React, { Component } from 'react';
import _ from 'lodash';

import './App.css';

import StateEditor from './components/editor/State';
import TextBox from './components/editor/TextBox';
import ModuleGraph from './components/graph/Module';
import type { State } from './types/State';

import { extractStates } from './transforms/Module';

import moduleJSON from './mocks/module';


type Props = {};
type AppState = {module: {}, states: State[], selectedState?: State, selectedStateIndex?: number}

class App extends Component<Props, AppState> {

  constructor() {
    super();
    let states = extractStates(moduleJSON);
    this.state = {states, module: moduleJSON};
  }

  onChangeBuilder = (index:number) => {
    return (path: any) => {
      return (e:any) => {
        let states = this.state.states
        let value = e.target.value;
        if(typeof _.get(states[index], path) === "number" && value * 1){
          value = value * 1;
        }
        _.set(states[index], path, value)
        this.setState({states})
      }
    }
  }

  onSelectNode = (id:string) => {
    let selectedState = this.state.states.find((s) => s.id === id);
    let selectedStateIndex = this.state.states.findIndex((s) => s.id === id);
    this.setState({selectedState, selectedStateIndex});
  }

  addState = () => {
    let states = this.state.states;
    states.push({name: `NewState_${states.length}`, type: 'Simple', transition: {to: states[0].name}})
    this.setState({states});
  }

  onTextChange = (event) => {
    try {
      let module = JSON.parse(event.target.value)
      this.setState({module})
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="App">
        <TextBox module={this.state.module} onChange={this.onTextChange}/>
        <ModuleGraph states={this.state.states} module={this.state.module} onClick={this.onSelectNode} /><div>

        <button onClick={this.addState}> Add State </button>
        <div style={{margin: '50px'}}>
        <StateEditor
          state={this.state.selectedState}
          otherStates={this.state.states}
          onChangeBuilder={this.onChangeBuilder(this.state.selectedStateIndex)}/>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
