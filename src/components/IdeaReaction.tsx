import React, { useContext, useState } from 'react';
import useSpikyService from '../hooks/useSpikyService';
import { Message, IdeaType } from '../types/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SocketContext from '../context/Socket/Context';
import { setMessages } from '../store/feature/messages/messagesSlice';
import ReactionButton from './common/ReactionButton';
import { BlurView } from '@react-native-community/blur';
import { View } from 'react-native';

interface Props {
    messageId: number;
    isOwnerAndAnonymous: boolean;
}
export const IdeaReaction = ({ messageId, isOwnerAndAnonymous }: Props) => {
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const user = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();
    const { socket } = useContext(SocketContext);
    const { createIdeaReaction, createIdea } = useSpikyService();
    const [isLoading, setIsLoading] = useState(false);

    async function handleReaction(reaction: string[0]) {
        setIsLoading(true);
        const wasCreated = await createIdeaReaction(messageId, reaction, user.id);
        if (wasCreated) {
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === messageId) {
                    socket?.emit('notify', {
                        id_usuario1: msg.user.id,
                        id_usuario2: user.id,
                        id_mensaje: msg.id,
                        tipo: 1,
                    });
                    let isNew = true;
                    let reactions = msg.reactions.map(r => {
                        if (r.reaction === reaction) {
                            isNew = false;
                            return {
                                reaction: r.reaction,
                                count: r.count + 1,
                            };
                        } else {
                            return r;
                        }
                    });
                    if (isNew) {
                        reactions = [...reactions, { reaction, count: 1 }];
                    }
                    return {
                        ...msg,
                        reactions,
                        myReaction: reaction,
                    };
                } else {
                    return msg;
                }
            });
            dispatch(setMessages(messagesUpdated));
        }
        setIsLoading(false);
    }

    async function handleCreateIdeaX2() {
        setIsLoading(true);
        const wasCreated = await createIdea('', IdeaType.X2, messageId);
        if (wasCreated) {
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === messageId) {
                    socket?.emit('notify', {
                        id_usuario1: msg.user.id,
                        id_usuario2: user.id,
                        id_mensaje: msg.id,
                        tipo: 9,
                    });
                    return {
                        ...msg,
                        totalX2: msg.totalX2 + 1,
                        myX2: true,
                    };
                } else {
                    return msg;
                }
            });
            dispatch(setMessages(messagesUpdated));
        }
        setIsLoading(false);
    }

    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
                minHeight: 40,
            }}
        >
            <View
                style={{
                    position: 'absolute',
                    width: '100%',
                    minHeight: 40,
                    borderColor: '#01192e26',
                    borderWidth: 4,
                    borderRadius: 14,
                }}
            />
            <BlurView
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#01192e24',
                    borderRadius: 14,
                }}
                blurType="light"
                blurAmount={5}
                reducedTransparencyFallbackColor="white"
            />
            <View
                style={{
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    flex: 1,
                }}
            >
                <ReactionButton
                    handleReaction={!isLoading ? handleReaction : () => {}}
                    handleCreateIdeaX2={!isLoading ? handleCreateIdeaX2 : () => {}}
                    isOwnerAndAnonymous={isOwnerAndAnonymous}
                />
            </View>
        </View>
    );
};
