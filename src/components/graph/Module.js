// @flow
import React, { Component } from 'react';
import { forceSimulation, forceLink, forceCenter, forceManyBody } from 'd3-force';
import { extent } from 'd3-array';

import type { State } from '../../types/State';


type Props = {
  states: State[],
  steps: number
}

class ModuleGraph extends Component<Props> {

  simulation: null
  links: []

  generateTransitions() {
    if(!this.simulation) {}
    let links = this.simulation.nodes().map((s) => {
      if(s.transition && s.transition.to){
        let toIndex = this.simulation.nodes().find((n) => n.name === s.transition.to);
        if(toIndex) {
          return {
            source: s.index,
            target: toIndex.index
          }
        }
      }

    }).filter((l) => l);
    this.links = links;
    this.simulation.force("links", forceLink(links))
      .force("charge", forceManyBody())
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
          <g transform="translate(0,0)">
            {this.simulation.nodes().map((n) => {
              return <circle key={n.index} cx={n.x} cy={n.y} r={10} />
            })}
            {this.links.map((l) => {
              return <line x1={l.source.x} x2={l.target.x} y1={l.source.y} y2={l.target.y} stroke="black" strokeWidth="1px"/>
            })}
          </g>
        </svg>
    )
  }
}

export default ModuleGraph;
