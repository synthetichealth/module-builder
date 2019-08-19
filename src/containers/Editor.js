import React, { Component } from 'react'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import Joyride from 'react-joyride'
import ReactTooltip from 'react-tooltip'
import Draggable from 'react-draggable'

import StateEditor from '../components/editor/State';
import ModulePropertiesEditor from '../components/editor/ModuleProperties';
import ModuleGraph from '../components/graph/ModuleGraph';
import LoadModule from '../components/menu/LoadModule';
import Download from '../components/menu/Download';
import NavTabs from '../components/editor/NavTabs';
import { extractStates } from '../transforms/Module';
import {cleanString } from '../utils/stringUtils';

import { findAvailableKey, createSafeKeyFromName } from '../utils/keys';
import { getTemplate } from '../templates/Templates';
import { BasicTutorial } from '../templates/Tutorial';

import { RIEInput } from 'riek';

import examplitis from '../data/example_module'

import './Editor.css';

import JsonEditor from '../components/editor/JsonEditor';

import StateList from '../components/analysis/StateList';
import AttributeList from '../components/analysis/AttributeList';
import WarningList from '../components/analysis/WarningList';
import RelatedList from '../components/analysis/RelatedList';

import LoadingLogo from './synthea-animated-logo.svg'
// import SyntheaLogo from './synthea-logo-dark-glow.png'
import SyntheaLogo from './synthea-logo.png'
import MinimizePanel from './minimize-panel.png'
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
        jsonEdit,
        showLoadModule,
        hideLoadModule,
        showDownload,
        hideDownload,
        refreshCode,
        changeStateType,
        editModuleName,
        editModuleRemarks,
        closeModule,
        undo,
        redo,
        changeModulePanel} from '../actions/editor';

import {loadLibrary} from '../actions/library';

class Editor extends Component {

  constructor() {
    super();

    this.originalPanelWidth = 500;
    this.state = {
      joyride: {
        run: false,
        steps: BasicTutorial,
        stepIndex: 0
      },
      panelWidth: this.originalPanelWidth,
    }
  }

