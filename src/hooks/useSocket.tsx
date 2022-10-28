import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { StorageKeys } from '../types/storage';
import useSpikyService from './useSpikyService';

export const useSocket = (url: string) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const { getPendingNotifications } = useSpikyService();

    const connectSocket = useCallback(async () => {
        const token = await AsyncStorage.getItem(StorageKeys.TOKEN);
        const options = {
            transports: ['websocket'],
            autoConnect: true,
            forceNew: true,
            query: {
                'x-token': token,
            },
        };
        const socketTemp = io(url, options).connect();
        setSocket(socketTemp);
        getPendingNotifications();
    }, [url]);

    const disconnectSocket = useCallback(() => {
        socket?.disconnect();
    }, [socket]);

    return { socket, connectSocket, disconnectSocket };
};
