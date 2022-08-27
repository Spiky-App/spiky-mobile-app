import React, { useEffect } from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import { useAppDispatch } from '../store/hooks';
import { setFilter } from '../store/feature/messages/messagesSlice';
import { useMensajes } from '../hooks/useMensajes';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerScreenProps } from '@react-navigation/drawer';
import MessagesFeed from '../components/MessagesFeed';

type Props = DrawerScreenProps<DrawerParamList, 'ProfileScreen'>;

export const ProfileScreen = ({ route }: Props) => {
    const alias = route.params?.alias;
    const dispatch = useAppDispatch();

    useEffect(function () {
        dispatch(setFilter('/perfil'));
    }, []);
    const { messages, moreMsg, fetchMessages } = useMensajes({ alias });

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'@' + alias} />
            <MessagesFeed
                messages={messages}
                loadMore={() => {
                    if (moreMsg) fetchMessages();
                }}
            />

            <FloatButton />
        </BackgroundPaper>
    );
};
