// @flow
import React, { Component } from 'react';
import { forceSimulation, forceLink, forceCenter, forceManyBody, forceCollide } from 'd3-force';
import { extent } from 'd3-array';

import ReactAnimationFrame from 'react-animation-frame';

import type { State } from '../../types/State';

import './Module.css';


type Props = {
  states: State[],
  steps: number,
  onClick: (id:string) => mixed
}

type GraphTransition = {
  source: string,
  target: string,
  type: string
};

class ModuleGraph extends Component<Props> {

  simulation: null
  links: []
  steps = 0;

  constructor(props) {
    super(props);
    this.simulation = forceSimulation();
    this.simulation.stop();
    this.generateGraphData(props.states);
  }

  generateTransition(node: State): GraphTransition[] {
    let transitions = [];
    if(!node.transition) {
      return transitions;
    }
    switch (node.transition.type) {
      case 'Direct':
        transitions = [{source: node.name, target: node.transition.to, type:node.transition.type}];
        break;
      case 'Distributed':
        transitions = node.transition.transition.map((t) => {
          return {source: node.name, target: t.to, type:node.transition.type};
        })
        break;
      case 'Conditional':
        transitions = node.transition.transition.map((t) => {
          return {source: node.name, target: t.to, type:node.transition.type};
        })
        break;
      default:

    }
    return transitions;
  }

  generateTransitions() {
    console.debug("Updating transitions");
    if(!this.simulation) {return}
    let nodes = this.simulation.nodes() || [];
    let links = []
    nodes.map((s) => {
      links = [].concat(links,this.generateTransition(s))
    });
    this.links = links;
    this.simulation.force("links", forceLink(links).id((d) => d.name))
      .force("collider", forceCollide((n) => 40).iterations(5))
      .force("charge", forceManyBody().strength(5))
      .force("center", forceCenter(500,500));
  }

  generateGraphData(states) {
    this.props.endAnimation()
    this.simulation.nodes(states);
    this.generateTransitions();
    this.props.startAnimation();
    // for (var i = 0; i < this.props.steps; i++) {
    //   this.simulation.tick();
    // }
  }

  onAnimationFrame() {
    if(this.steps > this.props.steps){
      this.props.endAnimation();
    }
    this.simulation.tick();
    this.forceUpdate()
    this.steps++;
  }

  componentWillReceiveProps(nextProps: Props){
    console.debug("Generating new graph");
    this.generateGraphData(nextProps.states);
    this.simulation.alpha(.3);
    this.steps = 0;
  }

  render() {
    let nodes = this.simulation.nodes();
    let x = extent (nodes, (n) => n.x);
    let y  = extent (nodes, (n) => n.y);
    return (
        <svg viewBox= "0 0 1000 1000" height="100%" width="100%">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="18" refY="3" orient="auto" markerUnits="strokeWidth">
              <path className="marker" d="M0,0 L0,6 L9,3 z"/>
            </marker>
          </defs>
          <g transform="translate(0,0)">
            {this.links.map((l,i) => {
              return <line markerEnd="url(#arrow)" className={`transition ${l.type.toLowerCase()}_transition`} key={i} x1={l.source.x} x2={l.target.x} y1={l.source.y} y2={l.target.y}/>
            })}
            {this.simulation.nodes().map((n) => {
              return (
                <g key={n.index} className='node' transform={`translate(${n.x},${n.y})`} onClick={() => this.props.onClick(n.name)}>
                  <circle  r={10} />
                  <text>{n.name}</text>
                </g>
              )
            })}
          </g>
        </svg>
    )
  }
}

export default ReactAnimationFrame(ModuleGraph);
