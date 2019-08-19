// @flow
import React, { Component } from 'react';

import svgPanZoom from  'svg-pan-zoom';

import Viz from 'viz.js';
import {generateDOT,svgDefs} from '../../utils/graphviz';

import './ModuleGraph.css';

import type { Module } from './types/Module';
import type { State } from './types/State';

type Props = {
  module: Module,
  onClick: (id:string) => mixed,
  selectedState: State
}

class ModuleGraph extends Component<Props> {

  constructor(props) {
    super(props);
    this.onPanZoom = this.onPanZoom.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.bold = false;
    this.lastDOT = '';
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

    this.writeSVG(nextProps.module, nextProps.selectedState, nextProps.selectedStateTransition);

    if(nextProps.fullscreen !== this.props.fullscreen){
      if(nextProps.fullscreen){
        this.svgPanZoom.panBy({x: 250, y: 0});
        this.customPanBy({x: -100, y: 0})
      }else{
        this.svgPanZoom.panBy({x: -250, y: 0});
        this.customPanBy({x: 100, y: 0})
      }
    }

    if(this.panZoomSettings){
      this.blockPanZoomEvent = true
      this.svgPanZoom.zoom(this.panZoomSettings.zoom, true);
      this.svgPanZoom.pan(this.panZoomSettings.pan, true);
      this.blockPanZoomEvent = false
    }

  }

  customPanBy(amount) { // {x: 1, y: 2}
    var animationTime = 300 // ms
      , animationStepTime = 15 // one frame per 30 ms
      , animationSteps = animationTime / animationStepTime
      , animationStep = 0
      , intervalID = null
      , stepX = amount.x / animationSteps
      , stepY = amount.y / animationSteps

    intervalID = setInterval(() => {
      if (animationStep++ < animationSteps) {
        if(this.svgPanZoom){
        this.svgPanZoom.panBy({x: stepX, y: stepY})
        }
      } else {
        // Cancel interval
        clearInterval(intervalID)
      }
    }, animationStepTime)
  }


  render() {
    return (
        <div ref={mount => this.mount = mount } className={'Module ' + (this.props.fullscreen ? "Module-fullscreen" : 'Module-standard-screen')}>
         <svg width="50000px" height="50000px" xmlns="http://www.w3.org/2000/svg" style={{opacity: .3}}>
           <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#95b4cf" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)"/>
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#95b4cf" strokeWidth="1"/>
            </pattern>
          </defs>
          <g>
            <rect width="100%" height="100%" style={{"transform": "translate(-50%, -50%)"}} fill="url(#grid)" />
          </g>
        </svg>
        <div style={{"position":"absolute", "top": 0, "left": 0, "width": "100%", "height": '100%'}} className="Module-graph">
        </div>
      </div>
    )
  }
  onMouseUp(e) {
    if(this.fireClickOnMouseUp){
      this.props.onClick();
    }
  }
  onMouseDown() {
    this.fireClickOnMouseUp = true;
  }

  onPanZoom() {
    if(this.blockPanZoomEvent) return;

    this.fireClickOnMouseUp = false;
    this.panZoomSettings = {pan: this.svgPanZoom.getPan(), zoom: this.svgPanZoom.getZoom()};

    this.mount.children[0].children[1].setAttribute('transform', this.mount.children[1].children[0].children[1].attributes['transform'].value)

    let linesShouldBold = Math.max(this.originalWidth, this.originalHeight) / this.svgPanZoom.getZoom() > 1500

    if(linesShouldBold && !this.bold){
      this.bold = true
      this.mount.children[1].className = 'Module bold-lines'
    } else if(!linesShouldBold && this.bold){
      this.bold = false
      this.mount.children[1].className = 'Module'
    }

  }

