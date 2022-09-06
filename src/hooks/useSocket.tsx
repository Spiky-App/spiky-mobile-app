import { useEffect, useRef } from 'react';
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';

export const useSocket = (
    url: string,
    options?: Partial<ManagerOptions & SocketOptions> | undefined
): Socket => {
    const { current: socket } = useRef(io(url, options));
    const uid = useAppSelector((state: RootState) => state.user.id);

    useEffect(() => {
        if (uid === 0) {
            socket.close();
        }
    }, [uid]);

    return socket;
};
