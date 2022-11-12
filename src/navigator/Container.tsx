import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './Navigator';
import SplashScreen from '../screens/SplashScreen';
// Workaround to avoid error of axios [AxiosError: Unsupported protocol undefined:]
// import { config as dotenvconfig } from '../constants/config';
import Toast from '../components/common/Toast';
import { ModalAlert } from '../components/ModalAlert';
import SocketContextComponent from '../context/Socket/Component';
import useSpikyService from '../hooks/useSpikyService';
import { AppState } from 'react-native';
import { setAppState } from '../store/feature/ui/uiSlice';
import { useAppDispatch } from '../store/hooks';
const Container = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setLoading] = useState(false);
    const { validateToken } = useSpikyService();

    useEffect(() => {
        setLoading(true);
        const state = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                dispatch(setAppState('active'));
            }
            if (nextAppState.match(/inactive|background/)) {
                dispatch(setAppState('inactive'));
            }
        });

        return () => {
            state.remove();
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        validateToken();
        setLoading(false);
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <SocketContextComponent>
            <NavigationContainer>
                <Toast>
                    <Navigator />
                </Toast>
                <ModalAlert />
            </NavigationContainer>
        </SocketContextComponent>
    );
};

export default Container;
