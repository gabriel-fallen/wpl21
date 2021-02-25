
export const LIST  = 'list';
export const ISSUE = 'issue';
export const EDIT  = 'edit';

const initialState = { page: LIST, index: null };

export function pagesReducer(state = initialState, action) {
  switch(action.type) {
    case 'pages/goto': {
      return action.payload;
    }
    default:
      return state;
  }
}

export function goTo(page, index = null) {
  return {
    type: 'pages/goto',
    payload: { page, index }
  };
}
