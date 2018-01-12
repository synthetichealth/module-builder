// @flow
import React, { Component } from 'react';

import svgPanZoom from  'svg-pan-zoom';

import Viz from 'viz.js';
import generateDOT from '../../utils/graphviz';

import './Module.css';

import type { Module } from './types/Module';
import type { State } from './types/State';

type Props = {
  module: Module,
  onClick: (id:string) => mixed,
  selectedNode: State
}

class ModuleGraph extends Component<Props> {

  constructor(props) {
    super(props);
    this.onPanZoom = this.onPanZoom.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  componentDidMount(){
    this.writeSVG(this.props.module)
    // this.svgPanZoom.zoom(.8);
    this.mount.addEventListener('mouseup', this.onMouseUp);
    this.mount.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillReceiveProps(nextProps: Props){

    this.writeSVG(nextProps.module, nextProps.selectedState);

    if(nextProps.module.name === this.props.module.name && this.panZoomSettings){
      this.blockPanZoomEvent = true
      this.svgPanZoom.zoom(this.panZoomSettings.zoom);
      this.svgPanZoom.pan(this.panZoomSettings.pan);
      this.blockPanZoomEvent = false
    }

  }

  render() {
    return (
        <div ref={mount => this.mount = mount } className="Module"></div>
    )
  }
  onMouseUp(e) {
    if(this.fireClickOnMouseUp){
      this.props.onClick(e);
    }
  }
  onMouseDown() {
    this.fireClickOnMouseUp = true;
  }

  onPanZoom() {
    if(this.blockPanZoomEvent) return;

    this.fireClickOnMouseUp = false;
    this.panZoomSettings = {pan: this.svgPanZoom.getPan(), zoom: this.svgPanZoom.getZoom()};
  }

  writeSVG(module: Module, selectedState: State){

    this.mount.innerHTML= Viz(generateDOT(module, selectedState));
    this.svgPanZoom = svgPanZoom(this.mount.children[0],{
        controlIconsEnabled: true, 
        minZoom: .1,
        onPan: this.onPanZoom,
        onZoom: this.onPanZoom,
      });

    Object.keys(module.states).forEach( s => {
      document.getElementById(`node_${s.replace('?','')}`).addEventListener('mouseup', (e) => {e.stopPropagation(); this.props.onClick(s)});
    })

    // document.getElementById('graph0').addEventListener('click', () => this.props.onClick(null));

    let appPanelWidth = document.getElementsByClassName('App-edit-panel')[0].offsetWidth

    if(!appPanelWidth){
      appPanelWidth=400;
      console.log('WARNING: NO PANEL WIDTH AS EXPECTED');
    }

    let availableWidth = document.getElementsByClassName('App')[0].offsetWidth - appPanelWidth
    let graphWidth = this.mount.children[0].clientWidth;

    let offset = 0;

    if(graphWidth > availableWidth){
      offset = graphWidth - availableWidth
    }

    this.mount.style.marginLeft = `-${offset}px`

    if(graphWidth > 500){
      document.getElementById('svg-pan-zoom-controls').attributes.transform.value = `translate(${offset}, 0) scale(0.75)`
    } else {
      document.getElementById('svg-pan-zoom-controls').style.visibility = 'hidden'

    }
  }
}

export default ModuleGraph;
