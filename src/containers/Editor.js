import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import Joyride from 'react-joyride'
import ReactTooltip from 'react-tooltip'

import StateEditor from '../components/editor/State';
import ModulePropertiesEditor from '../components/editor/ModuleProperties';
import ModuleGraph from '../components/graph/ModuleGraph';
import LoadModule from '../components/menu/LoadModule';
import Download from '../components/menu/Download';
import { extractStates } from '../transforms/Module';
import {cleanString } from '../utils/stringUtils';

import { findAvailableKey, createSafeKeyFromName } from '../utils/keys';
import { getTemplate } from '../templates/Templates';
import { BasicTutorial, EditTutorial } from '../templates/Tutorial';

import './Editor.css';
import '../../node_modules/react-joyride/lib/react-joyride-compiled.css'

import StateList from '../components/analysis/StateList';
import AttributeList from '../components/analysis/AttributeList';

import SyntheaLogo from './synthea-logo-dark-glow.png'
import FullscreenButton from './fullscreen.png'
import InfoButton from './Info.png'
import StateButton from './state-button.png'
import StateListButton from './statelist.png'
import CodeButton from './code-button.png'
import AttributeButton from './attribute-button.png'
import RelatedButton from './related-button.png'
import WarningButton from './warning-button.png'

import {selectNode,
        addNode,
        addStructure,
        addTransition,
        editNode,
        renameNode,
        copyNode,
        newModule,
        showLoadModule,
        hideLoadModule,
        showDownload,
        hideDownload,
        changeStateType,
        editModuleName,
        editModuleRemarks,
        changeModulePanel} from '../actions/editor';

import {loadLibrary} from '../actions/library';

class Editor extends Component {

  constructor() {
    super();
    this.state = {
      joyride: {
        run: false,
        steps: BasicTutorial,
        stepIndex: 0
      }
    }
  }

  componentDidMount() {
    import("../data/modules").then(modules => {
      this.props.loadLibrary(modules.default);
    });
  }

  /*
    This is a recursive function to track the path that an edit action took through the Inspector
    It was written this way because there's multiple ways that one could get to, say, a Conditional Editor
    By keeping track of where it's been it means that the action can just look into the modules along the path
  */
  onChange  = (update, path=[]) => {
    if(typeof update !== 'object') {
      return (val) => this.onChange(val, [].concat(path, [update]))
    }
    this.props.editNode(update, path)
  }

  renameNode = (targetModuleKey, targetNode) => {
    return (newName) => {
      newName.name = cleanString(newName.name, {'.': '', '\\': '', '|': ''});
      this.props.renameNode(targetModuleKey, targetNode, newName);
    }
  }

  copyNode = (targetModuleKey, targetNode, takenKeys) => {
    return () => {
      let newNodeName = findAvailableKey(targetNode.name, takenKeys);
      this.props.copyNode(targetModuleKey, targetNode, newNodeName);
    }
  }

  changeStateType = (targetModuleKey, targetNode) => {
    return (newType) => {
      this.props.changeStateType(targetModuleKey, targetNode, newType);
    }
  }

  addTransition = (targetModuleKey, targetNode) => {
    return (transitionType) => {
      this.props.addTransition(targetModuleKey, targetNode, transitionType)
    }
  }

  newModule = (takenKeys) => {
    return (module = getTemplate('Module.Blank')) => {
      let key = findAvailableKey(createSafeKeyFromName(module.name), takenKeys);
      this.props.newModule(key, module);
      this.props.push('#' + key)
    }
  }

  addNode = (selectedModuleKey, takenKeys, selectedState, selectedStateTransition) => {
    return () => {
      let key = findAvailableKey(createSafeKeyFromName('New State'), takenKeys);
      let newState = {...getTemplate('State.Simple'), direct_transition: key };
      this.props.addNode(selectedModuleKey, key, newState, selectedState, selectedStateTransition);
    }
  }

  startTutorial = (steps) => {
    return () => {
      this.joyride.reset(true);
      this.setState({joyride: {run: true, steps}})
    }
  }
  renderAddStateButton = () => {
    if(this.props.module){
      return <button className='' data-tip='Add a state to this graph.' onClick={this.addNode(this.props.selectedModuleKey, Object.keys(this.props.module.states))}> Add State </button>
    }
    return <div/>
  }

  renderInsertStateButton = () => {
    if(this.props.module){

      let className = ''
      let tip = 'Insert a state within the currently selected a transition.'
      let onClick = this.addNode(this.props.selectedModuleKey, Object.keys(this.props.module.states), this.props.selectedStateKey, this.props.selectedStateTransition);
      if(typeof this.props.selectedStateTransition !== 'number'){
        className = 'Insert a state within a transition.  Please select a transition.'
        className = 'disabled'
        onClick = () => {};
      }
      return <button className={className} 
                     data-tip='Insert a state within a transition.  Please select a transition.' 
                     onClick={onClick}> Insert State </button>
    }
    return <div/>
  }

