import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './Navigator';
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

const Container = () => {
    const dispatch = useAppDispatch();
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const spikyService = new SpikyService(config);
    const [isLoading, setLoading] = useState(false);

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
        validateToken();
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
