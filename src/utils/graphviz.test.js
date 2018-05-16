
// @flow
import modulesJSON from '../data/modules';
import { generateDOT } from './graphviz';
import Viz from 'viz.js';
import { expect } from '../helpers/test_helper';

const bad_characters = '"\'><&.?';
modulesJSON[bad_characters] = {
  name:bad_characters,
  states: {
    "Initial": {
      "type": "Initial",
      "direct_transition": bad_characters
    }
  }
};

modulesJSON[bad_characters].states[bad_characters] = {"type": "Simple", direct_transition: "Initial"}

const onClick = () => null;

Object.keys(modulesJSON).map(k => (modulesJSON[k])).forEach( module => {
  it(`generates dot ${module.name} module without crashing`, () => {
    Viz(generateDOT(module));
  });
});
Object.keys(modulesJSON).map(k => (modulesJSON[k])).forEach( module => {
  it(`generates dot in ${module.name} without 'is nil undefined' or 'is not nil undefined'`, () => {
    const dot = generateDOT(module);
    // is nil and is not nil shouldn't be followed by a value
    expect(dot).to.not.include('is nil undefined');
    expect(dot).to.not.include('is not nil undefined');
  });
});
