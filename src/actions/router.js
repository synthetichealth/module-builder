import {analyze} from  './analysis';

export const openModule = (key) => {

  return (dispatch, getState) => {
    let action = {type: 'OPEN_MODULE', data: {key}};

    if(!getState().editor.modules[key] && getState().library.modules[key]){
      action.data.libraryModule = getState().library.modules[key];
    }

    dispatch(action);
    if(getState().editor.modules[key]){
      dispatch(analyze(key, getState().editor.modules[key]));
    }
  }
}
