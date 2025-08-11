// @flow
import React, { useEffect } from 'react';
import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter, useLocation, useNavigate } from 'react-router-dom'

import createAppStore from './store';
import Editor from './containers/Editor';

import { openModule } from './actions/router';
import { setNavigate } from './utils/navigation';

const store = createAppStore()

// Helper function to handle hash-based navigation
const dispatchLocationChange = (location) => {
  if(location.hash.charAt(0) === '#'){
    store.dispatch(openModule(location.hash.slice(1)));
  }
}

// Component to handle location changes and set up navigation
const LocationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    const dispatchLocationChange = () => {
      const currentHash = window.location.hash;
      if(currentHash.charAt(0) === '#'){
        store.dispatch(openModule(currentHash.slice(1)));
      }
    }
    
    // Handle initial load and location changes
    dispatchLocationChange();
    
    // Listen for hash changes
    const handleHashChange = () => {
      dispatchLocationChange();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location]);
  
  return null;
}

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/module-builder">
        <LocationHandler />
        <Routes>
          <Route path="/" element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}


export default App;