  renderStateEditor = () => {
    if(this.props.module){
      return <StateEditor
        moduleName={this.props.module.name}
        helpFunction={this.startTutorial}
        renameNode={this.renameNode(this.props.selectedModuleKey, this.props.moduleState)}
        changeType={this.changeStateType(this.props.selectedModuleKey, this.props.moduleState)}
        copyNode={this.copyNode(this.props.selectedModuleKey, this.props.moduleState, Object.keys(this.props.module.states))}
        addTransition={this.addTransition(this.props.selectedModuleKey, this.props.moduleState)}
        state={this.props.moduleState}
        otherStates={this.props.moduleStates}
        onChange={this.onChange(this.props.selectedModuleKey)} />
    }
    return <div/>

  }

  renderDownload = () => {
    if(this.props.module){
      return <Download module={this.props.module}
        visible={this.props.downloadVisible}
        onHide={this.props.hideDownload}/>
    }
    return <div/>
  }

  renderModulePropertiesEditor = () => {
    if(this.props.module){
      return <ModulePropertiesEditor
              module={this.props.module}
              onNameChange={(name) => this.props.editModuleName(this.props.selectedModuleKey, name)}
              onRemarksChange={(remarks) => this.props.editModuleRemarks(this.props.selectedModuleKey, remarks)}/>
    }
    return <div/>
  }

  renderModuleGraph = () => {
    if(this.props.module){
      return <ModuleGraph
            module={this.props.module}
            fullscreen={!this.props.modulePanelVisible}
            onClick={this.props.selectNode}
            selectedState={this.props.moduleState}
            selectedStateTransition={this.props.selectedStateTransition}/>
    }
    return <div/>
  }

  renderPanelContent = () => {
    switch(this.props.selectedModulePanel){
      case 'info':
        return this.renderModulePropertiesEditor();
      case 'state':
        return this.renderStateEditor();
      case 'statelist':
        return <StateList selectedState={this.props.moduleState} states={this.props.moduleStates} onClick={this.props.selectNode} />
      case 'code':
        return <div>Code Editor not yet implemented.</div>
      case 'attribute':
        return <AttributeList selectedState={this.props.moduleState} modules={this.props.modules} states={this.props.moduleStates} onClick={this.props.selectNode} />
      case 'warning':
        return <div>Warning list not yet implemented.</div>
      case 'related':
        return <div>Related modules not yet implemented.</div>
      default:
        return <div/>
    }
  }

  renderStateButton = () => {
    let className = '';
    let onClick = this.leftNavClick('state');
    if(this.props.selectedModulePanel === 'state'){
      className = 'Editor-left-selected';
    } else if(!this.props.moduleState){
      className = 'Editor-left-disabled';
      onClick = () => {};
    }
    let dataTip = 'View currently selected state.'

    if(this.props.moduleStates){
      dataTip += ' Please selected a state in the graph, state list, or attribute list.'
    }

    return <li className={className}><button data-tip={dataTip} onClick={onClick}><img src={StateButton}/></button></li>
  }


  leftNavClick = (nav) => {
    return () => {
      if(nav !== 'hide' || (nav === 'hide' && this.props.modulePanelVisible)){
        this.props.changeModulePanel(nav);
      } else if (nav === 'hide') {
        if(this.props.selectedStateKey){
          this.props.changeModulePanel('state');
        } else {
          this.props.changeModulePanel('info');
        }
      }
    }
  }

