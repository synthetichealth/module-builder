import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux'

import modules from './modules';
import editor from './editor';

export default combineReducers({
  modules,
  editor,
  router
});
