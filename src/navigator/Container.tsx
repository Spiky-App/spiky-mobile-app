import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../helpers/navigator';
import { Navigator } from './Navigator';
import SplashScreen from '../screens/SplashScreen';
// Workaround to avoid error of axios [AxiosError: Unsupported protocol undefined:]
// import { config as dotenvconfig } from '../constants/config';
import Toast from '../components/common/Toast';
import { ModalAlert } from '../components/ModalAlert';
import SocketContextComponent from '../context/Socket/Component';
import useSpikyService from '../hooks/useSpikyService';
import { AppState, Platform } from 'react-native';
import { setAppState } from '../store/feature/ui/uiSlice';
import { useAppDispatch } from '../store/hooks';
import PushNotification from 'react-native-push-notification';

const Container = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setLoading] = useState(false);
    const { validateToken } = useSpikyService();

    async function handleValidateToken() {
        setLoading(true);
        await validateToken();
        setLoading(false);
    }

    useEffect(() => {
        handleValidateToken();

        const state = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                if (Platform.OS === 'ios') {
                    PushNotification.setApplicationIconBadgeNumber(0);
                }
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

    if (isLoading) {
        return <SplashScreen />;
    }

    // linking object takes care of deep linking
    // register in screens object any linkable screen you want
    // route.params.correo contains the email that wants to change password when spikyapp://changepassword/:correo
    const linking = {
        prefixes: ['spikyapp://'],
        config: {
            initialRouteName: 'HomeScreen',
            screens: {
                HomeScreen: {
                    path: 'homescreen',
                },
                ChangeForgotPasswordScreen: {
                    path: 'changeforgotpassword',
                },
                RegisterScreen: {
                    path: 'register',
                },
            },
        },
    };

    return (
        <SocketContextComponent>
            <NavigationContainer linking={linking} fallback={<SplashScreen />} ref={navigationRef}>
                <Toast>
                    <Navigator />
                </Toast>
                <ModalAlert />
            </NavigationContainer>
        </SocketContextComponent>
    );
};

export default Container;