  render() {
    return (
      <div className='Editor'>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
          <a className="navbar-brand Editor-title" href="#">
            <img src={SyntheaLogo} className='synthea-logo'/>
            Synthea Module Builder
           </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <button className="btn btn-link nav-item nav-link" onClick={this.newModule(Object.keys(this.props.modules)).bind(this, undefined)}>New Module</button>
              <button className="btn btn-link nav-item nav-link" onClick={this.props.showLoadModule}>Load Module</button>
              <button className="btn btn-link nav-item nav-link" onClick={this.props.showDownload}>Download</button>
              <button className='btn btn-secondary nav-action-button' onClick={this.startTutorial(BasicTutorial)}> Help </button>
            </div>
          </div>
        </nav>
        <button className="Editor-fullscreen-name" onClick={this.leftNavClick('info')}>
           {this.props.module.name}
        </button>

        <LoadModule modules={this.props.modules}
          library={this.props.library}
          visible={this.props.loadModuleVisible}
          onHide={this.props.hideLoadModule}
          push={this.props.push}
          newModule={this.newModule(Object.keys(this.props.modules))}
          />

        {this.renderDownload()}

        <div className='Editor-main'>

          <div className='Editor-left'>
           <ul>
             <li className={'Editor-left-fullscreen'}><button data-tip='Show/hide editor panel.' onClick={this.leftNavClick('hide')}><img className={!this.props.modulePanelVisible ? 'Editor-left-fullscreen-active' : 'Editor-left-fullscreen-inactive'} src={FullscreenButton}/></button></li>
             <li className='Editor-left-spacer'></li>
             <li className={this.props.selectedModulePanel === 'info' ? 'Editor-left-selected' : ''}><button data-tip='Module Properties.' onClick={this.leftNavClick('info')}><img src={InfoButton}/></button></li>
             {this.renderStateButton()}
             <li className='Editor-left-spacer'></li>
             <li className={this.props.selectedModulePanel === 'statelist' ? 'Editor-left-selected' : ''}><button data-tip='Searchable list of states.' onClick={this.leftNavClick('statelist')}><img src={StateListButton}/></button></li>
             <li className={this.props.selectedModulePanel === 'attribute' ? 'Editor-left-selected' : ''}><button data-tip='Attributes set in this module.' onClick={this.leftNavClick('attribute')}><img src={AttributeButton}/></button></li>
             <li className={this.props.selectedModulePanel === 'warning' ? 'Editor-left-selected' : ''}><button data-tip='Problems in module that need to be resolved. Not yet implemented.' onClick={this.leftNavClick('warning')}><img src={WarningButton}/></button></li>
             <li className={this.props.selectedModulePanel === 'related' ? 'Editor-left-selected' : ''}><button data-tip='Related modules, such as those that share attributes. Not yet implemented.' onClick={this.leftNavClick('related')}><img src={RelatedButton}/></button></li>
             <li className={this.props.selectedModulePanel === 'code' ? 'Editor-left-selected' : ''}><button data-tip='Directly edit module JSON. Not yet implemented.' onClick={this.leftNavClick('code')}><img src={CodeButton}/></button></li>
           </ul>
          </div>

          <div className={'Editor-panel ' +  (!this.props.modulePanelVisible ? 'Editor-panel-hidden' : 'Editor-panel-show')}>
            <div className="Editor-module-name">
              <span className="Module-name">
                {this.props.module.name}
              </span>
            </div>

            <div className='Editor-panel-content'>
              {this.renderPanelContent()}
            </div>

           </div>

           <div className='Editor-graph-buttons'>
              {this.renderAddStateButton()}
              {this.renderInsertStateButton()}
              {/*<button className='btn btn-secondary nav-action-button' onClick={() => this.props.addStructure(this.props.selectedModuleKey, 'CheckYearly')}> Add Structure </button> */}
              <button className='disabled' data-tip='Structures are not yet available' onClick={() => null}> Add Structure </button>

           </div>

          {this.renderModuleGraph()}


        </div>

        <Joyride
          ref={c => (this.joyride = c)}
          showOverlay={true}
          showSkipButton={true}
          showStepsProgress={false}
          type={'continuous'}
          steps={this.state.joyride.steps}
          run={this.state.joyride.run}
          autoStart={true}
          debug={false}
          allowClicksThruHole={false}
          keyboardNavigation={true}
        />

        <ReactTooltip
          className='react-tooltip-customized'
          effect='solid'
          />

      </div>
    )
  }
}

const mapStateToProps = state => {

  let selectedModuleKey = state.editor.selectedModuleKey;

  if(!state.editor.modules[selectedModuleKey]){
    selectedModuleKey = Object.keys(state.editor.modules)[0];
  }

  let module = state.editor.modules[selectedModuleKey];
  let moduleStates = extractStates(module);
  let moduleState =  moduleStates.find(s => (s.name === state.editor.selectedStateKey))

  return {
    module,
    modules: state.editor.modules,
    library: state.library.modules,
    selectedModuleKey,
    moduleState,
    moduleStates,
    selectedStateKey: state.editor.selectedStateKey,
    selectedStateTransition: state.editor.selectedStateTransition,
    loadModuleVisible: state.editor.loadModuleVisible,
    downloadVisible: state.editor.downloadVisible,
    selectedModulePanel: state.editor.selectedModulePanel,
    modulePanelVisible: state.editor.modulePanelVisible
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  selectNode,
  addNode,
  addStructure,
  addTransition,
  editNode,
  renameNode,
  copyNode,
  changeStateType,
  newModule,
  loadLibrary,
  showLoadModule,
  hideLoadModule,
  showDownload,
  hideDownload,
  editModuleName,
  editModuleRemarks,
  changeModulePanel,
  push
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
