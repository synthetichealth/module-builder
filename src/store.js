import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import reducers from './reducers';

import modulesJSON from './mocks/modules';

const initialState = {modules: modulesJSON};
const enhancers = [];
const middleware = [];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const createAppStore = (history) => {
  middleware.push(routerMiddleware(history))
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )

  const store = createStore(
    reducers,
    initialState,
    composedEnhancers
  )

  return store;
}

export default createAppStore;
