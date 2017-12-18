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
      <div className="App container-fluid">
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Synthea Module Builder</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-item nav-link" href="#">New Module</a>
              <a className="nav-item nav-link" href="#">Load Module</a>
              <a className="nav-item nav-link" href="#">Save Module</a>
            </div>
          </div>
        </nav>
        <div className="App-body">
          <button className='btn btn-primary' onClick={() => this.props.addNode('test')}> Add State </button>
          <ModuleGraph module={this.props.module} onClick={this.props.selectNode} />
          <div className="App-edit-panel">
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
