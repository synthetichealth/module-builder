import { openModule } from './router'

export const loadLibrary = (modules) => {
  return (dispatch, getState) => {

    let currentModule = '';

    dispatch ({
      type: 'LOAD_LIBRARY',
      data: modules
    })

    if(getState().router.location.hash.charAt(0) === '#'){
      dispatch(openModule(getState().router.location.hash.slice(1)));
    }
  }
}

