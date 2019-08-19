// @flow
import React from 'react';
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter} from 'connected-react-router'

import createAppStore, { history } from './store';
import Editor from './containers/Editor';

import { openModule } from './actions/router';

const store = createAppStore(history)

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={Editor} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

const dispatchLocationChange = location => {
  if(location.hash.charAt(0) === '#'){
    store.dispatch(openModule(location.hash.slice(1)));
  }
}

history.listen(dispatchLocationChange);

dispatchLocationChange(history.location);


export default App;
