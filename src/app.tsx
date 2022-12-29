import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Container from './navigator/Container';
import { store } from './store';
import '@react-native-firebase/messaging';
import { getTokenDevice } from './helpers/getTokenDevice';

const App = () => {
    useEffect(() => {
        getTokenDevice();
    }, []);

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <Container />
            </Provider>
        </SafeAreaProvider>
    );
};

export default App;
