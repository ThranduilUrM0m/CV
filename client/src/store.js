import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { home } from './reducers';

const reducers = combineReducers({
  home,
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;