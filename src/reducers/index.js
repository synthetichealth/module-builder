import { combineReducers } from 'redux';

import modules from './modules';
import editor from './editor';

export default combineReducers({
  modules,
  editor
});
