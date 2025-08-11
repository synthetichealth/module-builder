// @flow
// Navigation utility for React Router v6

let navigateFunction = null;

export const setNavigate = (navigate) => {
  navigateFunction = navigate;
};

export const push = (path) => {
  // Handle hash navigation differently since React Router v6 with basename doesn't handle it properly
  if (path.startsWith('#')) {
    const moduleName = path.slice(1);
    if (moduleName) {
      window.location.hash = '#' + moduleName;
    } else {
      window.location.hash = '';
    }
  } else {
    // Regular navigation
    if (navigateFunction) {
      navigateFunction(path);
    } else {
      window.location.href = path;
    }
  }
  
  // Return Redux action for consistency
  return {
    type: 'NAVIGATE',
    payload: { path }
  };
};
