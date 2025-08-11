// Simple navigation reducer to handle navigation actions
const initialState = {
  currentPath: '/'
};

export default function navigation(state = initialState, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        currentPath: action.payload.path
      };
    default:
      return state;
  }
}
