import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import library from './library';
import editor from './editor';
import analysis from './analysis';

export default (history) => combineReducers({
  router : connectRouter(history),
  library,
  editor,
  analysis
});
