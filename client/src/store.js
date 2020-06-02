import { createStore, applyMiddleware, compose } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const socketURL =
  process.env.NODE_ENV === 'production'
    ? window.location.hostname
    : 'http://localhost:8800';

const initialState = {},
      socket = io(socketURL, {'transports': ['websocket', 'polling']}),
      socketIoMiddleware = createSocketIoMiddleware(socket, ''),
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