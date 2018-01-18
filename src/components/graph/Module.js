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
    this.bold = false;
  }

  componentDidMount(){
    this.writeSVG(this.props.module)
    this.mount.addEventListener('mouseup', this.onMouseUp);
    this.mount.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillReceiveProps(nextProps: Props){

    if(nextProps.module.name !== this.props.module.name){
      this.panZoomSettings = null
    }

    this.writeSVG(nextProps.module, nextProps.selectedState);

    if(this.panZoomSettings){
      this.blockPanZoomEvent = true
      this.svgPanZoom.zoom(this.panZoomSettings.zoom, true);
      this.svgPanZoom.pan(this.panZoomSettings.pan, true);
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

    let linesShouldBold = Math.max(this.originalWidth, this.originalHeight) / this.svgPanZoom.getZoom() > 1500

    if(linesShouldBold && !this.bold){
      this.bold = true
      this.mount.className = 'Module bold-lines'
    } else if(!linesShouldBold && this.bold){
      this.bold = false
      this.mount.className = 'Module'
    }

  }

  writeSVG(module: Module, selectedState: State){

    /* write SVG */
    this.mount.innerHTML= Viz(generateDOT(module, selectedState));

    let svg = this.mount.children[0]

    /* add event handlers */
    Object.keys(module.states).forEach( s => {
      let el = document.getElementById(`node_${s.replace('?','')}`)
 ;     if(el){
        el.addEventListener('mouseup', (e) => {e.stopPropagation(); this.props.onClick(s)});
      }
    })

    /* add pan/zoom if available */
    if(typeof svgPanZoom === "function"){

      this.originalWidth = svg.attributes.width.value.match(/\d+/g).map(Number)[0];
      this.originalHeight = svg.attributes.height.value.match(/\d+/g).map(Number)[0];

      let offsetLeft = this.mount.getBoundingClientRect().x
      let offsetTop = this.mount.getBoundingClientRect().y
      let visibleWidth = this.mount.getBoundingClientRect().width - offsetLeft;
      let visibleHeight = this.mount.getBoundingClientRect().width - offsetTop;


      this.mount.children[0].setAttribute('width', '100%')
      this.mount.children[0].setAttribute('height', '100%')

      let zoomFactor = 1

      if(this.originalWidth / this.originalHeight > visibleWidth / visibleHeight){
        //width constrained
        zoomFactor = visibleWidth / this.originalWidth;
      } else {
        //height constrained
        zoomFactor = visibleHeight / this.originalHeight;
      }

      this.svgPanZoom = svgPanZoom(this.mount.children[0],{
          controlIconsEnabled: true, 
          minZoom: .1,
          onPan: this.onPanZoom,
          onZoom: this.onPanZoom,
        });

      if(!this.panZoomSettings){
        /* first time load of module */
        this.svgPanZoom.pan({x: this.svgPanZoom.getPan().x - offsetLeft/2 , y: 0}, true)
        this.svgPanZoom.zoom(Math.pow(.8,zoomFactor), true);
      }

    }

  }
}

export default ModuleGraph;
