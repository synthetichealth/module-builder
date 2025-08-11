import { openModule } from './router'

export const loadLibrary = (modules) => {
  return (dispatch, getState) => {

    dispatch ({
      type: 'LOAD_LIBRARY',
      data: modules
    })

    // Get current hash from window.location instead of router state
    if(window.location.hash.charAt(0) === '#'){
      dispatch(openModule(window.location.hash.slice(1)));
    }
  }
}

