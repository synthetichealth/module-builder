import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StateEditor from '../components/editor/State';
import ModuleGraph from '../components/graph/Module';

import {selectNode, addNode, editNode} from '../actions/editor';

class Editor extends Component {

  onChange = (moduleIndex, node) => {
    return (update) => {
      this.props.editNode(moduleIndex, node, update)
    }
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
          onChange={this.onChange(this.props.selectedModuleIndex, this.props.selectedState)} />
        </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  // TODO Implement this
    let selectedModule = state.modules[state.editor.currentModuleIndex];
    let selectedNode = selectedModule.find((s) => s.id == state.editor.currentNode)
    // selectedNode = selectedNode <  ? null : selectedNode;
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
