const ENDPOINT = 'http://localhost:4000';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
export const useSocket = () => {
    const dispatch = useDispatch();
    const [socketInstance, setSocket] = useState<Socket>();
    const [online, setOnline] = useState(false);
    const token = useAppSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        const currentSocket = io(ENDPOINT, {
            transports: ['websocket'],
            autoConnect: true,
            forceNew: true,
            query: {
                'x-token': token,
            },
        });
        currentSocket?.on('connect', () => setOnline(true));
        currentSocket?.on('disconnect', () => setOnline(false));
        currentSocket?.on('notify', resp => {
            console.log(resp);
        });
        currentSocket?.on('get-convers', resp => {
            console.log(resp);
        });
        currentSocket?.on('activechat', resp => {
            console.log(resp);
        });
        currentSocket?.on('add-conver', resp => {
            console.log(resp);
        });
        currentSocket?.on('chatmsg', resp => {
            console.log(resp);
        });

        setSocket(currentSocket);

        dispatch({ type: 'socket', socket: socketInstance });
    }, []);
    return {
        online,
    };
};
