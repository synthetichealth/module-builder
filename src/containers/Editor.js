import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StateEditor from '../components/editor/State';
import ModuleGraph from '../components/graph/Module';
import { extractStates } from '../transforms/Module';


import {selectNode, addNode, editNode, renameNode} from '../actions/editor';

class Editor extends Component {


  /*
    This is a recursive function to track the path that an edit action took through the Inspector
    It was written this way because there's multiple ways that one could get to, say, a Conditional Editor
    By keeping track of where it's been it means that the action can just look into the modules along the path
  */
  onChange  = (update, path=[]) => {
    if(typeof update != 'object') {
      return (val) => this.onChange(val, [].concat(path, [update]))
    }
    this.props.editNode(update, path)
  }

  renameNode = (targetModuleIndex, targetNode) => {
    return (newName) => {
        this.props.renameNode(targetModuleIndex, targetNode, newName);
    }

  }

  render() {
    return (
      <div className="App">
        <ModuleGraph module={this.props.module} onClick={this.props.selectNode} />
        <div className="App-edit-panel">
            <button onClick={() => this.props.addNode('test')}> Add State </button>
            <div style={{margin: '50px'}}>
            <StateEditor
              renameNode={this.renameNode(this.props.selectedModuleIndex, this.props.selectedState)}
              state={this.props.selectedState}
              otherStates={this.props.states}
              onChange={this.onChange(this.props.selectedModuleIndex)} />
            </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
    let selectedModule = state.modules[state.editor.currentModuleIndex];
    let states = extractStates(selectedModule)
    let selectedNode = states.find((s) => s.name == state.editor.currentNode)
    return {
      module: selectedModule,
      selectedState: selectedNode,
      states,
      selectedModuleIndex: state.editor.currentModuleIndex
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  selectNode,
  addNode,
  editNode,
  renameNode
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
