import React, { useEffect, useState } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { Navigator, RootStackParamList } from './Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../types/storage';
import SpikyService from '../services/SpikyService';
import SplashScreen from '../screens/SplashScreen';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { signIn } from '../store/feature/auth/authSlice';
import { updateServiceConfig } from '../store/feature/serviceConfig/serviceConfigSlice';
import { setUser } from '../store/feature/user/userSlice';
// Workaround to avoid error of axios [AxiosError: Unsupported protocol undefined:]
// import { config as dotenvconfig } from '../constants/config';
import Toast from '../components/common/Toast';
import { ModalAlert } from '../components/ModalAlert';
import SocketContextComponent from '../context/Socket/Component';
import { AppState } from 'react-native';
import { setAppState } from '../store/feature/ui/uiSlice';
import NetInfo from '@react-native-community/netinfo';
import NoConnectionScreen from '../screens/NoConnectionScreen';

const Container = () => {
    const dispatch = useAppDispatch();
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const spikyService = new SpikyService(config);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [hasInternetConnection, setInternetConnection] = useState<boolean>(true);

    async function validateToken() {
        setLoading(true);
        const tokenStorage = await AsyncStorage.getItem(StorageKeys.TOKEN);
        if (tokenStorage) {
            try {
                const response = await spikyService.getAuthRenew(tokenStorage);
                const { data } = response;
                const { token, alias, n_notificaciones, id_universidad, uid, n_chatmensajes } =
                    data;
                await AsyncStorage.setItem(StorageKeys.TOKEN, token);
                dispatch(updateServiceConfig({ headers: { 'x-token': token } }));
                dispatch(signIn(token));
                dispatch(
                    setUser({
                        nickname: alias,
                        notificationsNumber: n_notificaciones,
                        newChatMessagesNumber: n_chatmensajes,
                        universityId: id_universidad,
                        id: uid,
                    })
                );
            } catch {
                await AsyncStorage.removeItem(StorageKeys.TOKEN);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        const state = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
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

    useEffect(() => {
        validateToken();
    }, []);

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
            <NavigationContainer linking={linking} fallback={<SplashScreen />}>
                <Toast>
                    <Navigator />
                </Toast>
                <ModalAlert />
            </NavigationContainer>
        </SocketContextComponent>
    );
};

export default Container;
