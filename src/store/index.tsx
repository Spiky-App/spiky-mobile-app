import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import appReducer from './reducers';

const store = configureStore({ reducer: appReducer, middleware: [thunk] });

export default store;