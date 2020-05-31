import { createStore, applyMiddleware, compose } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

//io('change address') for production
const initialState = {},
      socket = io(''),
      socketIoMiddleware = createSocketIoMiddleware(socket, ""),
      middleware = [thunk, socketIoMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer, 
  initialState, 
  composeEnhancers(
    applyMiddleware(...middleware)
  )
);

export default store;