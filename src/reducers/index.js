import { combineReducers } from 'redux';

import library from './library';
import editor from './editor';
import analysis from './analysis';
import navigation from './navigation';

export default () => combineReducers({
  library,
  editor,
  analysis,
  navigation
});
