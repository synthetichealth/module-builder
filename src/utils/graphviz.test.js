
// @flow
import modulesJSON from '../data/modules';
import generateDOT from './graphviz';
import Viz from 'viz.js';

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
