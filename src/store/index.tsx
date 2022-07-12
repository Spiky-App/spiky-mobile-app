import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import appReducer from './reducers';


export default createStore(appReducer, applyMiddleware(thunk));