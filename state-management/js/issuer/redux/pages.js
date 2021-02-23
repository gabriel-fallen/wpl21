
export function pagesReducer(state = null, action) {
  switch(action.type) {
    case 'pages/goto': {
      return action.payload;
    }
    default:
      return state;
  }
}

export function goTo(index) {
  return {
    type: 'pages/goto',
    payload: index
  };
}