  componentDidMount() {
    import("../data/modules").then(modules => {
      this.props.loadLibrary({...examplitis, ...modules.default});

      // see https://github.com/wwayne/react-tooltip/issues/40
      setTimeout(() => {
       ReactTooltip.rebuild();
      }, 1000)
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

  copyNode = (targetModuleKey, targetNode) => {
    return () => {
      this.props.copyNode(targetModuleKey, targetNode);
    }
  }

  pasteNode = (selectedModuleKey, takenKeys, selectedState, selectedStateTransition) => {
    return () => {
      let key = findAvailableKey(createSafeKeyFromName(this.props.clipboard.name), takenKeys);
      let newState = _.cloneDeep(this.props.clipboard);
      this.props.addNode(selectedModuleKey, key, newState, selectedState, selectedStateTransition);
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
    if(this.props.selectedModuleKey){
      return <button className='button-clear' data-tip='Add a state to this graph.' onClick={this.addNode(this.props.selectedModuleKey, Object.keys(this.props.module.states), this.props.selectedStateKey, this.props.selectedStateTransition)}> + Add State </button>
    }
    return <div/>
  }

  renderUndoButton = () => {
    let className = 'button-clear';
    if(!this.props.undoEnabled){
      className+=' disabled'
    }
    return <button className={className} data-tip='Undo' onClick={() => this.props.undo()}> Undo</button>
  }

  renderRedoButton = () => {
    let className = 'button-clear';
    if(!this.props.redoEnabled){
      className+=' disabled'
    }
    return <button className={className} data-tip='Redo' onClick={() => this.props.redo()}> Redo</button>
  }

  renderDownloadButton = () => {
  }

  renderUndoButton = () => {
    let className = 'button-clear';
    if(!this.props.undoEnabled){
      className+=' disabled'
    }
    return <button className={className} data-tip='Undo' onClick={() => this.props.undo()}> Undo</button>
  }
  
  renderDeleteButton = () => {
    let className = 'button-clear';
    if(!this.props.selectedStateKey){
      className+=' disabled'
    }
    return <button className={className} data-tip='Delete State' onClick={() => this.props.selectedStateKey && this.onChange(`${this.props.selectedModuleKey}.states.${this.props.selectedStateKey}`)({val: {id: null}})}> Delete State</button>
  }

  renderCopyButton = () => {
    let className = 'button-clear';
    if(!this.props.selectedStateKey){
      className+=' disabled'
    }
    return <button className={className} data-tip='Copy State' onClick={this.props.selectedStateKey && this.copyNode(this.props.selectedModuleKey, this.props.moduleState, Object.keys(this.props.module.states))}> Copy State</button>
  }

  renderPasteButton = () => {
    let className = 'button-clear';
    if(!this.props.clipboard){
      className+=' disabled'
    }
    return <button className={className} data-tip='Paste State Here' onClick={this.props.clipboard && this.pasteNode(this.props.selectedModuleKey, Object.keys(this.props.module.states), this.props.selectedStateKey, this.props.selectedStateTransition)}> Paste State</button>
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

  renderLoadModule = () => {
    return <LoadModule modules={this.props.modules}
          library={this.props.library}
          visible={this.props.loadModuleVisible}
          onHide={this.props.hideLoadModule}
          push={this.props.push}
          welcome={!this.props.module}
          newModule={this.newModule(Object.keys(this.props.modules))}
          />
  }

  renderModulePropertiesEditor = () => {
    if(this.props.module){
      return <ModulePropertiesEditor
              module={this.props.module}
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

  onPanelResize = (event, data) => {
    this.setState({...this.state, panelWidth: this.state.panelWidth + data.deltaX})
  }

  onPanelResizeDone = () => {
    this.props.refreshCode();
    if(this.state.panelWidth <= 250){
      this.setState({...this.state, panelWidth: 250});
      this.leftNavClick('hide')();
    }
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
        return <JsonEditor onChange={(value) => {this.props.jsonEdit(value)}} module={this.props.module} refreshCodeFlag={this.props.refreshCodeFlag}/>
      case 'attribute':
        return <AttributeList attributes={this.props.attributes} selectedState={this.props.moduleState} modules={this.props.modules} states={this.props.moduleStates} onClick={this.props.selectNode} />
      case 'warning':
        return <WarningList warnings={this.props.warnings} selectedState={this.props.moduleState} onClick={this.props.selectNode} />
      case 'related':
        return <RelatedList related={this.props.relatedModules} selectedState={this.props.moduleState} onClick={this.props.selectNode} />
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

    return <li className={className}><button data-tip={dataTip} onClick={onClick}><img src={StateButton} alt=""/></button></li>
  }

  renderStateListButton = () => {
   let stateCount = <span className='Editor-button-count'>0</span>
   if(this.props.moduleStates.length > 0){
       stateCount = <span className='Editor-button-count'>{this.props.moduleStates.length}</span>
   }
   return <li className={this.props.selectedModulePanel === 'statelist' ? 'Editor-left-selected' : ''}><button data-tip='Searchable list of states.' onClick={this.leftNavClick('statelist')}><img src={StateListButton} alt=""/>{stateCount}</button></li>

  }

  renderAttributesButton = () => {
   let attributesCount = <span className='Editor-button-count'>0</span>
   if(this.props.attributes.length > 0){
     attributesCount = <span className='Editor-button-count'>{this.props.attributes.length}</span>
   }
   return <li className={this.props.selectedModulePanel === 'attribute' ? 'Editor-left-selected' : ''}><button data-tip='Attributes set in this module.' onClick={this.leftNavClick('attribute')}><img src={AttributeButton} alt=""/>{attributesCount}</button></li>

  }


  renderWarningButton = () => {
   let warningCount = <span className='Editor-button-count'>0</span>
   if(this.props.warnings.length > 0){
     warningCount = <span className='Editor-button-count Editor-button-count-warning'>{this.props.warnings.length}</span>
   }
   return <li className={this.props.selectedModulePanel === 'warning' ? 'Editor-left-selected' : ''}><button data-tip='Problems in module that need to be resolved.' onClick={this.leftNavClick('warning')}><img src={WarningButton} alt=""/>{warningCount}</button></li>

  }

  renderRelatedModulesButton = () => {

   let relatedCount = <span className='Editor-button-count'>0</span>
   if(this.props.relatedModules.length > 0){
     relatedCount = <span className='Editor-button-count'>{this.props.relatedModules.length}</span>
   }
   return <li className={this.props.selectedModulePanel === 'related' ? 'Editor-left-selected' : ''}><button data-tip='Related modules, such as those that share attributes. ' onClick={this.leftNavClick('related')}><img src={RelatedButton} alt=""/>{relatedCount}</button></li>

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

  renderNav = () => {
    return(
      <div className='Editor-top'>
        <img src={SyntheaLogo} className='Editor-top-logo' alt='Synthea Logo'/>
        <div className='Editor-top-title'>Synthea Module Builder</div>
        <div className='Editor-top-open'>
          <button className='button-clear' onClick={this.newModule(Object.keys(this.props.modules)).bind(this, undefined)}>New Module</button>
          <button className='button-clear' onClick={this.props.showLoadModule}>Open Module</button>
          <button className='button-clear Editor-top-download' onClick={this.props.showDownload}>Download</button>
        </div>
        <button className='button-clear Editor-top-help' onClick={this.startTutorial(BasicTutorial)}> ? </button>
        <NavTabs selectedModuleKey={this.props.selectedModuleKey}
                 modules={this.props.modules}
                 onChangeModule={(key) => this.props.push('#' + key)}
                 onCloseModule={(key) => {this.props.closeModule(key)}}
                 />
              
      </div>
    )

  }

  renderMainEditor = () => {

    if(!this.props.module){
      return <img className='Editor-loading-logo' src={LoadingLogo} alt='Loading'/>
    }

    return (
      <div className='Editor-main'>

        <div className='Editor-action-bar'>
              <RIEInput className='Editor-top-module' value={(this.props.module && this.props.module.name) || 'Untitled'} propName="name" change={(name) => {this.props.editModuleName(this.props.selectedModuleKey, name.name)}} />
             <div className='Editor-graph-buttons'>
                {this.renderAddStateButton()}
                {this.renderUndoButton()}
                {this.renderRedoButton()}
                {this.renderDeleteButton()}
                {this.renderCopyButton()}
                {this.renderPasteButton()}
                {this.renderDownloadButton()}

             </div>
        </div>

        <div className='Editor-left'>
         <ul>
        <li className={'Editor-left-fullscreen' + (!this.props.modulePanelVisible ? ' Editor-left-fullscreen-active' : '')}><button data-tip='Show/hide editor panel.' onClick={this.leftNavClick('hide')}><img src={FullscreenButton} alt=""/></button></li>
           <li className='Editor-left-spacer'></li>
           <li className={this.props.selectedModulePanel === 'info' ? 'Editor-left-selected' : ''}><button data-tip='Module Properties.' onClick={this.leftNavClick('info')}><img src={InfoButton} alt=""/></button></li>
           {this.renderStateButton()}
           <li className='Editor-left-spacer'></li>
           <li className={this.props.selectedModulePanel === 'code' ? 'Editor-left-selected' : ''}><button data-tip='Directly edit module JSON.' onClick={this.leftNavClick('code')}><img src={CodeButton} alt=""/></button></li>
           <li className='Editor-left-spacer'></li>
           {this.renderStateListButton()}
           {this.renderAttributesButton()}
           {this.renderWarningButton()}
           {this.renderRelatedModulesButton()}


         </ul>
        </div>

        <div className='Editor-panel' style={{left: this.props.modulePanelVisible ? 50 :  -this.state.panelWidth, width: this.state.panelWidth}}>
          <div className='Editor-panel-content'>
            <button className='Editor-panel-minimize button-clear' onClick={this.leftNavClick('hide')} ><img src={MinimizePanel} alt=""/></button>
            {this.renderPanelContent()}
          </div>

          <Draggable
             axis='x'
             onDrag={this.onPanelResize}
             onStop={this.onPanelResizeDone}
             bounds={{left: -250, top: 0, right: Infinity, bottom: 0}}
            >
            <div className='Editor-panel-resize' style={{left: this.originalPanelWidth - 8}}></div>
          </Draggable>

         </div>



        {this.renderModuleGraph()}


      </div>)

  }

  render() {

    return (
      <div className='Editor'>

        <ReactTooltip
          className='react-tooltip-customized'
          effect='solid'
          delayShow={800}
          />

        { this.renderNav() }

        { this.renderLoadModule() }
        { this.renderDownload() }

        { this.renderMainEditor() }


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
      </div>
    )
  }
}

const mapStateToProps = state => {

  let selectedModuleKey = state.editor.selectedModuleKey;

  let loadModuleVisible = state.editor.loadModuleVisible;

  if(!selectedModuleKey){
    loadModuleVisible = true;
  }

  let module = state.editor.modules[selectedModuleKey];

  let moduleStates = selectedModuleKey && extractStates(module);
  let moduleState =  moduleStates && moduleStates.find(s => (s.name === state.editor.selectedStateKey))

  let undoEnabled = state.editor.historyIndex < state.editor.history.length - 1;
  let redoEnabled = state.editor.historyIndex > 0;

  return {
    module,
    modules: state.editor.modules,
    library: state.library.modules,
    selectedModuleKey,
    moduleState,
    moduleStates,
    selectedStateKey: state.editor.selectedStateKey,
    selectedStateTransition: state.editor.selectedStateTransition,
    loadModuleVisible: loadModuleVisible,
    downloadVisible: state.editor.downloadVisible,
    selectedModulePanel: state.editor.selectedModulePanel,
    modulePanelVisible: state.editor.modulePanelVisible,
    warnings: state.analysis.warnings,
    relatedModules: state.analysis.relatedModules,
    attributes: state.analysis.attributes,
    undoEnabled,
    redoEnabled,
    refreshCodeFlag: state.editor.refreshCodeFlag,
    clipboard: state.editor.clipboard
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
  refreshCode,
  editModuleName,
  editModuleRemarks,
  changeModulePanel,
  jsonEdit,
  closeModule,
  undo,
  redo,
  push
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
