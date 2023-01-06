import React, { useEffect, useState } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { Navigator, RootStackParamList } from './Navigator';
import SplashScreen from '../screens/SplashScreen';
import { navigationRef } from '../helpers/navigator';
// Workaround to avoid error of axios [AxiosError: Unsupported protocol undefined:]
// import { config as dotenvconfig } from '../constants/config';
import Toast from '../components/common/Toast';
import { ModalAlert } from '../components/ModalAlert';
import SocketContextComponent from '../context/Socket/Component';
import useSpikyService from '../hooks/useSpikyService';
import { AppState, Platform } from 'react-native';
import { setAppState } from '../store/feature/ui/uiSlice';
import NetInfo from '@react-native-community/netinfo';
import NoConnectionScreen from '../screens/NoConnectionScreen';
import { useAppDispatch } from '../store/hooks';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../types/storage';
import { updateServiceConfig } from '../store/feature/serviceConfig/serviceConfigSlice';
import { signIn } from '../store/feature/auth/authSlice';
import { setUser } from '../store/feature/user/userSlice';

const Container = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [hasInternetConnection, setInternetConnection] = useState<boolean>(true);
    const { validateToken } = useSpikyService();

    async function handleValidateToken() {
        setLoading(true);
        const tokenStorage = await AsyncStorage.getItem(StorageKeys.TOKEN);
        if (tokenStorage) {
            const data = await validateToken(tokenStorage);
            if (data) {
                const {
                    token: token_return,
                    alias,
                    n_notificaciones,
                    id_universidad,
                    uid,
                    n_chatmensajes,
                } = data;
                await AsyncStorage.setItem(StorageKeys.TOKEN, token_return);
                dispatch(updateServiceConfig({ headers: { 'x-token': token_return } }));
                dispatch(signIn(token_return));
                dispatch(
                    setUser({
                        nickname: alias,
                        notificationsNumber: n_notificaciones,
                        newChatMessagesNumber: n_chatmensajes,
                        universityId: id_universidad,
                        id: uid,
                    })
                );
            }
        }
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

        const unsubscribe = NetInfo.addEventListener(networkState => {
            const { isConnected } = networkState;
            if (isConnected != hasInternetConnection && isConnected != null) {
                setInternetConnection(isConnected);
            }
        });

        return () => {
            state.remove();
            unsubscribe();
        };
    }, [hasInternetConnection]);

    if (!hasInternetConnection) {
        return <NoConnectionScreen />;
    }

    if (isLoading) {
        return <SplashScreen />;
    }

    // linking object takes care of deep linking
    // register in screens object any linkable screen you want
    // route.params.correo contains the email that wants to change password when spikyapp://changepassword/:correo
    const linking: LinkingOptions<RootStackParamList> = {
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
