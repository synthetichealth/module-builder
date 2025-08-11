import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import createRootReducer from './reducers';

const initialState = {}
const enhancers = [];
const middleware = [];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const createAppStore = () => {
  middleware.push(thunk)
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )

  const store = createStore(
    createRootReducer(), // root reducer
    initialState,
    composedEnhancers
  )
  return store;
}

export default createAppStore;