  writeSVG(module: Module, selectedState: State, selectedStateTransition: Number){

    const dot = generateDOT(module, selectedState, (selectedStateTransition: Number));
    if(dot === this.lastDOT){
      return;
    }

    this.lastDOT = dot;

    /* write SVG */
    try {
      this.mount.children[1].innerHTML= Viz(dot).replace('</svg>', svgDefs + '</svg>');
    } catch (ex) {
      alert('Invalid module: ' + ex.message)
      this.mount.children[1].innerHTML = `<svg width="10px" height="10px"/>`;
    }

    let svg = this.mount.children[1].children[0]

    /* Add event handlers for states */
    Object.keys(module.states).forEach( s => {
      let el = document.getElementById(`node_${s.replace('?','')}`);     

      if(el){
        // force rerender because of a pan bug
        el.addEventListener('mouseup', (e) => {this.lastDOT = null;e.stopPropagation(); this.props.onClick(s)});

        if(selectedState && s === selectedState.name){
          // assume path is at index 1 to speed things up.  bad assumption?
          el.children[1].setAttribute('filter', 'url(#outershadow)')
        } else {
          el.children[1].removeAttribute('filter')
        }
      }

    })

    // Removes the title elmeent generated by graph viz that causes a "G" to always show on mouse hover
    const unnecessaryGTitle = document.querySelector('svg > g > title');
    if(unnecessaryGTitle){
      unnecessaryGTitle.remove();
    }

    const unnecessaryFill = document.querySelector('svg > g > polygon');
    if(unnecessaryFill){
      unnecessaryFill.remove();
    }

    /* Add event handlers for transitions, and increase their 'hit box' size */
    document.querySelectorAll('.edge.transition').forEach( group => {
      let originator = group.querySelector('title').innerHTML.split('-&gt;')[0]
      let hitLine = group.querySelector('path').cloneNode(true)
      let transitionIndex = null;
      let transitionIndexClass = group.className.baseVal.split(' ').find(t => t.startsWith('transition-index'));
      if(transitionIndexClass){
        try{
          transitionIndex = parseInt(transitionIndexClass.split('_')[1])
        } catch(e){
          // just ignore if not a number
        }

      }
      hitLine.setAttribute('class', 'transition-hitbox');
      hitLine.setAttribute('stroke-width', 20)
      hitLine.setAttribute('opacity', 0)
      group.appendChild(hitLine)

      group.querySelectorAll('path,text').forEach( path => {
        // force rerender because of a pan bug
        path.addEventListener('mouseup', (e) => {this.lastDOT = null;e.stopPropagation(); this.props.onClick(originator, transitionIndex)});
      })
    })

    /* Bump the transition labels to the right because it is too crowded */
    document.querySelectorAll('svg .edge text').forEach(t => t.setAttribute('x', parseFloat(t.getAttribute('x'))+5))

    /* add pan/zoom if available */
    if(typeof svgPanZoom === "function"){

      this.originalWidth = svg.attributes.width.value.match(/\d+/g).map(Number)[0];
      this.originalHeight = svg.attributes.height.value.match(/\d+/g).map(Number)[0];

      let offsetLeft = this.mount.children[1].getBoundingClientRect().x
      let offsetTop = this.mount.children[1].getBoundingClientRect().y
      let visibleWidth = this.mount.children[1].getBoundingClientRect().width - offsetLeft;
      let visibleHeight = this.mount.children[1].getBoundingClientRect().height - offsetTop;

      this.mount.children[1].children[0].setAttribute('width', '100%')
      this.mount.children[1].children[0].setAttribute('height', '100%')

      let zoomFactor = 1

      if(this.originalWidth / this.originalHeight > visibleWidth / visibleHeight){
        //width constrained
        zoomFactor = visibleWidth / this.originalWidth;
      } else {
        //height constrained
        zoomFactor = visibleHeight / this.originalHeight;
      }

      this.svgPanZoom = svgPanZoom(this.mount.children[1].children[0],{
          controlIconsEnabled: false, // BUGGY BECAUSE OF EVENT HANDLERS 
          minZoom: .1,
          onPan: this.onPanZoom,
          onZoom: this.onPanZoom,
        });

      let panZoomControlsElement = document.getElementById('svg-pan-zoom-controls');

      if(panZoomControlsElement){
        /* DISABLED BECAUSE BUGGY WITH OTHER EVENT HANDLERS */
        panZoomControlsElement.setAttribute("transform", `translate(${visibleWidth-100} ${visibleHeight-150}) scale(.75)`)
        document.getElementById('svg-pan-zoom-zoom-in').addEventListener('mouseup', (e) => {this.svgPanZoom.zoomIn()});
        document.getElementById('svg-pan-zoom-zoom-out').addEventListener('mouseup', (e) => {this.svgPanZoom.zoomOut()});
        document.getElementById('svg-pan-zoom-reset-pan-zoom').addEventListener('mouseup', (e) => {
          e.stopPropagation();
          this.svgPanZoom.pan({x: this.svgPanZoom.getPan().x - offsetLeft/2 , y: 50}, true)
          this.svgPanZoom.zoom(Math.pow(.8,zoomFactor), true);
        });
      }

      if(!this.panZoomSettings){
        /* first time load of module */
        /* center and bump down a bit */
        this.svgPanZoom.pan({x: this.svgPanZoom.getPan().x - offsetLeft/2 , y: 50}, true)
        this.svgPanZoom.zoom(Math.pow(.8,zoomFactor), true);
      }

    }

  }
}

export default ModuleGraph;
