import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux'

import library from './library';
import editor from './editor';

export default combineReducers({
  library,
  editor,
  router
});
