import React from 'react';
import { Provider } from 'react-redux';
import Container from './navigator/Container';
import store from './store';

const App = () => (
  <Provider store={store}>
    <Container />
  </Provider>
);

export default App;
