// @flow
import React from 'react';
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import createAppStore from './store';
import Editor from './containers/Editor';

import { openModule } from './actions/router';

const history = createHistory()

const store = createAppStore(history)

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route path="/" component={Editor} />
      </ConnectedRouter>
    </Provider>
  );
}


// Intercept location change (hash changes) and send to a custom event
// This allows us to pull data from the read-only library

const dispatchLocationChange = location => {
  if(history.location.hash.charAt(0) === '#'){
    store.dispatch(openModule(history.location.hash.slice(1)));
  }
}

history.listen(dispatchLocationChange);

dispatchLocationChange(history.location);


export default App;
