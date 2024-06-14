import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { StorageKeys } from '../types/storage';

export const useSocket = (url: string) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);

    const connectSocket = useCallback(async () => {
        const token = await AsyncStorage.getItem(StorageKeys.TOKEN);
        const options = {
            transports: ['websocket'],
            autoConnect: true,
            forceNew: true,
            query: {
                'x-token': token,
                version: 'v1.2',
            },
        };
        const socketTemp = io(url, options).connect();
        setSocket(socketTemp);
    }, [url]);

    const disconnectSocket = useCallback(() => {
        socket?.disconnect();
    }, [socket]);

    return { socket, connectSocket, disconnectSocket };
};
