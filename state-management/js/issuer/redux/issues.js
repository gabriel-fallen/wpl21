import { Issues, load } from '../models.js';


const initialState = load();

export function issuesReducer(state = initialState, action) {
  switch(action.type) {
    case 'issues/added': {
      const issues = [...state.issues, action.payload];
      const newState = new Issues(issues);
      return newState;
    }
    case 'issue/toggleActive': {
      const index = action.payload;
      const issues = state.issues;
      issues[index].active = !issues[index].active;
      const newState = new Issues(issues);
      return newState;
    }
    default:
      return state;
  }
}

export function issueAdded(issue) {
  return {
    type: 'issues/added',
    payload: issue
  };
}

export function toggleActive(index) {
  return {
    type: 'issue/toggleActive',
    payload: index
  };
}
