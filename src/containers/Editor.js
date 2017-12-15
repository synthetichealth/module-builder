import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StateEditor from '../components/editor/State';
import ModuleGraph from '../components/graph/Module';
import { extractStates } from '../transforms/Module';


import {selectNode, addNode, editNode} from '../actions/editor';

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

  render() {
    return (
      <div className="App">
        <ModuleGraph states={this.props.states} steps={300} onClick={this.props.selectNode} />
        <div>
        <button onClick={() => this.props.addNode('test')}> Add State </button>
        <div style={{margin: '50px'}}>
        <StateEditor
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
    let selectedModule = extractStates(state.modules[state.editor.currentModuleIndex]);
    let selectedNode = selectedModule.find((s) => s.name == state.editor.currentNode)
    return {
      states: selectedModule,
      selectedState: selectedNode,
      selectedModuleIndex: state.editor.currentModuleIndex
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  selectNode,
  addNode,
  editNode
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
