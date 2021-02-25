import { applyMiddleware, combineReducers, createStore } from 'https://unpkg.com/redux@4.0.5/es/redux.mjs?module';

import { issuesReducer } from './issues.js';
import { pagesReducer } from './pages.js';

import { save } from '../models.js';


const rootReducer = combineReducers({
  issues: issuesReducer,
  currentIndex: pagesReducer
});

const localStoreMiddleware = storeAPI => next => action => {
  const result = next(action);
  const state = storeAPI.getState();
  // console.log('next state', state);
  save(state.issues);
  return result
};

const middleware = applyMiddleware(localStoreMiddleware);

const store = createStore(rootReducer, middleware);
export default store;
