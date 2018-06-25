import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux'

import library from './library';
import editor from './editor';
import analysis from './analysis';

export default combineReducers({
  library,
  editor,
  router,
  analysis
});
