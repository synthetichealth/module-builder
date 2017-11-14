// @flow
import React, { Component } from 'react';
import { forceSimulation, forceLink, forceCenter, forceManyBody, forceCollide } from 'd3-force';
import { extent } from 'd3-array';

import type { State } from '../../types/State';

import './Module.css';


type Props = {
  states: State[],
  steps: number
}

type GraphTransition = {
  source: string,
  target: string,
  type: string
};

class ModuleGraph extends Component<Props> {

  simulation: null
  links: []

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
        transitions = node.transition.transitions.map((t) => {
          return {source: node.name, target: t.to, type:node.transition.type};
        })
        break;
        case 'Conditional':
          transitions = node.transition.transitions.map((t) => {
            return {source: node.name, target: t.to, type:node.transition.type};
          })
          break;
      default:

    }
    return transitions;
  }

  generateTransitions() {
    if(!this.simulation) {return}
    let nodes = this.simulation.nodes() || [];
    let links = []
    nodes.map((s) => {
      links = [].concat(links,this.generateTransition(s))
    });
      // if(s.transition && s.transition.to){
      //   let toIndex = nodes.find((n) => n.name === s.transition.to);
      //   if(toIndex) {
      //     return {
      //       source: s.index,
      //       target: toIndex.index
      //     }
      //   }
      // }
    //
    // });
    this.links = links;
    this.simulation.force("links", forceLink(links).id((d) => d.name))
      .force("collider", forceCollide((n) => 20).iterations(5))
      .force("charge", forceManyBody().strength(2))
      .force("center", forceCenter(500,500));
  }

  generateGraphData() {
    this.simulation = forceSimulation(this.props.states);
    this.generateTransitions();
    for (var i = 0; i < this.props.steps; i++) {
      this.simulation.tick();
    }
  }

  render() {
    this.generateGraphData();
    let nodes = this.simulation.nodes();
    let x = extent (nodes, (n) => n.x);
    let y  = extent (nodes, (n) => n.y);
    return (
        <svg viewBox= {`${x[0] * .8} ${y[0] * .8} ${x[1] * 1.2} ${y[1] * 1.2}`} height="100%" width="100%">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="18" refY="3" orient="auto" markerUnits="strokeWidth">
              <path className="marker" d="M0,0 L0,6 L9,3 z"/>
            </marker>
          </defs>
          <g transform="translate(0,0)">
            {this.links.map((l,i) => {
              return <line markerEnd="url(#arrow)" className={`${l.type.toLowerCase()}_transition`} key={i} x1={l.source.x} x2={l.target.x} y1={l.source.y} y2={l.target.y} stroke="black" strokeWidth="1px"/>
            })}
            {this.simulation.nodes().map((n) => {
              return <circle key={n.index} cx={n.x} cy={n.y} r={10} />
            })}
          </g>
        </svg>
    )
  }
}

export default ModuleGraph;
