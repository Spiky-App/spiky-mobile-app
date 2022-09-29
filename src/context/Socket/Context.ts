import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export interface ISocketContextProps {
    socket: Socket | undefined;
}

const SocketContext = createContext<ISocketContextProps>({
    socket: undefined,
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
